"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { LogOut, LayoutDashboard, Sparkles, UserCircle } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 backdrop-blur-[16px] bg-surface-card border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Brand Logo & Baz Mascot */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 flex items-center justify-center bg-surface-input rounded-lg p-1 border border-surface-inputBorder group-hover:border-brand-accent transition-colors shadow-sm">
            <Image src="/naukri-baaz-logo.svg" alt="Baz Logo" width={32} height={32} />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-brand-primary flex items-center gap-1.5">
            BAZ{" "}
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-accent/20 text-brand-primary border border-brand-accent/30">
              Gov Jobs
            </span>
          </span>
        </Link>

        {/* Navigation Links - Dynamic based on Auth State */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hover:text-brand-primary transition-colors flex items-center gap-1.5"
              >
                <Sparkles size={16} className="text-brand-accent" /> AI Matches
              </Link>
              <Link
                href="/profile"
                className="hover:text-brand-primary transition-colors flex items-center gap-1.5"
              >
                <UserCircle size={16} /> Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/#features"
                className="hover:text-brand-primary transition-colors"
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                className="hover:text-brand-primary transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/#faq"
                className="hover:text-brand-primary transition-colors"
              >
                FAQ
              </Link>
            </>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-btn bg-surface-input text-brand-primary border border-surface-inputBorder hover:bg-white transition-all shadow-sm"
              >
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-btn transition-colors"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth"
                className="text-sm font-bold text-slate-500 hover:text-brand-primary px-2 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className="text-sm font-bold px-5 py-2.5 rounded-btn bg-gradient-cta text-white shadow-sm hover:shadow-ctaHover hover:-translate-y-[1px] transition-all active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
