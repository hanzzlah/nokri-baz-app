"use client";

import PricingCard from "@/app/components/PricingCard";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-xl mb-12">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
          Simple, Transparent Pricing
        </h1>
        <p className="text-slate-600 text-sm">
          Never miss a government job deadline again. Upgrade anytime to get
          instant alerts on WhatsApp.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center max-w-4xl w-full">
        {/* Free Plan Card */}
        <div className="w-full max-w-sm bg-white rounded-card p-8 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Free Plan</h3>
            <p className="text-xs text-slate-500 mb-6">
              Essential search and manual job board viewing.
            </p>
            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900">PKR 0</span>
              <span className="text-xs text-slate-500 font-medium">
                / forever
              </span>
            </div>
            <hr className="border-slate-100 mb-6" />
            <ul className="space-y-3 mb-8 text-xs font-medium text-slate-600">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-slate-400" />
                <span>Manual dashboard job viewing</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-slate-400" />
                <span>Basic eligibility filtering</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400 line-through">
                <span>WhatsApp instant alerts</span>
              </li>
            </ul>
          </div>
          <button
            disabled
            className="w-full bg-slate-100 text-slate-500 font-bold py-3.5 rounded-btn cursor-not-allowed text-xs"
          >
            Your Current Plan
          </button>
        </div>

        {/* Pro Plan Card Component */}
        <PricingCard />
      </div>
    </div>
  );
}
