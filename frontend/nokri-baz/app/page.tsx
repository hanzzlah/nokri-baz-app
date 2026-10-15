"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Search,
  HelpCircle,
} from "lucide-react";

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);

  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ),
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    /* 
      1. scroll-smooth: Makes navbar anchor links smooth
      2. scrollbar hiding: removes the ugly visual scrollbar
      3. snap-y snap-mandatory: Forces the viewport to lock onto sections 
    */
    <div className="h-[calc(100vh-4rem)] w-full overflow-y-auto snap-y snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-surface-input">
      {/* 1. HERO SECTION */}
      <section
        id="hero"
        className="min-h-[calc(100vh-4rem)] w-full snap-start snap-always flex flex-col items-center justify-center relative overflow-hidden bg-gradient-radial-bg bg-background-middle text-white shadow-cardDepth"
      >
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-brand-accent mb-8 shadow-sm">
            <Sparkles size={14} />
            <span>The Smarter Way to Find Govt Jobs</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Stop Searching. <br className="hidden sm:inline" />
            <span className="text-brand-accent">Let the Jobs Find You.</span>
          </h1>

          <p className="text-base sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            We scan <span className="text-white font-bold">njp.gov.pk</span> and{" "}
            <span className="text-white font-bold">Punjab Gov</span> portals
            24/7. Tell us your degree and experience, and we’ll send perfect
            matches directly to your WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            {user ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-btn bg-surface-card text-brand-primary font-bold text-base shadow-ctaHover transition-all hover:-translate-y-[2px] flex items-center justify-center gap-2"
              >
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <Link
                href="/auth"
                className="w-full sm:w-auto px-8 py-4 rounded-btn bg-surface-card text-brand-primary font-extrabold text-base shadow-ctaHover transition-all hover:-translate-y-[2px] flex items-center justify-center gap-2"
              >
                Create Free Account <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM WE SOLVE */}
      <section className="min-h-[calc(100vh-4rem)] w-full snap-start snap-always flex flex-col items-center justify-center bg-white border-y border-surface-inputBorder py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Search className="text-brand-primary" size={36} />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-6 leading-tight">
            Scrolling through endless circulars{" "}
            <br className="hidden md:inline" /> is a waste of your time.
          </h2>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto mb-12">
            Most government job boards are crowded, confusing, and hard to
            filter. Candidates miss out on great opportunities simply because
            they didn't see the post before the deadline.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100 border border-slate-100 rounded-card shadow-sm p-6">
            <div className="p-4">
              <p className="text-4xl font-extrabold text-brand-primary">
                Daily
              </p>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-2">
                Portal Scans
              </p>
            </div>
            <div className="p-4">
              <p className="text-4xl font-extrabold text-brand-accent">100%</p>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-2">
                Relevant Matches
              </p>
            </div>
            <div className="p-4">
              <p className="text-4xl font-extrabold text-[#25D366]">Instant</p>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-2">
                WhatsApp Alerts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES */}
      <section
        id="features"
        className="min-h-[calc(100vh-4rem)] w-full snap-start snap-always flex flex-col items-center justify-center bg-surface-input py-12"
      >
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
              Your Personal Job Assistant
            </h2>
            <p className="text-slate-500 font-medium">
              We handle the searching, so you can focus on applying.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-card border border-surface-inputBorder p-8 rounded-card shadow-sm hover:shadow-cardDepth transition-all duration-300">
              <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center mb-6">
                <Sparkles size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">
                Smart Matching
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                We read between the lines. Baz understands your degree,
                experience, and location to find jobs that are actually meant
                for you.
              </p>
            </div>

            <div className="bg-surface-card border border-surface-inputBorder p-8 rounded-card shadow-sm hover:shadow-cardDepth transition-all duration-300">
              <div className="w-12 h-12 bg-[#25D366]/10 text-[#25D366] rounded-xl flex items-center justify-center mb-6">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">
                Be The First To Apply
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Don't wait to check the website. Get an instant message on
                WhatsApp the second a relevant job is published.
              </p>
            </div>

            <div className="bg-surface-card border border-surface-inputBorder p-8 rounded-card shadow-sm hover:shadow-cardDepth transition-all duration-300">
              <div className="w-12 h-12 bg-brand-accent/10 text-brand-primary rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">
                Eligibility Filter
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                No more wasted applications. We automatically hide jobs where
                you don't meet the strict age limits or education minimums.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section
        id="how-it-works"
        className="min-h-[calc(100vh-4rem)] w-full snap-start snap-always flex flex-col items-center justify-center bg-white border-t border-slate-100 py-12"
      >
        <div className="max-w-5xl mx-auto px-4 w-full">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-4">
              Get Setup in 2 Minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-[2px] bg-slate-100 z-0"></div>

            <div className="flex flex-col items-center text-center relative z-10">
              <span className="w-12 h-12 rounded-full bg-brand-primary text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-md border-4 border-white">
                1
              </span>
              <h4 className="text-lg font-bold text-slate-800 mb-2">
                Build Your Profile
              </h4>
              <p className="text-sm text-slate-500 font-medium">
                Create a free account and enter your basic education and work
                experience.
              </p>
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              <span className="w-12 h-12 rounded-full bg-brand-primary text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-md border-4 border-white">
                2
              </span>
              <h4 className="text-lg font-bold text-slate-800 mb-2">
                We Start Scanning
              </h4>
              <p className="text-sm text-slate-500 font-medium">
                Baz continuously monitors official government boards, reading
                every circular for you.
              </p>
            </div>

            <div className="flex flex-col items-center text-center relative z-10">
              <span className="w-12 h-12 rounded-full bg-brand-primary text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-md border-4 border-white">
                3
              </span>
              <h4 className="text-lg font-bold text-slate-800 mb-2">
                Get Hired
              </h4>
              <p className="text-sm text-slate-500 font-medium">
                Check your dashboard for ranked matches, or wait for your phone
                to buzz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section
        id="faq"
        className="min-h-[calc(100vh-4rem)] w-full snap-start snap-always flex flex-col items-center justify-center bg-surface-input border-t border-surface-inputBorder py-12"
      >
        <div className="max-w-4xl mx-auto px-4 w-full">
          <div className="text-center mb-12">
            <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="text-brand-primary" size={24} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-card border border-surface-inputBorder shadow-sm">
              <h4 className="text-base font-bold text-slate-800 mb-2">
                Which portals do you monitor?
              </h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                We currently monitor njp.gov.pk (National Job Portal) and
                jobs.punjab.gov.pk in real-time. We are constantly working on
                adding more provincial boards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-card border border-surface-inputBorder shadow-sm">
              <h4 className="text-base font-bold text-slate-800 mb-2">
                Is Baz free to use?
              </h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Yes! Creating a profile and viewing your AI-matched jobs on the
                dashboard is completely free. We offer a premium tier for
                instant WhatsApp alerts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-card border border-surface-inputBorder shadow-sm">
              <h4 className="text-base font-bold text-slate-800 mb-2">
                How accurate is the AI matching?
              </h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Our 2-stage engine first strictly filters out jobs you aren't
                legally eligible for (based on age and degree level), then uses
                semantic vectors to score how well your specific skills match
                the job description.
              </p>
            </div>

            <div className="bg-white p-6 rounded-card border border-surface-inputBorder shadow-sm">
              <h4 className="text-base font-bold text-slate-800 mb-2">
                Can I upload my resume?
              </h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Yes! Once you create an account, you can securely upload your
                PDF resume. Our system extracts the text to build an even deeper
                profile of your skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="min-h-[calc(100vh-4rem)] w-full snap-start snap-always flex flex-col items-center justify-center bg-white border-t border-slate-100 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center w-full">
          <div className="bg-gradient-radial-bg bg-background-middle p-10 md:p-16 rounded-[2rem] shadow-cardDepth relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-surface-input rounded-2xl flex items-center justify-center mb-6 border border-surface-inputBorder shadow-sm">
                <Image
                  src="/naukri-baaz-logo.svg"
                  alt="Baz Logo"
                  width={40}
                  height={40}
                />
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Secure Your Government Career Today
              </h2>

              <Link
                href={user ? "/dashboard" : "/auth"}
                className="inline-flex items-center gap-2 px-8 py-4 mt-4 rounded-btn bg-surface-card text-brand-primary font-bold text-base shadow-ctaHover transition-all hover:-translate-y-[2px] active:scale-95"
              >
                {user ? "View Your Matches" : "Create Free Account"}{" "}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
