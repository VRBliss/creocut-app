import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface VideoAnalysisInput {
  targetAudience: 'gen_z' | 'millennials' | 'gen_x' | 'baby_boomers';
  videoMetadata: {
    title?: string;
    duration?: number;
    description?: string;
  };
}

export interface RiskZone {
  timestamp: number;
  endTimestamp: number;
  severity: 'high' | 'medium' | 'low';
  issue: string;
  suggestion: string;
}

export interface AnalysisResult {
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
}

const audienceProfiles = {
  gen_z: {
    name: 'Gen Z',
    characteristics: 'Fast-paced, trend-aware, meme culture, short attention span, authentic, visual-first',
    preferences: 'Quick cuts, trending music, relatable humor, mobile-optimized, captions/text overlays',
    retention_keys: 'Hook in first 3 seconds, rapid pacing, trend integration, authentic personality'
  },
  millennials: {
    name: 'Millennials',
    characteristics: 'Story-driven, value authenticity, appreciate quality production, nostalgic',
    preferences: 'Narrative structure, polished but authentic, meaningful content, clear value proposition',
    retention_keys: 'Strong storytelling, relatable experiences, quality over quantity, emotional connection'
  },
  gen_x: {
    name: 'Gen X',
    characteristics: 'Skeptical, independent, value straightforward information, practical',
    preferences: 'Clear structure, informative, no-nonsense approach, credible sources',
    retention_keys: 'Direct value delivery, credibility, practical takeaways, respect their time'
  },
  baby_boomers: {
    name: 'Baby Boomers',
    characteristics: 'Traditional, detail-oriented, prefer clear explanations, patient viewers',
    preferences: 'Slower pacing, thorough explanations, professional presentation, clear audio',
    retention_keys: 'Clear structure, thorough coverage, professional quality, respect and formality'
  }
};

export async function analyzeVideoWithGemini(input: VideoAnalysisInput): Promise<AnalysisResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const audienceProfile = audienceProfiles[input.targetAudience];
  
  const prompt = `You are a senior video editor and content strategist analyzing a video for maximum retention.

TARGET AUDIENCE: ${audienceProfile.name}
Characteristics: ${audienceProfile.characteristics}
Preferences: ${audienceProfile.preferences}
Retention Keys: ${audienceProfile.retention_keys}

VIDEO METADATA:
- Title: ${input.videoMetadata.title || 'Unknown'}
- Duration: ${input.videoMetadata.duration ? `${Math.floor(input.videoMetadata.duration / 60)}:${(input.videoMetadata.duration % 60).toString().padStart(2, '0')}` : 'Unknown'}
- Description: ${input.videoMetadata.description || 'Not provided'}

Provide a comprehensive analysis of this video's edit quality, pacing, and effectiveness for the target audience. Your analysis should be honest, direct, and actionable.

Return your analysis in the following JSON format:

{
  "overallScore": <0-100>,
  "editQualityScore": <0-100>,
  "pacingScore": <0-100>,
  "retentionScore": <0-100>,
  "overallFeedback": "<2-3 sentences of direct, honest feedback>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "editAnalysis": {
    "transitions": "<analysis of transition quality and appropriateness>",
    "cutQuality": "<analysis of cut timing and rhythm>",
    "visualEffects": "<analysis of effects usage and relevance>"
  },
  "pacingAnalysis": {
    "rhythm": "<analysis of overall rhythm and tempo>",
    "engagement": "<analysis of engagement maintenance>",
    "momentum": "<analysis of momentum building>"
  },
  "audioAnalysis": {
    "musicChoice": "<analysis of music selection>",
    "soundDesign": "<analysis of sound effects and mixing>",
    "audienceAlignment": "<how well audio aligns with target audience>"
  },
  "riskZones": [
    {
      "timestamp": <seconds>,
      "endTimestamp": <seconds>,
      "severity": "high|medium|low",
      "issue": "<what's wrong>",
      "suggestion": "<how to fix it>"
    }
  ],
  "recommendations": [
    "<specific, actionable recommendation 1>",
    "<specific, actionable recommendation 2>",
    "<specific, actionable recommendation 3>",
    "<specific, actionable recommendation 4>",
    "<specific, actionable recommendation 5>"
  ]
}

Be specific, be honest, and focus on actionable insights that will improve retention for ${audienceProfile.name} viewers.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Extract JSON from response (remove markdown code blocks if present)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response: no JSON object found in response');
  }

  let analysis: AnalysisResult;
  try {
    analysis = JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    throw new Error(`Failed to parse AI response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
  }

  // Validate required fields exist
  if (typeof analysis.overallScore !== 'number' || !Array.isArray(analysis.strengths)) {
    throw new Error('AI response is missing required fields');
  }

  return analysis;
}

export async function analyzeVideoDescription(description: string, targetAudience: string): Promise<Partial<AnalysisResult>> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Based on this video description, provide initial insights about potential strengths and areas of concern for ${targetAudience} audience:

"${description}"

Return a JSON object with:
{
  "initialInsights": "<brief analysis>",
  "potentialStrengths": ["<strength 1>", "<strength 2>"],
  "potentialConcerns": ["<concern 1>", "<concern 2>"]
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {};
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {};
  }
}
