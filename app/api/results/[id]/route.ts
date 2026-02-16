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

      const safeJsonParse = (value: string, fallback: unknown = null) => {
        try {
          return JSON.parse(value);
        } catch {
          console.error('Failed to parse JSON field:', value.slice(0, 100));
          return fallback;
        }
      };

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
          strengths: safeJsonParse(analysis.strengths, []),
          weaknesses: safeJsonParse(analysis.weaknesses, []),
          editAnalysis: safeJsonParse(analysis.editAnalysis, { transitions: '', cutQuality: '', visualEffects: '' }),
          pacingAnalysis: safeJsonParse(analysis.pacingAnalysis, { rhythm: '', engagement: '', momentum: '' }),
          audioAnalysis: safeJsonParse(analysis.audioAnalysis, { musicChoice: '', soundDesign: '', audienceAlignment: '' }),
          riskZones: safeJsonParse(analysis.riskZones, []),
          recommendations: safeJsonParse(analysis.recommendations, []),
          benchmarkData: analysis.benchmarkData ? safeJsonParse(analysis.benchmarkData, null) : null,
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
