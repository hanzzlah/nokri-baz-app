"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function AuthPortal() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ),
  );

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Password Strength Logic
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 7) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; // 0 to 4
  };
  const strength = calculateStrength(password);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        router.refresh();
        router.push("/dashboard");
      } else {
        if (password !== confirmPassword)
          throw new Error("Passwords do not match");

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });

        if (error) throw error;
        alert("Check your email to confirm your account!");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-radial-bg bg-background-middle">
      {/* Auth Container */}
      <div className="w-full max-w-[480px] bg-surface-card backdrop-blur-[16px] rounded-card p-8 shadow-cardDepth border border-surface-border">
        {/* Segmented Tab Switcher */}
        <div
          role="tablist"
          className="relative flex bg-surface-input border border-surface-inputBorder p-1 rounded-full mb-8 shadow-inner"
        >
          {/* Active Indicator Pill */}
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              activeTab === "signup" ? "translate-x-full" : "translate-x-0"
            }`}
          />

          <button
            role="tab"
            aria-selected={activeTab === "signin"}
            onClick={() => setActiveTab("signin")}
            className={`relative z-10 w-1/2 py-2.5 text-sm transition-colors ${
              activeTab === "signin"
                ? "text-brand-primary font-bold"
                : "text-slate-500 font-medium hover:text-slate-700"
            }`}
          >
            Sign In
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "signup"}
            onClick={() => setActiveTab("signup")}
            className={`relative z-10 w-1/2 py-2.5 text-sm transition-colors ${
              activeTab === "signup"
                ? "text-brand-primary font-bold"
                : "text-slate-500 font-medium hover:text-slate-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Panels Container */}
        <div className="grid items-start">
          {/* Sign In Panel */}
          <div
            className={`col-start-1 row-start-1 transition-all duration-300 ease-out flex flex-col ${
              activeTab === "signin"
                ? "opacity-100 z-10 translate-x-0 pointer-events-auto"
                : "opacity-0 -z-10 -translate-x-4 pointer-events-none"
            }`}
          >
            {/* Logo and Tagline Header */}
            <div className="flex flex-col items-center justify-center text-center mb-8 opacity-90">
              <div className="w-12 h-12 bg-surface-input rounded-xl flex items-center justify-center mb-4 border border-surface-inputBorder shadow-sm">
                <Image
                  src="/naukri-baaz-logo.svg"
                  alt="Baz Logo"
                  width={28}
                  height={28}
                />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">
                Welcome back to Baz.
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-1.5 max-w-[260px] leading-relaxed">
                Your AI career co-pilot for securing roles across NJP and Punjab
                Gov portals.
              </p>
            </div>

            <form onSubmit={handleAuth} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-surface-input border border-surface-inputBorder rounded-input px-4 py-3.5 text-slate-900 outline-none transition-all focus:bg-white focus:border-surface-inputFocus focus:shadow-inputFocus placeholder:text-slate-400"
                />
              </div>

              <div className="flex flex-col gap-2 relative">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs font-bold text-brand-accent hover:text-brand-primary transition-colors"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-input border border-surface-inputBorder rounded-input px-4 py-3.5 text-slate-900 outline-none transition-all focus:bg-white focus:border-surface-inputFocus focus:shadow-inputFocus placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-brand-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                disabled={isLoading}
                className="mt-2 w-full bg-gradient-cta text-white font-bold text-base py-4 rounded-btn shadow-sm transition-all hover:-translate-y-[1px] hover:shadow-ctaHover active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />{" "}
                    Authenticating...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          {/* Sign Up Panel */}
          <form
            onSubmit={handleAuth}
            className={`col-start-1 row-start-1 transition-all duration-300 ease-out flex flex-col gap-5 ${
              activeTab === "signup"
                ? "opacity-100 z-10 translate-x-0 pointer-events-auto"
                : "opacity-0 -z-10 translate-x-4 pointer-events-none"
            }`}
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                required={activeTab === "signup"}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rana Hanzlah Yasir"
                className="w-full bg-surface-input border border-surface-inputBorder rounded-input px-4 py-3.5 text-slate-900 outline-none transition-all focus:bg-white focus:border-surface-inputFocus focus:shadow-inputFocus placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">
                Work Email
              </label>
              <input
                type="email"
                required={activeTab === "signup"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-surface-input border border-surface-inputBorder rounded-input px-4 py-3.5 text-slate-900 outline-none transition-all focus:bg-white focus:border-surface-inputFocus focus:shadow-inputFocus placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">
                Password
              </label>
              <input
                type="password"
                required={activeTab === "signup"}
                value={password}
                placeholder="Create a strong password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-input border border-surface-inputBorder rounded-input px-4 py-3.5 text-slate-900 outline-none transition-all focus:bg-white focus:border-surface-inputFocus focus:shadow-inputFocus placeholder:text-slate-400"
              />
              {/* Password Strength Meter */}
              <div className="flex gap-1 h-1.5 mt-1 w-full rounded-full overflow-hidden bg-slate-200">
                <div
                  className={`h-full transition-all duration-300 ${strength >= 1 ? "bg-red-500 w-1/4" : "w-0"}`}
                />
                <div
                  className={`h-full transition-all duration-300 ${strength >= 2 ? "bg-amber-500 w-1/4" : "w-0"}`}
                />
                <div
                  className={`h-full transition-all duration-300 ${strength >= 3 ? "bg-yellow-400 w-1/4" : "w-0"}`}
                />
                <div
                  className={`h-full transition-all duration-300 ${strength >= 4 ? "bg-brand-accent w-1/4" : "w-0"}`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">
                Confirm Password
              </label>
              <input
                type="password"
                required={activeTab === "signup"}
                value={confirmPassword}
                placeholder="Repeat password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-surface-input text-slate-900 border rounded-input px-4 py-3.5 outline-none transition-all focus:bg-white focus:shadow-inputFocus placeholder:text-slate-400 ${
                  confirmPassword && password !== confirmPassword
                    ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.25)]"
                    : "border-surface-inputBorder focus:border-surface-inputFocus"
                }`}
              />
            </div>

            <button
              disabled={
                isLoading ||
                (password !== confirmPassword && confirmPassword.length > 0)
              }
              className="mt-2 w-full bg-gradient-cta text-white font-bold text-base py-4 rounded-btn shadow-sm transition-all hover:-translate-y-[1px] hover:shadow-ctaHover active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Setting up
                  account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
