"use client";

import React from "react";
import {
  Binary,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  ShieldCheck,
  RotateCw,
  GitBranch,
  Layers,
  BookOpen,
  CheckCircle2
} from "lucide-react";

export default function LandingPage({ onOpen, onOpenGuide }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Binary className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-white block">
                AVL Visualizer
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-mono">
                DSA Interactive Studio
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenGuide}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all text-xs font-medium"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Rotation Guide</span>
            </button>
            <button
              onClick={onOpen}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-95 group"
            >
              <span>Open</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-6 backdrop-blur-sm animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Self-Balancing Binary Search Tree Simulator</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight sm:leading-tight mb-6">
          Visualize &amp; Master{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
            AVL Tree Rotations
          </span>{" "}
          in Real Time
        </h1>

        {/* Subhead */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mb-10 leading-relaxed font-sans">
          Explore self-balancing binary search trees with step-by-step animation playback, 
          balance factor tracking, and mathematical rotation analysis for LL, RR, LR, and RL cases.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
          <button
            onClick={onOpen}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 group"
          >
            <span>Open AVL Visualizer</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={onOpenGuide}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-semibold text-sm transition-all"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Read Algorithm Theory</span>
          </button>
        </div>

        {/* Interactive Floating Node Preview Card */}
        <div className="w-full max-w-3xl p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-2xl backdrop-blur-xl relative">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-6 text-left">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-semibold text-slate-300">
                AVL Height Invariant: |BF| &le; 1
              </span>
            </div>
            <span className="text-xs font-mono text-indigo-400 font-medium">
              Time Complexity: O(log n)
            </span>
          </div>

          {/* Node Diagram Preview */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative flex flex-col items-center">
              {/* Root Node */}
              <div className="relative group cursor-pointer transition-transform hover:scale-110">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-slate-900 border-2 border-indigo-400 flex items-center justify-center text-white font-mono font-bold text-base shadow-lg shadow-indigo-600/40">
                  20
                </div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-950 border border-emerald-400 text-emerald-400 text-[10px] font-mono font-bold">
                  BF: 0
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-md bg-slate-950 border border-slate-700 text-slate-400 text-[9px] font-mono">
                  H: 2
                </div>
              </div>

              {/* Connecting Edges */}
              <div className="flex items-center justify-center gap-24 sm:gap-36 my-4 w-full">
                <div className="w-16 sm:w-24 h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-400 -rotate-25 transform origin-right" />
                <div className="w-16 sm:w-24 h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-400 rotate-25 transform origin-left" />
              </div>

              {/* Children Nodes */}
              <div className="flex items-center justify-between gap-16 sm:gap-28">
                {/* Left Child */}
                <div className="relative group cursor-pointer transition-transform hover:scale-110">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 border-2 border-cyan-400 flex items-center justify-center text-white font-mono font-bold text-sm shadow-md">
                    10
                  </div>
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-slate-950 border border-emerald-400 text-emerald-400 text-[9px] font-mono font-bold">
                    BF: 0
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded bg-slate-950 border border-slate-700 text-slate-400 text-[8px] font-mono">
                    H: 1
                  </div>
                </div>

                {/* Right Child */}
                <div className="relative group cursor-pointer transition-transform hover:scale-110">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 border-2 border-cyan-400 flex items-center justify-center text-white font-mono font-bold text-sm shadow-md">
                    30
                  </div>
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-slate-950 border border-emerald-400 text-emerald-400 text-[9px] font-mono font-bold">
                    BF: 0
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded bg-slate-950 border border-slate-700 text-slate-400 text-[8px] font-mono">
                    H: 1
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Strictly Height-Balanced
            </span>
            <span className="flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
              Auto-Rotations (LL, RR, LR, RL)
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              Micro-Step Trace Logs
            </span>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Engineered for Deep Algorithmic Understanding
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Everything you need to master self-balancing binary search trees in one interactive environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <RotateCw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              4 Rotation Scenarios
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Step through single rotations (LL, RR) and double rotations (LR, RL) with instant one-click demonstration presets.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Time-Travel Playback
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rewind, pause, step forward, and scrub through recorded tree states to inspect intermediate recursive unwinding.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Real-Time Metrics &amp; Traversals
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live tree height, theoretical maximum height bounds, and In-Order, Pre-Order, Post-Order, and Level-Order arrays.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-indigo-950/60 to-slate-950 border border-indigo-500/30 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Ready to Begin?
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto mb-8">
            Click &apos;Open&apos; to sign in and launch your interactive AVL Tree session.
          </p>
          <button
            onClick={onOpen}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 group"
          >
            <span>Open AVL Visualizer</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>
          AVL Tree Visualizer &bull; Built with React, Next.js, and Tailwind CSS &bull; DSA Project
        </p>
      </footer>
    </div>
  );
}
