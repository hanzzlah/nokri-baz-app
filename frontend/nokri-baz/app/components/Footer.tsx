"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Briefcase, ShieldAlert, FileText } from "lucide-react";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | string>("");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mascot */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-max">
              <div className="w-8 h-8 flex items-center justify-center bg-slate-900 rounded-lg p-1 border border-slate-700 group-hover:border-brand-accent transition-colors">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  <path
                    d="M 170 100 C 140 20, 60 20, 20 180 C 15 220, 20 260, 30 300 L 60 240 L 65 310 L 100 260 L 110 320 L 140 280 L 150 330 L 170 270 Z"
                    fill="#059669"
                  />
                  <path
                    d="M 230 100 C 260 20, 340 20, 380 180 C 385 220, 380 260, 370 300 L 340 240 L 335 310 L 300 260 L 290 320 L 260 280 L 250 330 L 230 270 Z"
                    fill="#065f46"
                  />
                  <path
                    d="M 160 120 C 140 60, 80 60, 50 180 L 160 250 Z"
                    fill="#84cc16"
                  />
                  <polygon
                    points="200,180 150,200 160,250 130,300 200,360"
                    fill="#92400e"
                  />
                  <polygon
                    points="200,180 250,200 240,250 270,300 200,360"
                    fill="#78350f"
                  />
                  <polygon points="185,80 200,80 200,15" fill="#facc15" />
                  <polygon points="215,80 200,80 200,15" fill="#ca8a04" />
                </svg>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                BAZ
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm">
              The AI-powered matching engine for njp.gov.pk and Punjab Gov jobs.
              We track the boards so you don't have to.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm tracking-wide uppercase">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-brand-accent transition-colors flex items-center gap-2"
                >
                  <Briefcase size={14} /> Home
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-brand-accent transition-colors flex items-center gap-2"
                >
                  <ShieldAlert size={14} /> Pricing & Pro
                </Link>
              </li>
              <li>
                <Link
                  href="/auth"
                  className="hover:text-brand-accent transition-colors flex items-center gap-2"
                >
                  <FileText size={14} /> Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Support / Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm tracking-wide uppercase">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="mailto:support@bazjobs.com"
                  className="hover:text-brand-accent transition-colors flex items-center gap-2"
                >
                  <Mail size={14} /> Contact Us
                </a>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-brand-accent transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-brand-accent transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>&copy; {currentYear} Baz Gov Jobs. All rights reserved.</p>
          <p>Made with AI in Rawalpindi, PK.</p>
        </div>
      </div>
    </footer>
  );
}
