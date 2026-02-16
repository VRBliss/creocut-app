'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Video,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  BarChart3,
  Clock,
  Users,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface RiskZone {
  timestamp: number;
  endTimestamp: number;
  severity: 'high' | 'medium' | 'low';
  issue: string;
  suggestion: string;
}

interface Analysis {
  overallScore: number;
  editQualityScore: number;
  pacingScore: number;
  retentionScore: number;
  overallFeedback: string;
  strengths: string[];
  weaknesses: string[];
  editAnalysis: {
    transitions: string;
    cutQuality: string;
    visualEffects: string;
  };
  pacingAnalysis: {
    rhythm: string;
    engagement: string;
    momentum: string;
  };
  audioAnalysis: {
    musicChoice: string;
    soundDesign: string;
    audienceAlignment: string;
  };
  riskZones: RiskZone[];
  recommendations: string[];
  benchmarkData?: {
    avgViews: number;
    avgEngagement: number;
    performanceVsBenchmark: string;
    insights: string[];
  };
}

interface VideoData {
  id: string;
  sourceType: string;
  youtubeUrl?: string;
  fileName?: string;
  title?: string;
  duration?: number;
  thumbnailUrl?: string;
  targetAudience: string;
  analysisStatus: string;
  createdAt: string;
}

const audienceLabels: Record<string, string> = {
  gen_z: 'Gen Z',
  millennials: 'Millennials',
  gen_x: 'Gen X',
  baby_boomers: 'Baby Boomers',
};

