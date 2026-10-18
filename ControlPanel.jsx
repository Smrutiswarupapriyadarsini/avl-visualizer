"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Search,
  Sparkles,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Zap,
  Sliders,
  Flame
} from "lucide-react";

export default function ControlPanel({
  onInsert,
  onDelete,
  onSearch,
  onClear,
  onLoadPreset,
  // Playback props
  totalSteps,
  currentStepIndex,
  isPlaying,
  playbackSpeed,
  setPlaybackSpeed,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onJumpToStart,
  onJumpToEnd,
  onScrubStep,
  activeStep
}) {
  const [inputValue, setInputValue] = useState("");
  const [deleteValue, setDeleteValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const handleInsert = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const num = parseInt(inputValue.trim(), 10);
    if (!isNaN(num)) {
      onInsert(num);
      setInputValue("");
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (!deleteValue.trim()) return;
    const num = parseInt(deleteValue.trim(), 10);
    if (!isNaN(num)) {
      onDelete(num);
      setDeleteValue("");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    const num = parseInt(searchValue.trim(), 10);
    if (!isNaN(num)) {
      onSearch(num);
      setSearchValue("");
    }
  };

  const handleRandomInsert = () => {
    const randomNum = Math.floor(Math.random() * 90) + 10;
    onInsert(randomNum);
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Insert Card */}
        <form
          onSubmit={handleInsert}
          className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg backdrop-blur-sm focus-within:border-indigo-500/80 transition-colors"
        >
          <div className="flex-1 flex items-center gap-2 px-2">
            <Plus className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="number"
              placeholder="Value to Insert..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all active:scale-95 shrink-0"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={handleRandomInsert}
            title="Insert random value (10-99)"
            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </form>

        {/* Delete Card */}
        <form
          onSubmit={handleDelete}
          className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg backdrop-blur-sm focus-within:border-rose-500/80 transition-colors"
        >
          <div className="flex-1 flex items-center gap-2 px-2">
            <Trash2 className="w-4 h-4 text-rose-400 shrink-0" />
            <input
              type="number"
              placeholder="Value to Delete..."
              value={deleteValue}
              onChange={(e) => setDeleteValue(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-all active:scale-95 shrink-0"
          >
            Delete
          </button>
        </form>

        {/* Search Card */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg backdrop-blur-sm focus-within:border-amber-500/80 transition-colors"
        >
          <div className="flex-1 flex items-center gap-2 px-2">
            <Search className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="number"
              placeholder="Find key in tree..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-sm transition-all active:scale-95 shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Preset Rotation Scenarios & Quick Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <Zap className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Rotation Presets:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onLoadPreset("LL")}
            className="px-2.5 py-1 font-medium rounded-lg bg-slate-800/90 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            title="Insert 30, 20, 10 to trigger Left-Left Right Rotation"
          >
            LL (Right)
          </button>
          <button
            onClick={() => onLoadPreset("RR")}
            className="px-2.5 py-1 font-medium rounded-lg bg-slate-800/90 text-purple-300 border border-purple-500/30 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
            title="Insert 10, 20, 30 to trigger Right-Right Left Rotation"
          >
            RR (Left)
          </button>
          <button
            onClick={() => onLoadPreset("LR")}
            className="px-2.5 py-1 font-medium rounded-lg bg-slate-800/90 text-pink-300 border border-pink-500/30 hover:bg-pink-600 hover:text-white transition-all shadow-sm"
            title="Insert 30, 10, 20 to trigger Left-Right Double Rotation"
          >
            LR (Double)
          </button>
          <button
            onClick={() => onLoadPreset("RL")}
            className="px-2.5 py-1 font-medium rounded-lg bg-slate-800/90 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600 hover:text-white transition-all shadow-sm"
            title="Insert 10, 30, 20 to trigger Right-Left Double Rotation"
          >
            RL (Double)
          </button>
          <button
            onClick={() => onLoadPreset("BALANCED_7")}
            className="px-2.5 py-1 font-medium rounded-lg bg-slate-800/90 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
            title="Generate a balanced 7-node complete AVL tree"
          >
            Balanced 7
          </button>
          <button
            onClick={() => onLoadPreset("RANDOM_5")}
            className="px-2.5 py-1 font-medium rounded-lg bg-slate-800/90 text-amber-300 border border-amber-500/30 hover:bg-amber-600 hover:text-white transition-all shadow-sm"
            title="Generate 5 random distinct numbers"
          >
            Random 5
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-500/30 hover:bg-rose-600 hover:text-white transition-all"
            title="Clear all nodes from the tree"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Animation & Step Playback Toolbar */}
      {totalSteps > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-indigo-500/30 shadow-xl backdrop-blur-md space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Step Counter & Operation Pill */}
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold">
                Step {currentStepIndex + 1} of {totalSteps}
              </span>

              {activeStep?.rotationType && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold animate-pulse">
                  <Flame className="w-3 h-3 text-amber-400" />
                  {activeStep.rotationType} Rotation
                </span>
              )}

              {activeStep?.operation && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-medium">
                  {activeStep.operation}
                </span>
              )}
            </div>

            {/* Playback Transport Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onJumpToStart}
                disabled={currentStepIndex === 0}
                title="First Step"
                className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-800 rounded-lg transition-colors"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={onStepBackward}
                disabled={currentStepIndex === 0}
                title="Previous Step"
                className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={onPlayPause}
                title={isPlaying ? "Pause" : "Play step-by-step animation"}
                className={`p-2 rounded-xl text-white shadow-md transition-all active:scale-95 ${
                  isPlaying
                    ? "bg-amber-600 hover:bg-amber-500 shadow-amber-600/30"
                    : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button
                onClick={onStepForward}
                disabled={currentStepIndex >= totalSteps - 1}
                title="Next Step"
                className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={onJumpToEnd}
                disabled={currentStepIndex >= totalSteps - 1}
                title="Jump to Final Balanced Tree"
                className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-800 rounded-lg transition-colors"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 hidden sm:inline mr-1">Speed:</span>
              {[
                { label: "0.5x", val: 1400 },
                { label: "1x", val: 800 },
                { label: "1.5x", val: 500 },
                { label: "2x", val: 300 },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setPlaybackSpeed(item.val)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    playbackSpeed === item.val
                      ? "bg-indigo-600 text-white font-bold"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Scrub Slider */}
          <div className="flex items-center gap-3 pt-1">
            <input
              type="range"
              min="0"
              max={Math.max(0, totalSteps - 1)}
              value={currentStepIndex}
              onChange={(e) => onScrubStep(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
