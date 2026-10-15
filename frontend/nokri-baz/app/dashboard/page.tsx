"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { pakistanLocations, Province } from "@/lib/pakistan_locations";
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  GraduationCap,
  Clock,
  ChevronRight,
  Loader2,
  Sparkles,
  Building2,
  AlertTriangle,
  X,
  RefreshCw,
} from "lucide-react";

interface JobMatch {
  id: string;
  title: string;
  department: string;
  province: string;
  division: string;
  district: string;
  type: string;
  salary_range: string;
  deadline: string;
  similarity_score: number;
  education_years_req: number;
  experience_req: number;
  portal_source: "NJP" | "Punjab Gov";
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(true);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  // --- FILTER STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [minScore, setMinScore] = useState<number>(50); // Default 50% threshold
  const [filterPortal, setFilterPortal] = useState<string>("All");
  const [filterProvince, setFilterProvince] = useState<string>("All");
  const [filterDivision, setFilterDivision] = useState<string>("All");
  const [filterDistrict, setFilterDistrict] = useState<string>("All");
  const [filterMinEdu, setFilterMinEdu] = useState<number>(0);
  const [filterMinExp, setFilterMinExp] = useState<number>(0);

  useEffect(() => {
    checkProfileAndLoadMatches();
  }, []);

