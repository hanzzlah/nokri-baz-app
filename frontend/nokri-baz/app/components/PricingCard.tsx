'use client';

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { Check, Zap, Loader2 } from "lucide-react";

interface PricingCardProps {
  isPro?: boolean;
}

export default function PricingCard({ isPro = false }: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Calls FastAPI -> Lemon Squeezy Checkout API
      const data = await fetchApi("/subscriptions/checkout", {
        method: "POST",
      });

      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error("Failed to retrieve checkout URL.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-card p-8 shadow-cardDepth border-2 border-brand-accent relative overflow-hidden flex flex-col justify-between">
      {/* Popular Badge */}
      <div className="absolute top-0 right-0 bg-gradient-cta text-white text-[0.6875rem] font-bold uppercase tracking-wider px-4 py-1 rounded-bl-lg shadow-sm">
        Recommended
      </div>

      <div>
        {/* Header */}
        <div className="flex items-center gap-2 text-brand-primary mb-2">
          <Zap size={20} className="fill-brand-accent text-brand-accent" />
          <h3 className="text-xl font-extrabold tracking-tight">Pro Plan</h3>
        </div>

        <p className="text-xs text-slate-500 mb-6">
          Instant alerts and AI-powered job matching directly to your phone.
        </p>

        {/* Pricing */}
        <div className="mb-6 flex items-baseline gap-1">
          <span className="text-3xl font-black text-slate-900">PKR 1,500</span>
          <span className="text-xs text-slate-500 font-medium">/ month</span>
        </div>

        <hr className="border-slate-100 mb-6" />

        {/* Features List */}
        <ul className="space-y-3 mb-8 text-xs font-medium text-slate-700">
          <li className="flex items-center gap-2">
            <div className="bg-emerald-100 p-0.5 rounded-full text-emerald-600">
              <Check size={14} />
            </div>
            <span>Instant <strong>WhatsApp & Email</strong> job alerts</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="bg-emerald-100 p-0.5 rounded-full text-emerald-600">
              <Check size={14} />
            </div>
            <span>2-Stage AI matching (Voyage AI vector search)</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="bg-emerald-100 p-0.5 rounded-full text-emerald-600">
              <Check size={14} />
            </div>
            <span>Automated domicile & quota eligibility checks</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="bg-emerald-100 p-0.5 rounded-full text-emerald-600">
              <Check size={14} />
            </div>
            <span>Unlimited job saved lists & tracking</span>
          </li>
        </ul>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-2.5 rounded-md mb-4 text-xs font-medium">
          {error}
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={handleUpgrade}
        disabled={isLoading || isPro}
        className="w-full bg-gradient-cta text-white font-bold py-3.5 rounded-btn shadow-sm transition-all hover:-translate-y-[1px] hover:shadow-ctaHover active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex justify-center items-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Preparing Checkout...
          </>
        ) : isPro ? (
          "Current Plan Active"
        ) : (
          "Upgrade to Pro"
        )}
      </button>
    </div>
  );
}