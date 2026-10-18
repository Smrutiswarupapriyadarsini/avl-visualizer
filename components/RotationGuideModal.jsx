"use client";

import React from "react";
import { X, BookOpen, RotateCw, RotateCcw, Flame, CheckCircle, Zap } from "lucide-react";

export default function RotationGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-6 border-b border-slate-800 pb-4">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              AVL Tree &amp; Rotation Cheat Sheet
            </h2>
            <p className="text-xs text-slate-400">
              Understanding self-balancing binary search trees and rotation algorithms
            </p>
          </div>
        </div>

        {/* Fundamental Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Balance Factor (BF)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              For any node <span className="font-mono text-indigo-300">N</span>:
            </p>
            <div className="my-2 p-2 rounded-lg bg-slate-900 font-mono text-xs text-emerald-300 text-center border border-slate-800">
              BF(N) = Height(N.left) &minus; Height(N.right)
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              In an AVL tree, every node must satisfy:
              <br />
              <span className="font-mono text-emerald-400 font-bold">BF &isin; &#123;-1, 0, +1&#125;</span>.
              If <span className="font-mono text-rose-400 font-bold">|BF| &gt; 1</span>, the tree performs a rotation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Complexity Guarantees
            </h3>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Search:</span>
                <span className="font-mono text-emerald-400 font-semibold">O(log n)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Insertion:</span>
                <span className="font-mono text-emerald-400 font-semibold">O(log n)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Deletion:</span>
                <span className="font-mono text-emerald-400 font-semibold">O(log n)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Space:</span>
                <span className="font-mono text-indigo-300 font-semibold">O(n)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Rotations Deep Dive */}
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <span>The 4 Rotation Types</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LL Rotation */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-indigo-300">
                Left-Left (LL) &rarr; Right Rotation
              </h4>
            </div>
            <p className="text-[11px] text-slate-400">
              Triggered when <span className="font-mono text-indigo-300">BF(Node) &gt; 1</span> and the left child is left-heavy (<span className="font-mono text-indigo-300">BF(Left) &ge; 0</span>).
            </p>
            <pre className="p-2.5 rounded-lg bg-slate-900 text-[10px] font-mono text-indigo-200 border border-slate-800 leading-tight">
{`    z (BF=+2)               y
   /                       / \\
  y (BF=+1)    --->       x   z
 /
x`}
            </pre>
          </div>

          {/* RR Rotation */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-bold text-purple-300">
                Right-Right (RR) &rarr; Left Rotation
              </h4>
            </div>
            <p className="text-[11px] text-slate-400">
              Triggered when <span className="font-mono text-purple-300">BF(Node) &lt; -1</span> and the right child is right-heavy (<span className="font-mono text-purple-300">BF(Right) &le; 0</span>).
            </p>
            <pre className="p-2.5 rounded-lg bg-slate-900 text-[10px] font-mono text-purple-200 border border-slate-800 leading-tight">
{`  z (BF=-2)                 y
   \\                       / \\
    y (BF=-1)  --->       z   x
     \\
      x`}
            </pre>
          </div>

          {/* LR Rotation */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-pink-400" />
              <h4 className="text-xs font-bold text-pink-300">
                Left-Right (LR) &rarr; Double Rotation
              </h4>
            </div>
            <p className="text-[11px] text-slate-400">
              Triggered when <span className="font-mono text-pink-300">BF(Node) &gt; 1</span> and <span className="font-mono text-pink-300">BF(Left) &lt; 0</span>.
              <br />
              1. Left Rotate on left child &rarr; 2. Right Rotate on root.
            </p>
            <pre className="p-2.5 rounded-lg bg-slate-900 text-[10px] font-mono text-pink-200 border border-slate-800 leading-tight">
{`   z            z            x
  /            /            / \\
 y    --->    x    --->    y   z
  \\          /
   x        y`}
            </pre>
          </div>

          {/* RL Rotation */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-cyan-300">
                Right-Left (RL) &rarr; Double Rotation
              </h4>
            </div>
            <p className="text-[11px] text-slate-400">
              Triggered when <span className="font-mono text-cyan-300">BF(Node) &lt; -1</span> and <span className="font-mono text-cyan-300">BF(Right) &gt; 0</span>.
              <br />
              1. Right Rotate on right child &rarr; 2. Left Rotate on root.
            </p>
            <pre className="p-2.5 rounded-lg bg-slate-900 text-[10px] font-mono text-cyan-200 border border-slate-800 leading-tight">
{`  z             z            x
   \\             \\          / \\
    y   --->      x  --->  z   y
   /               \\
  x                 y`}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}