  const checkProfileAndLoadMatches = async () => {
    try {
      const profileData = await fetchApi("/profile/", { method: "GET" });
      if (profileData && profileData.degree_title) {
        setProfileExists(true);
        await loadJobMatches();
      } else {
        setProfileExists(false);
      }
    } catch (error: any) {
      if (error.message.includes("404")) {
        setProfileExists(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadJobMatches = async () => {
    try {
      // Hits your updated FastAPI endpoint
      const data = await fetchApi("/jobs/matches", { method: "GET" });

      if (data && Array.isArray(data)) {
        setMatches(data);
      }
    } catch (error) {
      console.error("Failed to load matches:", error);
    }
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterProvince(e.target.value);
    setFilterDivision("All");
    setFilterDistrict("All");
  };

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterDivision(e.target.value);
    setFilterDistrict("All");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setMinScore(50);
    setFilterPortal("All");
    setFilterProvince("All");
    setFilterDivision("All");
    setFilterDistrict("All");
    setFilterMinEdu(0);
    setFilterMinExp(0);
  };

  const filteredMatches = matches
    .filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesScore = job.similarity_score >= minScore;
      const matchesPortal =
        filterPortal === "All" || job.portal_source === filterPortal;
      const matchesProv =
        filterProvince === "All" || job.province === filterProvince;
      const matchesDiv =
        filterDivision === "All" || job.division === filterDivision;
      const matchesDist =
        filterDistrict === "All" || job.district === filterDistrict;
      const matchesEdu = job.education_years_req >= filterMinEdu;
      const matchesExp = job.experience_req >= filterMinExp;

      return (
        matchesSearch &&
        matchesScore &&
        matchesPortal &&
        matchesProv &&
        matchesDiv &&
        matchesDist &&
        matchesEdu &&
        matchesExp
      );
    })
    .sort((a, b) => b.similarity_score - a.similarity_score);

  const availableDivisions =
    filterProvince !== "All"
      ? Object.keys(pakistanLocations[filterProvince as Province])
      : [];
  const availableDistricts =
    filterProvince !== "All" && filterDivision !== "All"
      ? pakistanLocations[filterProvince as Province][
          filterDivision as keyof (typeof pakistanLocations)[Province]
        ]
      : [];

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-surface-input">
        <Loader2 size={40} className="animate-spin text-brand-primary mb-4" />
        <p className="text-slate-500 font-bold">Synthesizing AI Matches...</p>
      </div>
    );
  }

  if (!profileExists) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-surface-input py-12 px-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-surface-card border border-surface-inputBorder rounded-card p-8 text-center shadow-cardDepth">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600 shadow-sm border border-amber-200">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-3">
            Profile Incomplete
          </h2>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">
            We can't find government jobs for you until we know your education,
            experience, and domicile. It only takes 2 minutes to set up.
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 bg-gradient-cta text-white px-8 py-3.5 rounded-btn font-bold shadow-sm hover:shadow-ctaHover hover:-translate-y-[1px] transition-all"
          >
            Set Up My Profile <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface-input py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-xs font-bold text-brand-primary mb-3 border border-brand-primary/20">
              <Sparkles size={14} /> Cohere Vector Match Active
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Your Job Feed
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Ranked dynamically against your profile vector.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64 flex-shrink-0">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-card border border-surface-inputBorder rounded-input text-sm text-slate-900 outline-none focus:border-brand-primary focus:shadow-inputFocus transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-btn text-sm font-bold border transition-all ${
                showFilters
                  ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                  : "bg-surface-card text-slate-700 border-surface-inputBorder hover:bg-slate-50"
              }`}
            >
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        {/* PROFILE ADJUSTMENT BANNER */}
        {showBanner && (
          <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
            <div>
              <h4 className="text-sm font-bold text-brand-primary">
                Not seeing the right matches?
              </h4>
              <p className="text-xs text-brand-primary/80 font-medium mt-0.5">
                Your results are highly dependent on your AI profile parameters
                and resume vector.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="text-xs font-bold bg-white text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-md hover:bg-brand-primary/10 transition-colors whitespace-nowrap"
              >
                Update Profile
              </Link>
              <button
                onClick={() => setShowBanner(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ADVANCED FILTERS PANEL */}
        {showFilters && (
          <div className="bg-surface-card border border-surface-inputBorder rounded-card p-6 shadow-sm animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Refine Matches
              </h3>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-primary transition-colors"
              >
                <RefreshCw size={14} /> Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">
                  Min. Match Score
                </label>
                <select
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="w-full bg-surface-input border border-surface-inputBorder rounded-md px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-primary transition-colors"
                >
                  <option value={0}>0% (Show All)</option>
                  <option value={40}>40% & Above</option>
                  <option value={50}>50% & Above</option>
                  <option value={70}>70% & Above</option>
                  <option value={85}>85% & Above</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">
                  Portal Source
                </label>
                <select
                  value={filterPortal}
                  onChange={(e) => setFilterPortal(e.target.value)}
                  className="w-full bg-surface-input border border-surface-inputBorder rounded-md px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-primary transition-colors"
                >
                  <option value="All">All Portals</option>
                  <option value="NJP">NJP Only</option>
                  <option value="Punjab Gov">Punjab Gov Only</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">
                  Min. Education Required
                </label>
                <select
                  value={filterMinEdu}
                  onChange={(e) => setFilterMinEdu(Number(e.target.value))}
                  className="w-full bg-surface-input border border-surface-inputBorder rounded-md px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-primary transition-colors"
                >
                  <option value={0}>Any Education</option>
                  <option value={10}>Matric (10 yrs)</option>
                  <option value={12}>Inter (12 yrs)</option>
                  <option value={14}>Bachelors (14 yrs)</option>
                  <option value={16}>BS/Masters (16 yrs)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">
                  Min. Experience Required
                </label>
                <select
                  value={filterMinExp}
                  onChange={(e) => setFilterMinExp(Number(e.target.value))}
                  className="w-full bg-surface-input border border-surface-inputBorder rounded-md px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-primary transition-colors"
                >
                  <option value={0}>Any Experience</option>
                  <option value={1}>1+ Years</option>
                  <option value={3}>3+ Years</option>
                  <option value={5}>5+ Years</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">
                  Province/Territory
                </label>
                <select
                  value={filterProvince}
                  onChange={handleProvinceChange}
                  className="w-full bg-surface-input border border-surface-inputBorder rounded-md px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-primary transition-colors"
                >
                  <option value="All">All Provinces</option>
                  {Object.keys(pakistanLocations).map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">
                  Division
                </label>
                <select
                  disabled={filterProvince === "All"}
                  value={filterDivision}
                  onChange={handleDivisionChange}
                  className="w-full bg-surface-input border border-surface-inputBorder rounded-md px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-primary transition-colors disabled:opacity-50"
                >
                  <option value="All">All Divisions</option>
                  {availableDivisions.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">
                  District
                </label>
                <select
                  disabled={filterDivision === "All"}
                  value={filterDistrict}
                  onChange={(e) => setFilterDistrict(e.target.value)}
                  className="w-full bg-surface-input border border-surface-inputBorder rounded-md px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-primary transition-colors disabled:opacity-50"
                >
                  <option value="All">All Districts</option>
                  {availableDistricts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* JOB CARDS FEED */}
        <div className="grid grid-cols-1 gap-4">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((job) => (
              <Link
                href={`/jobs/${job.id}`}
                key={job.id}
                className="group block bg-surface-card border border-surface-inputBorder rounded-card p-5 sm:p-6 shadow-sm hover:shadow-cardDepth hover:border-brand-primary/30 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6 cursor-pointer"
              >
                {/* Score Badge */}
                <div className="hidden md:flex flex-col items-center justify-center min-w-[100px] border-r border-slate-100 pr-6">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg
                      className="w-full h-full -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="text-slate-100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className={
                          job.similarity_score >= 85
                            ? "text-[#25D366]"
                            : job.similarity_score >= 60
                              ? "text-brand-accent"
                              : "text-amber-500"
                        }
                        strokeDasharray={`${job.similarity_score}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                    </svg>
                    <span className="absolute text-sm font-extrabold text-slate-800">
                      {job.similarity_score}%
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-2">
                    Match
                  </span>
                </div>

                {/* Job Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      {/* Mobile Score Badge */}
                      <div className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100 mb-2">
                        <div
                          className={`w-2 h-2 rounded-full ${job.similarity_score >= 85 ? "bg-[#25D366]" : job.similarity_score >= 60 ? "bg-brand-accent" : "bg-amber-500"}`}
                        ></div>
                        <span className="text-xs font-extrabold text-slate-700">
                          {job.similarity_score}% Match
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-brand-primary transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 mt-1">
                        <Building2 size={14} />
                        {job.department}
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center px-2.5 py-1 rounded-md bg-brand-primary/5 text-brand-primary border border-brand-primary/10 text-xs font-bold whitespace-nowrap h-fit">
                      {job.portal_source}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <MapPin size={14} className="text-slate-400" />
                      {[job.district, job.province].filter(Boolean).join(", ")}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Briefcase size={14} className="text-slate-400" />{" "}
                      {job.type} • {job.salary_range}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <GraduationCap size={14} className="text-slate-400" />{" "}
                      {job.education_years_req} yrs ed • {job.experience_req}{" "}
                      yrs exp
                    </div>
                  </div>
                </div>

                {/* Action Column */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 pl-0 md:pl-6 gap-4">
                  <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
                    <Clock size={12} />
                    Due{" "}
                    {new Date(job.deadline).toLocaleDateString("en-PK", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>

                  {/* Changed from <Link> to a styled <div> to avoid nested anchors */}
                  <div className="flex items-center gap-1 text-sm font-bold text-white bg-brand-primary group-hover:bg-[#00705a] px-5 py-2.5 rounded-btn shadow-sm transition-colors w-full md:w-auto justify-center">
                    View Details <ChevronRight size={16} />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-surface-card border border-surface-inputBorder rounded-card p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Search size={28} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                No matches found
              </h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto mb-6">
                We couldn't find any listings matching your specific filters.
                Try lowering your Match Score threshold or removing location
                constraints.
              </p>
              <button
                onClick={clearFilters}
                className="text-sm font-bold text-brand-primary border border-brand-primary/30 rounded-md px-4 py-2 hover:bg-brand-primary/5 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
