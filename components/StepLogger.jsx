"use client";

import React, { useEffect, useRef } from "react";
import {
  ListFilter,
  Flame,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCw,
  RotateCcw,
  Clock,
  Info
} from "lucide-react";

export default function StepLogger({
  steps = [],
  currentStepIndex = 0,
  onSelectStep,
  activeStep
}) {
  const activeLogRef = useRef(null);
  const logContainerRef = useRef(null);

  // Auto-scroll log container to active step
  useEffect(() => {
    if (activeLogRef.current && logContainerRef.current) {
      activeLogRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentStepIndex]);

  // Badge icon and color by step type
  const getBadgeDetails = (step) => {
    switch (step.type) {
      case "ROTATION_LL":
        return {
          label: "LL Rotation (Right)",
          color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
          icon: RotateCw,
        };
      case "ROTATION_RR":
        return {
          label: "RR Rotation (Left)",
          color: "bg-purple-500/20 text-purple-300 border-purple-500/40",
          icon: RotateCcw,
        };
      case "ROTATION_LR":
        return {
          label: "LR Double Rotation",
          color: "bg-pink-500/20 text-pink-300 border-pink-500/40",
          icon: Flame,
        };
      case "ROTATION_RL":
        return {
          label: "RL Double Rotation",
          color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
          icon: Flame,
        };
      case "ROTATION_DONE":
        return {
          label: "Rebalanced Subtree",
          color: "bg-teal-500/20 text-teal-300 border-teal-500/40",
          icon: CheckCircle2,
        };
      case "CHECK_BALANCE":
        return {
          label: "Balance Check",
          color: "bg-blue-500/20 text-blue-300 border-blue-500/40",
          icon: AlertCircle,
        };
      case "COMPARE":
        return {
          label: "Compare",
          color: "bg-slate-700/40 text-slate-300 border-slate-600/40",
          icon: ArrowRight,
        };
      case "INSERT_LEAF":
        return {
          label: "Insert Leaf",
          color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          icon: CheckCircle2,
        };
      case "NODE_FOUND":
        return {
          label: "Found Node",
          color: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          icon: Info,
        };
      case "DELETE_LEAF":
      case "DELETE_ONE_CHILD":
      case "FIND_SUCCESSOR":
      case "SWAP_SUCCESSOR":
        return {
          label: "Delete Op",
          color: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          icon: AlertCircle,
        };
      case "COMPLETE":
        return {
          label: "Balanced Tree",
          color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          icon: CheckCircle2,
        };
      default:
        return {
          label: step.type || "Step",
          color: "bg-slate-800 text-slate-400 border-slate-700",
          icon: Clock,
        };
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Step-by-Step Execution Logs
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {steps.length} {steps.length === 1 ? "step" : "steps"} recorded
        </span>
      </div>

      {/* Prominent Active Step Card */}
      {activeStep && (
        <div className="p-3.5 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-950/40 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold text-indigo-400">
              Active Step #{activeStep.stepNumber || currentStepIndex + 1}:
            </span>
            {(() => {
              const badge = getBadgeDetails(activeStep);
              const Icon = badge.icon;
              return (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badge.color}`}
                >
                  <Icon className="w-3 h-3" />
                  {badge.label}
                </span>
              );
            })()}
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {activeStep.description}
          </p>
          {activeStep.bfInfo && (
            <div className="mt-2 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800 inline-block">
              Node <span className="text-white font-bold">{activeStep.bfInfo.nodeValue}</span> &rarr;{" "}
              Height: <span className="text-sky-300 font-bold">{activeStep.bfInfo.height}</span>,{" "}
              Balance Factor:{" "}
              <span
                className={`font-bold ${
                  Math.abs(activeStep.bfInfo.bf) > 1
                    ? "text-rose-400"
                    : "text-emerald-400"
                }`}
              >
                {activeStep.bfInfo.bf >= 0 ? `+${activeStep.bfInfo.bf}` : activeStep.bfInfo.bf}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Scrollable Step History */}
      <div
        ref={logContainerRef}
        className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-[420px]"
      >
        {steps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-44 text-center p-4">
            <Info className="w-6 h-6 text-slate-500 mb-2" />
            <p className="text-xs text-slate-400">
              No operation logged yet.
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Insert or delete a value to view the step-by-step rebalancing trace.
            </p>
          </div>
        ) : (
          steps.map((step, idx) => {
            const isSelected = idx === currentStepIndex;
            const badge = getBadgeDetails(step);
            const Icon = badge.icon;

            return (
              <div
                key={idx}
                ref={isSelected ? activeLogRef : null}
                onClick={() => onSelectStep(idx)}
                className={`group flex items-start gap-2.5 p-2 rounded-xl text-left cursor-pointer transition-all border ${
                  isSelected
                    ? "bg-indigo-950/60 border-indigo-500/70 shadow-md shadow-indigo-950/50"
                    : "bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/50 hover:border-slate-700"
                }`}
              >
                {/* Step Index Circle */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono font-bold ${
                    isSelected
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                  }`}
                >
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold border ${badge.color}`}
                    >
                      <Icon className="w-2.5 h-2.5" />
                      {badge.label}
                    </span>
                    {step.rotationType && (
                      <span className="text-[10px] font-mono text-amber-400 font-bold">
                        [{step.rotationType}]
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
