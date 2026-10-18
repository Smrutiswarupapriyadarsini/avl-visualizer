"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import confetti from "canvas-confetti";
import { AVLTree } from "../AVLTree";
import TreeCanvas from "../components/TreeCanvas";
import ControlPanel from "../components/ControlPanel";
import StepLogger from "../components/StepLogger";
import TreeStats from "../components/TreeStats";
import RotationGuideModal from "../components/RotationGuideModal";
import LandingPage from "../components/LandingPage";
import LoginPage from "../components/LoginPage";
import {
  Binary,
  BookOpen,
  LogOut,
  UserCheck,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

export default function Home() {
  // Navigation View State: 'home' | 'login' | 'visualizer'
  const [currentView, setCurrentView] = useState("home");
  const [userSession, setUserSession] = useState(null);
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);

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

  // Check persistent session on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem("avl_auth_session");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.token) {
          setUserSession(parsed);
          // Auto-direct to visualizer if session exists and hash is #visualizer
          if (window.location.hash === "#visualizer") {
            setCurrentView("visualizer");
          }
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Handle Login Success
  const handleLoginSuccess = (sessionData) => {
    setUserSession(sessionData);
    try {
      localStorage.setItem("avl_auth_session", JSON.stringify(sessionData));
    } catch {}
    setCurrentView("visualizer");
    setShowWelcomeToast(true);
    setTimeout(() => setShowWelcomeToast(false), 4500);
    setTimeout(triggerConfetti, 500);
  };

  // Handle Safe Exit / Logout
  const handleExit = () => {
    try {
      localStorage.removeItem("avl_auth_session");
    } catch {}
    setUserSession(null);
    setIsPlaying(false);
    setCurrentView("home");
    window.location.hash = "";
  };

  // Handle 'Open' button from Home Landing Page
  const handleOpenFromHome = () => {
    if (userSession?.token) {
      setCurrentView("visualizer");
    } else {
      setCurrentView("login");
    }
  };

  // Trigger celebratory confetti on satisfying AVL rebalance
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 65,
        origin: { y: 0.8 },
        colors: ["#6366f1", "#10b981", "#38bdf8", "#f59e0b"],
      });
    } catch {
      // Ignore if confetti not supported
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
      valuesToInsert = [30, 20, 10]; // Triggers LL Right Rotation
    } else if (presetType === "RR") {
      valuesToInsert = [10, 20, 30]; // Triggers RR Left Rotation
    } else if (presetType === "LR") {
      valuesToInsert = [30, 10, 20]; // Triggers LR Double Rotation
    } else if (presetType === "RL") {
      valuesToInsert = [10, 30, 20]; // Triggers RL Double Rotation
    } else if (presetType === "BALANCED_7") {
      valuesToInsert = [40, 20, 60, 10, 30, 50, 70];
    } else if (presetType === "RANDOM_5") {
      const set = new Set();
      while (set.size < 5) {
        set.add(Math.floor(Math.random() * 85) + 10);
      }
      valuesToInsert = Array.from(set);
    }

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

  const activeStep = steps[currentStepIndex] || null;

  // Active snapshot for time-travel
  const displayRoot = useMemo(() => {
    if (activeStep && activeStep.treeSnapshot !== undefined) {
      return activeStep.treeSnapshot;
    }
    return tree.root;
  }, [activeStep, tree.root]);

  // Layout calculation
  const layout = useMemo(() => {
    const tempTree = new AVLTree();
    tempTree.root = displayRoot;
    return tempTree.calculateLayout(960, 560);
  }, [displayRoot]);

  // Tree statistics
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

  // Playback handlers
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

  // 1. RENDER STAGE: Landing Page
  if (currentView === "home") {
    return (
      <>
        <LandingPage
          onOpen={handleOpenFromHome}
          onOpenGuide={() => setIsGuideOpen(true)}
        />
        <RotationGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
        />
      </>
    );
  }

  // 2. RENDER STAGE: Login Page
  if (currentView === "login") {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onBackToHome={() => setCurrentView("home")}
      />
    );
  }

  // 3. RENDER STAGE: Main AVL Visualizer Dashboard
  return (
    <main className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Title */}
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
                Self-Balancing BST &bull; Rotations (LL, RR, LR, RL)
              </p>
            </div>
          </div>

          {/* Right Header: Greeting & Exit Actions */}
          <div className="flex items-center gap-3">
            {/* Personalized Greeting Pill: 'Hello Sir' */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-indigo-500/30 shadow-md">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  S
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-950 animate-pulse" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white tracking-wide leading-none">
                  Hello Sir
                </span>
                <span className="text-[9px] font-mono text-indigo-300 leading-none mt-0.5 hidden sm:inline">
                  {userSession?.email || "Authenticated"}
                </span>
              </div>
            </div>

            {/* Rotation Guide Button */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600 hover:text-white transition-all text-xs font-semibold shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guide</span>
            </button>

            {/* Exit / Log Out Button */}
            <button
              onClick={handleExit}
              title="Safely log out and return to Home"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold shadow-sm transition-all active:scale-95 group"
            >
              <LogOut className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Toast Notification */}
      {showWelcomeToast && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 animate-fade-in">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-slate-950 border border-indigo-500/40 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Welcome back, Sir!
                </p>
                <p className="text-[11px] text-slate-300">
                  Your secure AVL Tree session is now live. Insert values or select a preset rotation below.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowWelcomeToast(false)}
              className="text-xs text-slate-400 hover:text-white font-mono px-2 py-1"
            >
              &times; Dismiss
            </button>
          </div>
        </div>
      )}

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
          AVL Tree Visualizer &bull; Built with React, Next.js, and Tailwind CSS &bull; DSA Project
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
