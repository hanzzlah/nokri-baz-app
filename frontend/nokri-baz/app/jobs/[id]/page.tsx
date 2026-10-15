"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import {
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Clock,
  ExternalLink,
  ChevronLeft,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface JobDetails {
  id: string;
  source: string;
  title: string;
  employer: string | null;
  description: string | null;
  employment_type: string | null;
  grade_level: string | null;
  vacancies: number | null;
  degree_area: string | null; // Updated to match your new backend schema
  education_years: number | null;
  experience_years: number | null;
  age_min: number | null;
  age_max: number | null;
  gender: string | null;
  district: string | null;
  division: string | null;
  date_posted: string | null;
  last_date_to_apply: string | null;
  is_active: boolean;
}

function JobDetailsContent() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [job, setJob] = useState<JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      loadJobDetails(id);
    }
  }, [id]);

  const loadJobDetails = async (jobId: string) => {
    try {
      // Safely encode the ID so special characters don't break the URL
      const safeId = encodeURIComponent(jobId);
      const data = await fetchApi(`/jobs/${safeId}`, { method: "GET" });
      setJob(data);
    } catch (err) {
      console.error("Failed to fetch job:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // --- DYNAMIC URL ROUTING ---
  const getApplyUrl = () => {
    if (!job) return "#";

    if (job.id.startsWith("punjab-")) {
      const slug = job.id.replace("punjab-", "");
      return `https://jobs.punjab.gov.pk/new_recruit/job_detail/${slug}`;
    }

    if (job.id.startsWith("njp-")) {
      const numericId = job.id.replace("njp-", "");
      return `https://njp.gov.pk/jobs/${numericId}`;
    }

    if (job.source.includes("Punjab")) return "https://jobs.punjab.gov.pk/";
    return "https://njp.gov.pk/";
  };

  // --- CLEAN DEGREE PARSING ---
  const renderDegrees = () => {
    if (!job?.degree_area) return null;

    // Simple split by comma now that it's just a standard string
    const degrees = job.degree_area
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    if (degrees.length === 0) return null;

    // Truncate if list is too extensive
    if (degrees.length > 6) {
      return degrees.slice(0, 6).join(", ") + " ...";
    }

    return degrees.join(", ");
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-surface-input">
        <Loader2 size={40} className="animate-spin text-brand-primary mb-4" />
        <p className="text-slate-500 font-bold">Retrieving job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-surface-input flex items-center justify-center p-4">
        <div className="bg-surface-card border border-surface-inputBorder rounded-card p-8 text-center max-w-md w-full shadow-sm">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-extrabold text-slate-800 mb-2">
            Job Not Found
          </h2>
          <p className="text-slate-500 font-medium mb-6">
            This job may have expired or been removed from the portal.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-btn transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const degreeText = renderDegrees();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface-input py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        {/* Navigation & Header */}
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-brand-primary transition-colors mb-6"
          >
            <ChevronLeft size={16} /> Back to Matches
          </button>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-surface-card border border-surface-inputBorder rounded-card p-6 md:p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-primary/10 text-xs font-bold text-brand-primary mb-3">
                <Building2 size={14} />{" "}
                {job.employer || "Government Department"}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-600">
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-slate-400" />{" "}
                  {job.district || job.division || "Pakistan"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase size={16} className="text-slate-400" />{" "}
                  {job.employment_type || "Regular"} •{" "}
                  {job.grade_level || "Salary Unspecified"}
                </span>
              </div>
            </div>

            <div className="relative z-10 flex flex-col md:items-end gap-3 shrink-0">
              {job.is_active ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Accepting Applications
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                  Closed
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content (Left) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-surface-card border border-surface-inputBorder rounded-card p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                Job Description
              </h3>
              <div className="prose prose-slate prose-sm md:prose-base max-w-none text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                {job.description ||
                  "No detailed description provided by the official portal for this posting. Please review the official advertisement on the portal for detailed duties and responsibilities."}
              </div>
            </div>

            <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-card p-6 shadow-sm flex items-start gap-4">
              <div className="mt-1 w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-primary shadow-sm shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="font-bold text-brand-primary text-base">
                  Why you're seeing this
                </h4>
                <p className="text-sm font-medium text-brand-primary/80 mt-1 leading-relaxed">
                  Baz's AI engine determined that your specific background
                  (Education: {job.education_years} yrs, Experience:{" "}
                  {job.experience_years} yrs) makes you a highly eligible
                  candidate for this role.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar / Quick Facts (Right) */}
          <div className="space-y-6">
            <div className="bg-surface-card border border-surface-inputBorder rounded-card p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider border-b border-slate-100 pb-2">
                Requirements
              </h3>

              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm">
                  <GraduationCap
                    className="text-slate-400 shrink-0"
                    size={18}
                  />
                  <div>
                    <p className="font-bold text-slate-700">Education</p>
                    <p className="text-slate-500 font-medium">
                      {job.education_years
                        ? `${job.education_years} Years Minimum`
                        : "Not specified"}
                    </p>
                    {degreeText && (
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {degreeText}
                      </p>
                    )}
                  </div>
                </li>

                <li className="flex items-start gap-3 text-sm">
                  <Briefcase className="text-slate-400 shrink-0" size={18} />
                  <div>
                    <p className="font-bold text-slate-700">Experience</p>
                    <p className="text-slate-500 font-medium">
                      {job.experience_years
                        ? `${job.experience_years}+ Years`
                        : "Fresh / Entry Level"}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3 text-sm">
                  <Calendar className="text-slate-400 shrink-0" size={18} />
                  <div>
                    <p className="font-bold text-slate-700">Age Limit</p>
                    <p className="text-slate-500 font-medium">
                      {job.age_min && job.age_max
                        ? `${job.age_min} to ${job.age_max} Years`
                        : "See official ad"}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-surface-card border border-surface-inputBorder rounded-card p-6 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600 mb-4 bg-amber-50 px-3 py-2 rounded-md border border-amber-100">
                <Clock size={16} />
                <span className="font-bold text-sm">
                  Closes:{" "}
                  {job.last_date_to_apply
                    ? new Date(job.last_date_to_apply).toLocaleDateString(
                        "en-PK",
                        { month: "long", day: "numeric", year: "numeric" },
                      )
                    : "Unknown"}
                </span>
              </div>

              <a
                href={getApplyUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-cta text-white font-bold py-3.5 rounded-btn shadow-sm hover:shadow-ctaHover hover:-translate-y-[1px] transition-all flex items-center justify-center gap-2"
              >
                Apply on Official Portal <ExternalLink size={16} />
              </a>
              <p className="text-xs text-center text-slate-400 font-medium mt-3">
                You will be redirected to{" "}
                <span className="font-bold text-slate-500">{job.source}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-surface-input">
          <Loader2 size={40} className="animate-spin text-brand-primary mb-4" />
          <p className="text-slate-500 font-bold">Preparing job layout...</p>
        </div>
      }
    >
      <JobDetailsContent />
    </Suspense>
  );
}
