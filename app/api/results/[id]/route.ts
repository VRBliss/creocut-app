import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        analysis: true,
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    if (video.analysis) {
      const analysis = video.analysis;
      return NextResponse.json({
        video: {
          id: video.id,
          sourceType: video.sourceType,
          youtubeUrl: video.youtubeUrl,
          fileName: video.fileName,
          title: video.title,
          duration: video.duration,
          thumbnailUrl: video.thumbnailUrl,
          targetAudience: video.targetAudience,
          analysisStatus: video.analysisStatus,
          createdAt: video.createdAt,
        },
        analysis: {
          overallScore: analysis.overallScore,
          editQualityScore: analysis.editQualityScore,
          pacingScore: analysis.pacingScore,
          retentionScore: analysis.retentionScore,
          overallFeedback: analysis.overallFeedback,
          strengths: JSON.parse(analysis.strengths),
          weaknesses: JSON.parse(analysis.weaknesses),
          editAnalysis: JSON.parse(analysis.editAnalysis),
          pacingAnalysis: JSON.parse(analysis.pacingAnalysis),
          audioAnalysis: JSON.parse(analysis.audioAnalysis),
          riskZones: JSON.parse(analysis.riskZones),
          recommendations: JSON.parse(analysis.recommendations),
          benchmarkData: analysis.benchmarkData ? JSON.parse(analysis.benchmarkData) : null,
        },
      });
    }

    return NextResponse.json({
      video: {
        id: video.id,
        sourceType: video.sourceType,
        youtubeUrl: video.youtubeUrl,
        fileName: video.fileName,
        title: video.title,
        duration: video.duration,
        thumbnailUrl: video.thumbnailUrl,
        targetAudience: video.targetAudience,
        analysisStatus: video.analysisStatus,
        createdAt: video.createdAt,
      },
      analysis: null,
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
