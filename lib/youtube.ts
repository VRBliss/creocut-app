import { google } from 'googleapis';

if (!process.env.YOUTUBE_API_KEY) {
  console.warn('WARNING: YOUTUBE_API_KEY environment variable is not set');
}

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export interface YouTubeVideoData {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  thumbnailUrl: string;
  channelName: string;
  views: number;
  likes: number;
  publishedAt: Date;
  category: string;
  tags: string[];
}

export interface BenchmarkVideoData {
  id: string;
  title: string;
  channelName: string;
  views: number;
  likes: number;
  duration: number;
  publishedAt: Date;
  engagement: number; // likes/views ratio
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  return hours * 3600 + minutes * 60 + seconds;
}

export async function getVideoData(videoId: string): Promise<YouTubeVideoData> {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error('YOUTUBE_API_KEY environment variable is not configured');
  }

  const response = await youtube.videos.list({
    part: ['snippet', 'contentDetails', 'statistics'],
    id: [videoId],
  });

  const video = response.data.items?.[0];
  if (!video) {
    throw new Error('Video not found');
  }

  const snippet = video.snippet;
  const contentDetails = video.contentDetails;
  const statistics = video.statistics;

  if (!snippet || !contentDetails || !statistics) {
    throw new Error('Incomplete video data returned from YouTube API');
  }

  return {
    id: videoId,
    title: snippet.title || '',
    description: snippet.description || '',
    duration: parseDuration(contentDetails.duration || ''),
    thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
    channelName: snippet.channelTitle || '',
    views: parseInt(statistics.viewCount || '0'),
    likes: parseInt(statistics.likeCount || '0'),
    publishedAt: new Date(snippet.publishedAt || ''),
    category: snippet.categoryId || '',
    tags: snippet.tags || [],
  };
}

export async function searchSimilarVideos(
  title: string,
  category: string,
  maxResults: number = 10
): Promise<BenchmarkVideoData[]> {
  try {
    // Extract keywords from title for better search
    const keywords = title
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 5)
      .join(' ');

    const searchResponse = await youtube.search.list({
      part: ['snippet'],
      q: keywords,
      type: ['video'],
      maxResults,
      order: 'viewCount',
      videoCategoryId: category || undefined,
    });

    const videoIds = searchResponse.data.items
      ?.map(item => item.id?.videoId)
      .filter((id): id is string => !!id) || [];

    if (videoIds.length === 0) {
      return [];
    }

    const videosResponse = await youtube.videos.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      id: videoIds,
    });

    const benchmarkVideos: BenchmarkVideoData[] = [];

    for (const video of videosResponse.data.items || []) {
      const snippet = video.snippet;
      const contentDetails = video.contentDetails;
      const statistics = video.statistics;

      if (!snippet || !contentDetails || !statistics) continue;

      const views = parseInt(statistics.viewCount || '0');
      const likes = parseInt(statistics.likeCount || '0');

      benchmarkVideos.push({
        id: video.id || '',
        title: snippet.title || '',
        channelName: snippet.channelTitle || '',
        views,
        likes,
        duration: parseDuration(contentDetails.duration || ''),
        publishedAt: new Date(snippet.publishedAt || ''),
        engagement: views > 0 ? likes / views : 0,
      });
    }

    return benchmarkVideos;
  } catch (error) {
    console.error('Error searching for similar videos:', error);
    return [];
  }
}

export async function getBenchmarkInsights(
  videoData: YouTubeVideoData,
  similarVideos: BenchmarkVideoData[]
): Promise<{
  avgViews: number;
  avgEngagement: number;
  performanceVsBenchmark: string;
  insights: string[];
}> {
  if (similarVideos.length === 0) {
    return {
      avgViews: 0,
      avgEngagement: 0,
      performanceVsBenchmark: 'No benchmark data available',
      insights: [],
    };
  }

  const avgViews = similarVideos.reduce((sum, v) => sum + Number(v.views), 0) / similarVideos.length;
  const avgEngagement = similarVideos.reduce((sum, v) => sum + v.engagement, 0) / similarVideos.length;

  const videoEngagement = videoData.views > 0 ? videoData.likes / videoData.views : 0;

  let performanceVsBenchmark = 'average';
  if (videoData.views > avgViews * 1.5) {
    performanceVsBenchmark = 'above average';
  } else if (videoData.views < avgViews * 0.5) {
    performanceVsBenchmark = 'below average';
  }

  const insights: string[] = [];

  if (videoData.views > avgViews && avgViews > 0) {
    insights.push(`Your video is outperforming similar content with ${((videoData.views / avgViews - 1) * 100).toFixed(1)}% more views`);
  } else if (videoData.views > 0 && avgViews > 0) {
    insights.push(`Similar videos average ${((avgViews / videoData.views - 1) * 100).toFixed(1)}% more views - there's room for growth`);
  } else {
    insights.push('Not enough view data to compare performance');
  }

  if (videoEngagement > avgEngagement && avgEngagement > 0) {
    insights.push(`Your engagement rate is ${((videoEngagement / avgEngagement - 1) * 100).toFixed(1)}% higher than similar videos`);
  } else if (videoEngagement > 0 && avgEngagement > 0) {
    insights.push(`Engagement could be improved - similar videos have ${((avgEngagement / videoEngagement - 1) * 100).toFixed(1)}% better like ratios`);
  } else {
    insights.push('Not enough engagement data to compare');
  }

  return {
    avgViews,
    avgEngagement,
    performanceVsBenchmark,
    insights,
  };
}
