"use client";

import React, { useState } from "react";
import {
  Activity,
  Layers,
  Scale,
  Hash,
  Copy,
  Check,
  Code2
} from "lucide-react";

export default function TreeStats({
  nodeCount = 0,
  treeHeight = 0,
  isBalanced = true,
  rotationsSummary = { LL: 0, RR: 0, LR: 0, RL: 0 },
  traversals = {
    inOrder: [],
    preOrder: [],
    postOrder: [],
    levelOrder: []
  }
}) {
  const [copiedType, setCopiedType] = useState(null);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1800);
  };

  // Theoretical max height for AVL with n nodes: ~ 1.4404 * log2(n + 2) - 0.3277
  const theoreticalMaxHeight =
    nodeCount > 0 ? Math.ceil(1.4404 * Math.log2(nodeCount + 2) - 0.3277) : 0;

  return (
    <div className="w-full space-y-4">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Node Count */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md backdrop-blur-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Hash className="w-4 h-4 text-indigo-400" />
            <span>Total Nodes</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            {nodeCount}
          </div>
          <span className="text-[10px] text-slate-500">
            Space: O(n)
          </span>
        </div>

        {/* Tree Height */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md backdrop-blur-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Tree Height</span>
          </div>
          <div className="text-xl font-bold font-mono text-sky-300">
            {treeHeight}
          </div>
          <span className="text-[10px] text-slate-500">
            Max bound: &le; {theoreticalMaxHeight}
          </span>
        </div>

        {/* Balance Status */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md backdrop-blur-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Balance Status</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold font-mono mt-1">
            {isBalanced ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Balanced
              </span>
            ) : (
              <span className="text-rose-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                Imbalanced
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500">
            |BF| &le; 1 for all nodes
          </span>
        </div>

        {/* Rotations Counter */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md backdrop-blur-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Activity className="w-4 h-4 text-purple-400" />
            <span>Total Rotations</span>
          </div>
          <div className="text-xl font-bold font-mono text-purple-300">
            {rotationsSummary.LL +
              rotationsSummary.RR +
              rotationsSummary.LR +
              rotationsSummary.RL}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            LL:{rotationsSummary.LL} RR:{rotationsSummary.RR} LR:{rotationsSummary.LR} RL:{rotationsSummary.RL}
          </div>
        </div>
      </div>

      {/* Tree Traversals Display */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Tree Traversals
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* In-Order (Sorted) */}
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-emerald-400 text-[11px]">
                In-Order (Left &rarr; Root &rarr; Right &bull; Sorted)
              </span>
              <button
                onClick={() =>
                  copyToClipboard(traversals.inOrder.join(", "), "inOrder")
                }
                className="text-slate-500 hover:text-slate-300 transition-colors"
                title="Copy In-Order"
              >
                {copiedType === "inOrder" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div className="font-mono text-slate-300 text-[11px] truncate select-all">
              {traversals.inOrder.length > 0
                ? traversals.inOrder.join(", ")
                : "Empty"}
            </div>
          </div>

          {/* Pre-Order */}
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-sky-400 text-[11px]">
                Pre-Order (Root &rarr; Left &rarr; Right)
              </span>
              <button
                onClick={() =>
                  copyToClipboard(traversals.preOrder.join(", "), "preOrder")
                }
                className="text-slate-500 hover:text-slate-300 transition-colors"
                title="Copy Pre-Order"
              >
                {copiedType === "preOrder" ? (
                  <Check className="w-3.5 h-3.5 text-sky-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div className="font-mono text-slate-300 text-[11px] truncate select-all">
              {traversals.preOrder.length > 0
                ? traversals.preOrder.join(", ")
                : "Empty"}
            </div>
          </div>

          {/* Post-Order */}
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-purple-400 text-[11px]">
                Post-Order (Left &rarr; Right &rarr; Root)
              </span>
              <button
                onClick={() =>
                  copyToClipboard(traversals.postOrder.join(", "), "postOrder")
                }
                className="text-slate-500 hover:text-slate-300 transition-colors"
                title="Copy Post-Order"
              >
                {copiedType === "postOrder" ? (
                  <Check className="w-3.5 h-3.5 text-purple-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div className="font-mono text-slate-300 text-[11px] truncate select-all">
              {traversals.postOrder.length > 0
                ? traversals.postOrder.join(", ")
                : "Empty"}
            </div>
          </div>

          {/* Level-Order */}
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-amber-400 text-[11px]">
                Level-Order (Breadth-First BFS)
              </span>
              <button
                onClick={() =>
                  copyToClipboard(traversals.levelOrder.join(", "), "levelOrder")
                }
                className="text-slate-500 hover:text-slate-300 transition-colors"
                title="Copy Level-Order"
              >
                {copiedType === "levelOrder" ? (
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div className="font-mono text-slate-300 text-[11px] truncate select-all">
              {traversals.levelOrder.length > 0
                ? traversals.levelOrder.join(", ")
                : "Empty"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
