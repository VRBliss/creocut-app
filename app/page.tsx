import { ArrowRight, Video, Target, Music } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-slate-700">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <Video className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">CreoCut</h1>
        </Link>
        <Link
          href="/wizard"
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
        >
          Get Started
        </Link>
      </header>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Smarter edits,
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            {" "}
            higher retention.
          </span>
        </h2>
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
          CreoCut reviews your videos like a senior editor, giving data-driven
          insights to boost retention.
        </p>
        <Link
          href="/wizard"
          className="inline-flex px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:shadow-2xl hover:scale-105 transition items-center gap-2"
        >
          Analyze Your Video
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700 hover:border-purple-500/50 transition">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4">
            <Video className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">
            AI-Powered Roast
          </h3>
          <p className="text-slate-400">
            Get no-BS feedback on what's working and what's killing your
            retention
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700 hover:border-purple-500/50 transition">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">
            Risk Zone Detection
          </h3>
          <p className="text-slate-400">
            Pinpoint exact moments where viewers might drop off
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700 hover:border-purple-500/50 transition">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">
            Audio & Vibe Sync
          </h3>
          <p className="text-slate-400">
            Ensure your music choice and narrative pacing match your target
            audience.
          </p>
        </div>
      </div>
    </div>
  );
}