export default function ResultsPage() {
  const params = useParams();
  const [video, setVideo] = useState<VideoData | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/results/${params.id}`);
        const data = await response.json();

        if (cancelled) return;

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch results');
        }

        setVideo(data.video);
        setAnalysis(data.analysis);

        // If still processing, poll for updates
        if (data.video.analysisStatus === 'processing' || data.video.analysisStatus === 'pending') {
          timeoutRef.current = setTimeout(fetchResults, 3000);
        } else {
          setLoading(false);
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchResults();

    return () => {
      cancelled = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [params.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-600 to-emerald-600';
    if (score >= 60) return 'from-yellow-600 to-orange-600';
    return 'from-red-600 to-pink-600';
  };

  if (loading || !video) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-4 text-purple-500 animate-spin" />
          <h2 className="text-2xl font-bold text-white mb-2">
            {video?.analysisStatus === 'processing' ? 'Analyzing Your Video...' : 'Loading Results...'}
          </h2>
          <p className="text-slate-400">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error || video.analysisStatus === 'failed') {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center max-w-md">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-white mb-2">Analysis Failed</h2>
          <p className="text-slate-400 mb-6">{error || 'Something went wrong during analysis'}</p>
          <Link
            href="/wizard"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-4 text-purple-500 animate-spin" />
          <h2 className="text-2xl font-bold text-white mb-2">Processing...</h2>
        </div>
      </div>
    );
  }

  const radarData = [
    { metric: 'Overall', score: analysis.overallScore },
    { metric: 'Edit Quality', score: analysis.editQualityScore },
    { metric: 'Pacing', score: analysis.pacingScore },
    { metric: 'Retention', score: analysis.retentionScore },
  ];

  const retentionData = video.duration
    ? Array.from({ length: Math.ceil(video.duration / 10) }, (_, i) => {
        const timestamp = i * 10;
        const riskZone = analysis.riskZones.find(
          (zone) => timestamp >= zone.timestamp && timestamp <= zone.endTimestamp
        );
        return {
          time: formatTime(timestamp),
          retention: riskZone ? (riskZone.severity === 'high' ? 30 : riskZone.severity === 'medium' ? 60 : 80) : 90,
        };
      })
    : [];

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-slate-700">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <Video className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">CreoCut</h1>
        </Link>
        <Link
          href="/wizard"
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
        >
          Analyze Another
        </Link>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          href="/wizard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Wizard
        </Link>

        {/* Video Info */}
        <div className="card mb-8 p-6">
          <div className="flex items-start gap-6">
            {video.thumbnailUrl && (
              <Image
                src={video.thumbnailUrl}
                alt={video.title || 'Video thumbnail'}
                width={192}
                height={108}
                className="w-48 h-auto rounded-lg"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{video.title || video.fileName}</h1>
              <div className="flex items-center gap-4 text-slate-400">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {audienceLabels[video.targetAudience]}
                </span>
                {video.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(video.duration)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Overall Score */}
        <div className="card mb-8 p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-400 mb-4">Overall Score</h2>
          <div
            className={`text-7xl font-bold ${getScoreColor(analysis.overallScore)} mb-4`}
          >
            {analysis.overallScore}
            <span className="text-3xl">/100</span>
          </div>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">{analysis.overallFeedback}</p>
        </div>

        {/* Score Breakdown */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Scores Grid */}
          <div className="space-y-4">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-white">Edit Quality</h3>
                <span className={`text-2xl font-bold ${getScoreColor(analysis.editQualityScore)}`}>
                  {analysis.editQualityScore}
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getScoreGradient(analysis.editQualityScore)}`}
                  style={{ width: `${analysis.editQualityScore}%` }}
                />
              </div>
            </div>

            <div className="card p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-white">Pacing</h3>
                <span className={`text-2xl font-bold ${getScoreColor(analysis.pacingScore)}`}>
                  {analysis.pacingScore}
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getScoreGradient(analysis.pacingScore)}`}
                  style={{ width: `${analysis.pacingScore}%` }}
                />
              </div>
            </div>

            <div className="card p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-white">Retention Potential</h3>
                <span className={`text-2xl font-bold ${getScoreColor(analysis.retentionScore)}`}>
                  {analysis.retentionScore}
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getScoreGradient(analysis.retentionScore)}`}
                  style={{ width: `${analysis.retentionScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-4 text-center">Performance Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#94a3b8" />
                <Radar name="Score" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-300">
                  <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-white">Areas for Improvement</h3>
            </div>
            <ul className="space-y-3">
              {analysis.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-300">
                  <TrendingDown className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Retention Timeline */}
        {retentionData.length > 0 && (
          <div className="card p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Estimated Retention Timeline</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Line type="monotone" dataKey="retention" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Risk Zones */}
        {analysis.riskZones.length > 0 && (
          <div className="card p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">Risk Zones</h3>
            </div>
            <div className="space-y-4">
              {analysis.riskZones.map((zone, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    zone.severity === 'high'
                      ? 'bg-red-900/20 border-red-500'
                      : zone.severity === 'medium'
                      ? 'bg-yellow-900/20 border-yellow-500'
                      : 'bg-blue-900/20 border-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold text-white">
                        {formatTime(zone.timestamp)} - {formatTime(zone.endTimestamp)}
                      </span>
                      <span
                        className={`ml-2 text-xs px-2 py-1 rounded ${
                          zone.severity === 'high'
                            ? 'bg-red-500/20 text-red-300'
                            : zone.severity === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {zone.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-2">
                    <strong>Issue:</strong> {zone.issue}
                  </p>
                  <p className="text-slate-400 text-sm">
                    <strong>Suggestion:</strong> {zone.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Analysis */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Edit Analysis</h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-slate-400 mb-1">Transitions</h4>
                <p className="text-slate-300">{analysis.editAnalysis.transitions}</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-400 mb-1">Cut Quality</h4>
                <p className="text-slate-300">{analysis.editAnalysis.cutQuality}</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-400 mb-1">Visual Effects</h4>
                <p className="text-slate-300">{analysis.editAnalysis.visualEffects}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Pacing Analysis</h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-slate-400 mb-1">Rhythm</h4>
                <p className="text-slate-300">{analysis.pacingAnalysis.rhythm}</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-400 mb-1">Engagement</h4>
                <p className="text-slate-300">{analysis.pacingAnalysis.engagement}</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-400 mb-1">Momentum</h4>
                <p className="text-slate-300">{analysis.pacingAnalysis.momentum}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Audio Analysis</h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold text-slate-400 mb-1">Music Choice</h4>
                <p className="text-slate-300">{analysis.audioAnalysis.musicChoice}</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-400 mb-1">Sound Design</h4>
                <p className="text-slate-300">{analysis.audioAnalysis.soundDesign}</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-400 mb-1">Audience Alignment</h4>
                <p className="text-slate-300">{analysis.audioAnalysis.audienceAlignment}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="card p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Recommendations</h3>
          </div>
          <ul className="space-y-3">
            {analysis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3 text-slate-300">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-purple-600 rounded-full text-sm font-bold">
                  {index + 1}
                </span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Benchmark Data */}
        {analysis.benchmarkData && (
          <div className="card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Performance vs Similar Videos</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <p className="text-slate-400 mb-1">Avg Views</p>
                <p className="text-2xl font-bold text-white">
                  {(analysis.benchmarkData.avgViews / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 mb-1">Avg Engagement</p>
                <p className="text-2xl font-bold text-white">
                  {(analysis.benchmarkData.avgEngagement * 100).toFixed(2)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 mb-1">Performance</p>
                <p className="text-2xl font-bold text-purple-400 capitalize">
                  {analysis.benchmarkData.performanceVsBenchmark}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {analysis.benchmarkData.insights.map((insight, index) => (
                <p key={index} className="text-slate-300 flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  {insight}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
