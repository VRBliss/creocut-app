'use client';

import { useState } from 'react';
import { Upload, Video, ArrowRight, Youtube, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type SourceType = 'youtube' | 'upload' | null;
type Audience = 'gen_z' | 'millennials' | 'gen_x' | 'baby_boomers' | null;

const audienceOptions = [
  { value: 'gen_z' as const, label: 'Gen Z', description: '1997-2012 • Fast cuts, trends, memes' },
  { value: 'millennials' as const, label: 'Millennials', description: '1981-1996 • Story-driven, authentic' },
  { value: 'gen_x' as const, label: 'Gen X', description: '1965-1980 • Straightforward, informative' },
  { value: 'baby_boomers' as const, label: 'Baby Boomers', description: '1946-1964 • Traditional, detailed' },
];

export default function WizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [sourceType, setSourceType] = useState<SourceType>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [targetAudience, setTargetAudience] = useState<Audience>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        setError('File size must be less than 500MB');
        return;
      }
      setUploadedFile(file);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!targetAudience) {
      setError('Please select a target audience');
      return;
    }

    if (!sourceType) {
      setError('Please select a video source');
      return;
    }

    if (sourceType === 'youtube' && !youtubeUrl) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (sourceType === 'upload' && !uploadedFile) {
      setError('Please upload a video file');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('targetAudience', targetAudience);
      formData.append('sourceType', sourceType);

      if (sourceType === 'youtube') {
        formData.append('youtubeUrl', youtubeUrl);
      } else if (uploadedFile) {
        formData.append('file', uploadedFile);
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process video');
      }

      // Redirect to results page
      router.push(`/results/${data.videoId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-slate-700">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <Video className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">CreoCut</h1>
        </Link>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 1 ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-slate-700'
            }`}>
              <span className="font-bold">1</span>
            </div>
            <div className={`h-1 w-24 ${step >= 2 ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-slate-700'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 2 ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-slate-700'
            }`}>
              <span className="font-bold">2</span>
            </div>
            <div className={`h-1 w-24 ${step >= 3 ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-slate-700'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 3 ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-slate-700'
            }`}>
              <span className="font-bold">3</span>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-slate-400">
            <span>Video Source</span>
            <span>Target Audience</span>
            <span>Review</span>
          </div>
        </div>

        {/* Step 1: Video Source */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Choose Your Video Source</h2>
              <p className="text-slate-400">Upload a video file or paste a YouTube URL</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* YouTube Option */}
              <button
                onClick={() => setSourceType('youtube')}
                className={`card card-hover p-8 text-left ${
                  sourceType === 'youtube' ? 'border-purple-500' : ''
                }`}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <Youtube className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">YouTube URL</h3>
                <p className="text-slate-400">Analyze any public YouTube video</p>
              </button>

              {/* Upload Option */}
              <button
                onClick={() => setSourceType('upload')}
                className={`card card-hover p-8 text-left ${
                  sourceType === 'upload' ? 'border-purple-500' : ''
                }`}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Upload Video</h3>
                <p className="text-slate-400">Upload your own video file (max 500MB)</p>
              </button>
            </div>

            {/* YouTube URL Input */}
            {sourceType === 'youtube' && (
              <div className="card p-6">
                <label className="block text-sm font-medium mb-2">YouTube URL</label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                />
              </div>
            )}

            {/* File Upload */}
            {sourceType === 'upload' && (
              <div className="card p-6">
                <label className="block text-sm font-medium mb-2">Select Video File</label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-purple-500 transition">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    {uploadedFile ? (
                      <p className="text-white font-medium">{uploadedFile.name}</p>
                    ) : (
                      <>
                        <p className="text-white font-medium mb-1">Click to upload</p>
                        <p className="text-sm text-slate-400">MP4, MOV, AVI (max 500MB)</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            )}

            {error && <p className="text-red-400 text-center">{error}</p>}

            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (sourceType === 'youtube' && youtubeUrl) {
                    setStep(2);
                    setError('');
                  } else if (sourceType === 'upload' && uploadedFile) {
                    setStep(2);
                    setError('');
                  } else {
                    setError('Please complete this step before continuing');
                  }
                }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Target Audience */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Select Target Audience</h2>
              <p className="text-slate-400">Who are you creating content for?</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {audienceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTargetAudience(option.value)}
                  className={`card card-hover p-6 text-left ${
                    targetAudience === option.value ? 'border-purple-500' : ''
                  }`}
                >
                  <h3 className="text-xl font-bold mb-1">{option.label}</h3>
                  <p className="text-sm text-slate-400">{option.description}</p>
                </button>
              ))}
            </div>

            {error && <p className="text-red-400 text-center">{error}</p>}

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (targetAudience) {
                    setStep(3);
                    setError('');
                  } else {
                    setError('Please select a target audience');
                  }
                }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Review & Analyze</h2>
              <p className="text-slate-400">Confirm your details before we start</p>
            </div>

            <div className="card p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-slate-400 mb-1">Video Source</h3>
                <p className="text-white">
                  {sourceType === 'youtube' ? `YouTube: ${youtubeUrl}` : `Uploaded: ${uploadedFile?.name}`}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-400 mb-1">Target Audience</h3>
                <p className="text-white">
                  {audienceOptions.find(a => a.value === targetAudience)?.label}
                </p>
              </div>
            </div>

            {error && <p className="text-red-400 text-center">{error}</p>}

            {isProcessing && (
              <div className="card p-8 text-center">
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-purple-500 animate-spin" />
                <p className="text-white font-semibold mb-2">Analyzing Your Video...</p>
                <p className="text-slate-400 text-sm">This may take a few minutes</p>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                disabled={isProcessing}
                className="px-8 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Analyze Video
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
