"use client";

import React, { useState } from "react";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Binary,
  ArrowLeft,
  Sparkles,
  KeyRound
} from "lucide-react";

export default function LoginPage({ onLoginSuccess, onBackToHome }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 4) {
      setError("Password should be at least 4 characters long.");
      return;
    }

    setIsLoading(true);

    // Simulate clean auth verification
    setTimeout(() => {
      setIsLoading(false);
      // Determine greeting name: defaults to 'Sir'
      const greetingName = "Sir";
      onLoginSuccess({
        email: email.trim(),
        displayName: greetingName,
        token: `auth-token-${Date.now()}`
      });
    }, 450);
  };

  const handleDemoFill = () => {
    setEmail("sir@avl.edu");
    setPassword("admin123");
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4 sm:p-6 relative overflow-hidden">
      {/* Background glow ambiance */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Link */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <span className="text-[11px] font-mono text-slate-500">
          AVL Studio &bull; Auth
        </span>
      </div>

      {/* Main Glassmorphic Auth Card */}
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl relative">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-3">
            <Binary className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Sign In to AVL Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access the interactive visualization dashboard
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus-within:border-indigo-500/80 transition-colors">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="email"
                required
                placeholder="sir@avl.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Password
              </label>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus-within:border-indigo-500/80 transition-colors">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 group mt-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Signing In...</span>
              </span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Demo One-Click Sign In Helper */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1 font-medium">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              Demo Credentials
            </span>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Fill Demo Info
            </button>
          </div>
          <div
            onClick={handleDemoFill}
            className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors flex items-center justify-between"
          >
            <div className="font-mono text-[11px] text-slate-300">
              <span className="text-slate-500">Email:</span> sir@avl.edu
              <span className="mx-2 text-slate-600">&bull;</span>
              <span className="text-slate-500">Pass:</span> admin123
            </div>
            <span className="text-[10px] text-indigo-400 font-semibold">
              Auto-Fill
            </span>
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Client-Side Authenticated DSA Session</span>
        </div>
      </div>
    </div>
  );
}
