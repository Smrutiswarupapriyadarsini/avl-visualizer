"use client";

import React, { useRef, useState, useEffect } from "react";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Compass } from "lucide-react";

export default function TreeCanvas({
  layout,
  activeStep,
  onNodeClick,
  emptyPresetTrigger
}) {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset view to center
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 2.2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.4));

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    if (e.target.closest("button") || e.target.closest(".node-group")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.max(0.4, Math.min(2.2, prev * zoomFactor)));
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const activeNodeId = activeStep?.activeNodeId;
  const highlightedNodeIds = activeStep?.highlightedNodeIds || [];
  const rotationType = activeStep?.rotationType;

  const { nodes = [], edges = [] } = layout || {};

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-[580px] bg-slate-950/80 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl select-none backdrop-blur-md cursor-${
        isDragging ? "grabbing" : "grab"
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.12) 1px, transparent 0),
          radial-gradient(circle at center, rgba(30, 27, 75, 0.3) 0%, transparent 70%)
        `,
        backgroundSize: "28px 28px, 100% 100%",
      }}
    >
      {/* Canvas Toolbars / Floating Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg backdrop-blur-md">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />
        <button
          onClick={resetView}
          title="Reset Zoom & Pan"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono font-medium text-slate-400 px-2">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Floating Canvas Legend */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-4 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <span>Balanced (|BF| &le; 1)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50 animate-pulse" />
          <span>Imbalanced (|BF| &gt; 1)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
          <span>Inspecting / Path</span>
        </div>
        <div className="flex items-center gap-1.5 text-indigo-400 font-medium">
          <span>H = Height</span>
          <span className="text-slate-600">&bull;</span>
          <span>BF = Balance Factor</span>
        </div>
      </div>

      {/* Empty State Overlay */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-slate-200 mb-1">
            AVL Tree is Currently Empty
          </h3>
          <p className="text-sm text-slate-400 max-w-sm mb-6">
            Insert a node using the controls above or select a preset rotation scenario below to see self-balancing in action.
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            <button
              onClick={() => emptyPresetTrigger("LL")}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              Demo LL Rotation (30, 20, 10)
            </button>
            <button
              onClick={() => emptyPresetTrigger("RR")}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-600/30 text-purple-300 border border-purple-500/30 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
            >
              Demo RR Rotation (10, 20, 30)
            </button>
            <button
              onClick={() => emptyPresetTrigger("LR")}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-pink-600/30 text-pink-300 border border-pink-500/30 hover:bg-pink-600 hover:text-white transition-all shadow-sm"
            >
              Demo LR Rotation (30, 10, 20)
            </button>
            <button
              onClick={() => emptyPresetTrigger("RL")}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600 hover:text-white transition-all shadow-sm"
            >
              Demo RL Rotation (10, 30, 20)
            </button>
          </div>
        </div>
      )}

      {/* SVG Canvas for Tree Graphics */}
      <svg
        className="w-full h-full"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.15s ease-out",
        }}
      >
        <defs>
          {/* Edge Linear Gradients */}
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="activeEdgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.9" />
          </linearGradient>

          {/* Node Drop Shadows */}
          <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#6366f1" floodOpacity="0.3" />
          </filter>
          <filter id="activeGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#f59e0b" floodOpacity="0.9" />
          </filter>
          <filter id="imbalanceGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#ef4444" floodOpacity="1" />
          </filter>
        </defs>

        {/* 1. EDGES (Lines connecting parent to children) */}
        <g className="edges-layer">
          {edges.map((edge) => {
            const isHighlighted =
              highlightedNodeIds.includes(edge.fromId) &&
              highlightedNodeIds.includes(edge.toId);

            // Calculate smooth curved path from parent bottom to child top
            const startX = edge.from.x;
            const startY = edge.from.y + 26; // bottom of parent circle
            const endX = edge.to.x;
            const endY = edge.to.y - 26; // top of child circle

            const midY = (startY + endY) / 2;
            const pathData = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;

            // Midpoint coordinates for L / R indicator
            const labelX = (startX + endX) / 2 + (edge.side === "left" ? -10 : 10);
            const labelY = midY;

            return (
              <g key={edge.id} className="transition-all duration-300">
                {/* Background thicker stroke for clarity */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={isHighlighted ? "rgba(245, 158, 11, 0.4)" : "rgba(15, 23, 42, 0.6)"}
                  strokeWidth={isHighlighted ? 6 : 4}
                  strokeLinecap="round"
                />
                {/* Foreground colored edge */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={isHighlighted ? "url(#activeEdgeGradient)" : "url(#edgeGradient)"}
                  strokeWidth={isHighlighted ? 3 : 2}
                  strokeDasharray={isHighlighted ? "4 2" : "none"}
                  className={isHighlighted ? "animate-pulse" : ""}
                />
                {/* Side indicator badge (L or R) */}
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] font-mono font-bold fill-slate-400 select-none pointer-events-none"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                >
                  {edge.side === "left" ? "L" : "R"}
                </text>
              </g>
            );
          })}
        </g>

        {/* 2. NODES (Circles, values, height, and balance factor badges) */}
        <g className="nodes-layer">
          {nodes.map((node) => {
            const isActive = activeNodeId === node.id;
            const isHighlighted = highlightedNodeIds.includes(node.id);
            const isImbalanced = Math.abs(node.balanceFactor) > 1;

            // Determine node coloring
            let fillGradientStart = "#1e1b4b";
            let fillGradientEnd = "#0f172a";
            let strokeColor = "#6366f1";
            let filterType = "url(#nodeGlow)";
            let textFill = "#ffffff";

            if (isImbalanced) {
              fillGradientStart = "#450a0a";
              fillGradientEnd = "#1c1917";
              strokeColor = "#ef4444";
              filterType = "url(#imbalanceGlow)";
            } else if (isActive) {
              fillGradientStart = "#451a03";
              fillGradientEnd = "#1e1b4b";
              strokeColor = "#f59e0b";
              filterType = "url(#activeGlow)";
            } else if (isHighlighted) {
              fillGradientStart = "#1e293b";
              fillGradientEnd = "#0f172a";
              strokeColor = "#38bdf8";
            }

            const bfColor =
              Math.abs(node.balanceFactor) > 1
                ? "#ef4444"
                : node.balanceFactor === 0
                ? "#10b981"
                : "#06b6d4";

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => onNodeClick && onNodeClick(node)}
                className={`node-group cursor-pointer transition-transform duration-300 ease-out hover:scale-110 ${
                  isImbalanced ? "glow-imbalance" : isActive ? "glow-active" : ""
                }`}
              >
                {/* Extra alert outer pulsating ring for imbalanced nodes */}
                {isImbalanced && (
                  <circle
                    r={node.radius + 8}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    className="animate-spin"
                    style={{ animationDuration: "6s", transformOrigin: "0 0" }}
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  r={node.radius}
                  fill={fillGradientEnd}
                  stroke={strokeColor}
                  strokeWidth={isActive || isImbalanced ? 3 : 2}
                  filter={filterType}
                  className="transition-all duration-300"
                />

                {/* Inner Gradient Shading */}
                <circle
                  r={node.radius - 3}
                  fill={fillGradientStart}
                  opacity="0.8"
                />

                {/* Node Value */}
                <text
                  x="0"
                  y="1"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={textFill}
                  className="text-sm font-bold font-mono tracking-tight select-none"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.9)" }}
                >
                  {node.value}
                </text>

                {/* Balance Factor (BF) Pill Badge - Top */}
                <g transform="translate(0, -35)">
                  <rect
                    x="-24"
                    y="-9"
                    width="48"
                    height="18"
                    rx="9"
                    fill="#0f172a"
                    stroke={bfColor}
                    strokeWidth="1.5"
                    className="shadow-md"
                  />
                  <text
                    x="0"
                    y="1"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={bfColor}
                    className="text-[10px] font-mono font-bold select-none"
                  >
                    BF:{node.balanceFactor >= 0 ? `+${node.balanceFactor}` : node.balanceFactor}
                  </text>
                </g>

                {/* Height (H) Pill Badge - Bottom */}
                <g transform="translate(0, 35)">
                  <rect
                    x="-18"
                    y="-8"
                    width="36"
                    height="16"
                    rx="8"
                    fill="#0f172a"
                    stroke="#475569"
                    strokeWidth="1"
                    className="shadow-sm"
                  />
                  <text
                    x="0"
                    y="1"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#94a3b8"
                    className="text-[9px] font-mono font-medium select-none"
                  >
                    H:{node.height}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
