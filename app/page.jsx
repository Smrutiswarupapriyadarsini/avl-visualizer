"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import confetti from "canvas-confetti";
import { AVLTree } from "../AVLTree";
import TreeCanvas from "../components/TreeCanvas";
import ControlPanel from "../components/ControlPanel";
import StepLogger from "../components/StepLogger";
import TreeStats from "../components/TreeStats";
import RotationGuideModal from "../components/RotationGuideModal";
import {
  Binary,
  BookOpen,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Cpu
} from "lucide-react";

export default function Home() {
  // Initialize AVL Tree instance
  const [tree] = useState(() => new AVLTree());
  const [, setRenderTrigger] = useState(0);

  // Playback & Animation states
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(800); // ms per step

  // Modals & cumulative stats
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [rotationsSummary, setRotationsSummary] = useState({
    LL: 0,
    RR: 0,
    LR: 0,
    RL: 0,
  });

  const forceUpdate = useCallback(() => setRenderTrigger((prev) => prev + 1), []);

  // Trigger celebratory confetti on satisfying AVL rebalance
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#6366f1", "#10b981", "#38bdf8", "#f59e0b"],
      });
    } catch {
      // Ignore if confetti not supported in environment
    }
  };

  // Execute operation and prepare step-by-step playback
  const runOperation = (operationFn) => {
    setIsPlaying(false);
    const result = operationFn();
    const recordedSteps = result.steps || [];

    if (result.rotations) {
      setRotationsSummary((prev) => ({
        LL: prev.LL + (result.rotations.LL || 0),
        RR: prev.RR + (result.rotations.RR || 0),
        LR: prev.LR + (result.rotations.LR || 0),
        RL: prev.RL + (result.rotations.RL || 0),
      }));

      const totalRotationsInOp =
        (result.rotations.LL || 0) +
        (result.rotations.RR || 0) +
        (result.rotations.LR || 0) +
        (result.rotations.RL || 0);

      if (totalRotationsInOp > 0) {
        setTimeout(triggerConfetti, 400);
      }
    }

    setSteps(recordedSteps);
    if (recordedSteps.length > 0) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setCurrentStepIndex(0);
    }
    forceUpdate();
  };

  // Node Insert
  const handleInsert = (value) => {
    runOperation(() => tree.insert(value));
  };

  // Node Delete
  const handleDelete = (value) => {
    runOperation(() => tree.delete(value));
  };

  // Node Search
  const handleSearch = (value) => {
    runOperation(() => tree.search(value));
  };

  // Clear Tree
  const handleClear = () => {
    setIsPlaying(false);
    tree.clear();
    setSteps([]);
    setCurrentStepIndex(0);
    setRotationsSummary({ LL: 0, RR: 0, LR: 0, RL: 0 });
    forceUpdate();
  };

  // Load Presets
  const handleLoadPreset = (presetType) => {
    setIsPlaying(false);
    tree.clear();

    let valuesToInsert = [];
    if (presetType === "LL") {
      valuesToInsert = [30, 20, 10]; // Will trigger LL Right Rotation on inserting 10
    } else if (presetType === "RR") {
      valuesToInsert = [10, 20, 30]; // Will trigger RR Left Rotation on inserting 30
    } else if (presetType === "LR") {
      valuesToInsert = [30, 10, 20]; // Will trigger LR Double Rotation on inserting 20
    } else if (presetType === "RL") {
      valuesToInsert = [10, 30, 20]; // Will trigger RL Double Rotation on inserting 20
    } else if (presetType === "BALANCED_7") {
      valuesToInsert = [40, 20, 60, 10, 30, 50, 70];
    } else if (presetType === "RANDOM_5") {
      const set = new Set();
      while (set.size < 5) {
        set.add(Math.floor(Math.random() * 85) + 10);
      }
      valuesToInsert = Array.from(set);
    }

    // Insert all values, tracking cumulative steps
    let combinedSteps = [];
    let localRotations = { LL: 0, RR: 0, LR: 0, RL: 0 };

    valuesToInsert.forEach((val) => {
      const res = tree.insert(val);
      if (res.rotations) {
        localRotations.LL += res.rotations.LL || 0;
        localRotations.RR += res.rotations.RR || 0;
        localRotations.LR += res.rotations.LR || 0;
        localRotations.RL += res.rotations.RL || 0;
      }
      if (res.steps) {
        combinedSteps = combinedSteps.concat(res.steps);
      }
    });

    setRotationsSummary((prev) => ({
      LL: prev.LL + localRotations.LL,
      RR: prev.RR + localRotations.RR,
      LR: prev.LR + localRotations.LR,
      RL: prev.RL + localRotations.RL,
    }));

    setSteps(combinedSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    forceUpdate();
  };

  // Playback Auto-Stepper
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, playbackSpeed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, playbackSpeed]);

  // Current active step object
  const activeStep = steps[currentStepIndex] || null;

  // Active root node to display:
  // If scrubbing through steps, display snapshot from that specific step!
  // If at the end or no steps recorded, display current tree root.
  const displayRoot = useMemo(() => {
    if (activeStep && activeStep.treeSnapshot !== undefined) {
      return activeStep.treeSnapshot;
    }
    return tree.root;
  }, [activeStep, tree.root]);

  // Calculate layout coordinates for active tree state
  const layout = useMemo(() => {
    const tempTree = new AVLTree();
    tempTree.root = displayRoot;
    return tempTree.calculateLayout(960, 560);
  }, [displayRoot]);

  // Stats computed from current tree
  const treeStats = useMemo(() => {
    const tempTree = new AVLTree();
    tempTree.root = tree.root;
    return {
      nodeCount: tempTree.getNodeCount(),
      height: tempTree.getHeight(tempTree.root),
      isBalanced: tempTree.isBalanced(),
      traversals: {
        inOrder: tempTree.inOrder(),
        preOrder: tempTree.preOrder(),
        postOrder: tempTree.postOrder(),
        levelOrder: tempTree.levelOrder(),
      },
    };
  }, [tree.root, currentStepIndex]);

  // Playback controls handlers
  const handlePlayPause = () => {
    if (currentStepIndex >= steps.length - 1 && steps.length > 0) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleJumpToStart = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleJumpToEnd = () => {
    setIsPlaying(false);
    if (steps.length > 0) {
      setCurrentStepIndex(steps.length - 1);
    }
  };

  const handleScrubStep = (index) => {
    setIsPlaying(false);
    setCurrentStepIndex(Math.max(0, Math.min(steps.length - 1, index)));
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Binary className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  AVL Tree Visualizer
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  DSA Interactive
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Self-Balancing BST &bull; Rotations (LL, RR, LR, RL) &bull; Height &amp; Balance Factors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600 hover:text-white transition-all text-xs font-semibold shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>Rotation Guide</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Interactive Controls Bar */}
        <ControlPanel
          onInsert={handleInsert}
          onDelete={handleDelete}
          onSearch={handleSearch}
          onClear={handleClear}
          onLoadPreset={handleLoadPreset}
          totalSteps={steps.length}
          currentStepIndex={currentStepIndex}
          isPlaying={isPlaying}
          playbackSpeed={playbackSpeed}
          setPlaybackSpeed={setPlaybackSpeed}
          onPlayPause={handlePlayPause}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          onJumpToStart={handleJumpToStart}
          onJumpToEnd={handleJumpToEnd}
          onScrubStep={handleScrubStep}
          activeStep={activeStep}
        />

        {/* Core Visualization & Step Logger Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left 2 Cols: Tree Graphic Canvas */}
          <div className="lg:col-span-2 space-y-4">
            <TreeCanvas
              layout={layout}
              activeStep={activeStep}
              onNodeClick={(node) => {
                // Clicking a node auto-fills the delete field
                handleDelete(node.value);
              }}
              emptyPresetTrigger={handleLoadPreset}
            />

            {/* Tree Statistics & Traversals */}
            <TreeStats
              nodeCount={treeStats.nodeCount}
              treeHeight={treeStats.height}
              isBalanced={treeStats.isBalanced}
              rotationsSummary={rotationsSummary}
              traversals={treeStats.traversals}
            />
          </div>

          {/* Right Col: Real-time Step-by-Step Logger */}
          <div className="lg:col-span-1">
            <StepLogger
              steps={steps}
              currentStepIndex={currentStepIndex}
              onSelectStep={handleScrubStep}
              activeStep={activeStep}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-4 text-center text-xs text-slate-500">
        <p>
          AVL Tree Visualizer &bull; Built with React, Next.js, and Tailwind CSS &bull; Self-Balancing Binary Search Tree
        </p>
      </footer>

      {/* Educational Rotation Cheat Sheet Modal */}
      <RotationGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </main>
  );
}
