import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import prisma from '@/lib/prisma';
import { extractVideoId, getVideoData, searchSimilarVideos, getBenchmarkInsights } from '@/lib/youtube';
import { analyzeVideoWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const targetAudience = formData.get('targetAudience') as string;
    const sourceType = formData.get('sourceType') as string;

    if (!targetAudience || !sourceType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let videoData: any = {
      sourceType,
      targetAudience,
      analysisStatus: 'processing',
    };

    // Handle YouTube URL
    if (sourceType === 'youtube') {
      const youtubeUrl = formData.get('youtubeUrl') as string;
      if (!youtubeUrl) {
        return NextResponse.json(
          { error: 'YouTube URL is required' },
          { status: 400 }
        );
      }

      const videoId = extractVideoId(youtubeUrl);
      if (!videoId) {
        return NextResponse.json(
          { error: 'Invalid YouTube URL' },
          { status: 400 }
        );
      }

      // Fetch YouTube video data
      let ytData;
      try {
        ytData = await getVideoData(videoId);
      } catch (error) {
        console.error('YouTube API error:', error);
        const message = error instanceof Error ? error.message : 'Failed to fetch YouTube video data';
        return NextResponse.json(
          { error: message },
          { status: 400 }
        );
      }

      videoData.youtubeUrl = youtubeUrl;
      videoData.title = ytData.title;
      videoData.duration = ytData.duration;
      videoData.thumbnailUrl = ytData.thumbnailUrl;

      // Create video record in database
      let video;
      try {
        video = await prisma.video.create({
          data: videoData,
        });
      } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
          { error: 'Failed to save video data to database. Please check your database connection.' },
          { status: 500 }
        );
      }

      // Start background analysis
      analyzeYouTubeVideo(video.id, ytData, targetAudience).catch(err => {
        console.error('Background analysis error:', err);
      });

      return NextResponse.json({
        videoId: video.id,
        message: 'Analysis started',
      });
    }

    // Handle file upload
    if (sourceType === 'upload') {
      const file = formData.get('file') as File;
      if (!file) {
        return NextResponse.json(
          { error: 'Video file is required' },
          { status: 400 }
        );
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'uploads');
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Save file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = join(uploadsDir, fileName);

      await writeFile(filePath, buffer);

      videoData.fileName = file.name;
      videoData.filePath = filePath;
      videoData.title = file.name.replace(/\.[^/.]+$/, ''); // Remove extension

      // Create video record
      let video;
      try {
        video = await prisma.video.create({
          data: videoData,
        });
      } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
          { error: 'Failed to save video data to database. Please check your database connection.' },
          { status: 500 }
        );
      }

      // Start background analysis
      analyzeUploadedVideo(video.id, file.name, targetAudience).catch(err => {
        console.error('Background analysis error:', err);
      });

      return NextResponse.json({
        videoId: video.id,
        message: 'Upload successful, analysis started',
      });
    }

    return NextResponse.json(
      { error: 'Invalid source type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function analyzeYouTubeVideo(
  videoId: string,
  ytData: any,
  targetAudience: string
) {
  try {
    // Get similar videos for benchmarking
    const similarVideos = await searchSimilarVideos(ytData.title, ytData.category, 10);
    const benchmarkInsights = await getBenchmarkInsights(ytData, similarVideos);

    // Analyze with Gemini
    const analysis = await analyzeVideoWithGemini({
      targetAudience: targetAudience as any,
      videoMetadata: {
        title: ytData.title,
        duration: ytData.duration,
        description: ytData.description,
      },
    });

    // Store benchmark videos
    for (const similar of similarVideos) {
      try {
        await prisma.benchmarkVideo.upsert({
          where: { youtubeId: similar.id },
          update: {
            views: BigInt(similar.views),
            likes: BigInt(similar.likes),
          },
          create: {
            youtubeId: similar.id,
            title: similar.title,
            channelName: similar.channelName,
            views: BigInt(similar.views),
            likes: BigInt(similar.likes),
            duration: similar.duration,
            publishedAt: similar.publishedAt,
            engagement: similar.engagement,
          },
        });
      } catch (err) {
        console.error(`Failed to upsert benchmark video ${similar.id}:`, err);
      }
    }

    // Create analysis record
    await prisma.analysis.create({
      data: {
        videoId,
        overallScore: analysis.overallScore,
        editQualityScore: analysis.editQualityScore,
        pacingScore: analysis.pacingScore,
        retentionScore: analysis.retentionScore,
        overallFeedback: analysis.overallFeedback,
        strengths: JSON.stringify(analysis.strengths),
        weaknesses: JSON.stringify(analysis.weaknesses),
        editAnalysis: JSON.stringify(analysis.editAnalysis),
        pacingAnalysis: JSON.stringify(analysis.pacingAnalysis),
        audioAnalysis: JSON.stringify(analysis.audioAnalysis),
        riskZones: JSON.stringify(analysis.riskZones),
        recommendations: JSON.stringify(analysis.recommendations),
        benchmarkData: JSON.stringify(benchmarkInsights),
        geminiResponse: JSON.stringify(analysis),
      },
    });

    // Update video status
    await prisma.video.update({
      where: { id: videoId },
      data: { analysisStatus: 'completed' },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    await prisma.video.update({
      where: { id: videoId },
      data: { analysisStatus: 'failed' },
    });
  }
}

async function analyzeUploadedVideo(
  videoId: string,
  fileName: string,
  targetAudience: string
) {
  try {
    // For uploaded videos, we'll do a basic analysis without YouTube data
    const analysis = await analyzeVideoWithGemini({
      targetAudience: targetAudience as any,
      videoMetadata: {
        title: fileName,
        duration: undefined, // Would need video processing library to extract
        description: '',
      },
    });

    // Create analysis record
    await prisma.analysis.create({
      data: {
        videoId,
        overallScore: analysis.overallScore,
        editQualityScore: analysis.editQualityScore,
        pacingScore: analysis.pacingScore,
        retentionScore: analysis.retentionScore,
        overallFeedback: analysis.overallFeedback,
        strengths: JSON.stringify(analysis.strengths),
        weaknesses: JSON.stringify(analysis.weaknesses),
        editAnalysis: JSON.stringify(analysis.editAnalysis),
        pacingAnalysis: JSON.stringify(analysis.pacingAnalysis),
        audioAnalysis: JSON.stringify(analysis.audioAnalysis),
        riskZones: JSON.stringify(analysis.riskZones),
        recommendations: JSON.stringify(analysis.recommendations),
        geminiResponse: JSON.stringify(analysis),
      },
    });

    // Update video status
    await prisma.video.update({
      where: { id: videoId },
      data: { analysisStatus: 'completed' },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    await prisma.video.update({
      where: { id: videoId },
      data: { analysisStatus: 'failed' },
    });
  }
}
