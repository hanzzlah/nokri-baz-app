"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { fetchApi } from "@/lib/api";
import { pakistanLocations, Province } from "@/lib/pakistan_locations";
import {
  Edit2,
  Save,
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  Loader2,
  UploadCloud,
  FileText,
  CheckCircle2,
  Calendar,
  Phone,
  AlertCircle,
} from "lucide-react";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ),
  );

  // Resume State
  const [hasResume, setHasResume] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    date_of_birth: "",
    gender: "Male",
    domicile: "Punjab" as Province, // Acts as Province
    division: "",
    district: "",
    degree_title: "",
    education_years: 16,
    experience_years: 0,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await fetchApi("/profile/", { method: "GET" });
      if (data) {
        setFormData({
          full_name: data.full_name || "",
          phone_number: data.phone_number || "",
          date_of_birth: data.date_of_birth || "",
          gender: data.gender || "Male",
          domicile: data.domicile || "Punjab",
          division: data.division || "",
          district: data.district || "",
          degree_title: data.degree_title || "",
          education_years: data.education_years || 16,
          experience_years: data.experience_years || 0,
        });
        if (data.resume_text) setHasResume(true);
        setIsEditing(false);
      }
    } catch (error: any) {
      if (error.message.includes("404")) {
        setIsEditing(true); // Force edit mode if no profile
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Save Basic Profile Info
      await fetchApi("/profile/", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      // 2. Upload Resume if queued in edit mode
      if (fileToUpload) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const formPayload = new FormData();
        formPayload.append("file", fileToUpload);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/profile/resume`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${session?.access_token}` },
            body: formPayload,
          },
        );

        if (!res.ok)
          throw new Error("Profile saved, but resume upload failed.");
        setHasResume(true);
        setFileToUpload(null);
      }

      setIsEditing(false);
      router.refresh();
      if (isLoading) router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Error saving profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Location Dropdown Handlers ---
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      domicile: e.target.value as Province,
      division: "",
      district: "",
    });
  };
  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, division: e.target.value, district: "" });
  };

  // --- Resume Queuing ---
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (
      e.dataTransfer.files &&
      e.dataTransfer.files[0].type === "application/pdf"
    ) {
      setFileToUpload(e.dataTransfer.files[0]);
    } else {
      alert("Please select a valid PDF file.");
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0].type === "application/pdf") {
      setFileToUpload(e.target.files[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-surface-input">
        <Loader2 size={32} className="animate-spin text-brand-primary" />
      </div>
    );
  }

  // Derived location arrays based on current selection
  const availableDivisions = formData.domicile
    ? Object.keys(pakistanLocations[formData.domicile])
    : [];
  const availableDistricts =
    formData.domicile && formData.division
      ? pakistanLocations[formData.domicile][
          formData.division as keyof (typeof pakistanLocations)[typeof formData.domicile]
        ]
      : [];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface-input py-12">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800">
              Your Identity & Profile
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
              Complete accuracy is required to match with NJP and Punjab Gov
              jobs.
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-brand-primary rounded-btn text-sm font-bold border border-surface-inputBorder shadow-sm transition-colors"
            >
              <Edit2 size={16} /> Update Profile
            </button>
          )}
        </div>

        {/* ----------------------------- */}
        {/* DISPLAY MODE (Read-Only)      */}
        {/* ----------------------------- */}
        {!isEditing ? (
          <div className="space-y-6">
            <div className="bg-surface-card border border-surface-inputBorder rounded-card p-6 md:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-input border border-surface-inputBorder">
                <User className="text-brand-primary mt-1" size={24} />
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                    Full Name & Gender
                  </p>
                  <p className="text-slate-800 font-bold">
                    {formData.full_name || "Not set"}{" "}
                    <span className="text-slate-400 font-medium">
                      ({formData.gender})
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-input border border-surface-inputBorder">
                <Phone className="text-brand-primary mt-1" size={24} />
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                    Contact Details
                  </p>
                  <p className="text-slate-800 font-bold">
                    {formData.phone_number || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-input border border-surface-inputBorder">
                <Calendar className="text-brand-primary mt-1" size={24} />
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                    Date of Birth
                  </p>
                  <p className="text-slate-800 font-bold">
                    {formData.date_of_birth || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-input border border-surface-inputBorder">
                <MapPin className="text-brand-primary mt-1" size={24} />
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                    Location / Domicile
                  </p>
                  <p className="text-slate-800 font-bold">
                    {[formData.district, formData.domicile]
                      .filter(Boolean)
                      .join(", ") || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-input border border-surface-inputBorder">
                <GraduationCap className="text-brand-primary mt-1" size={24} />
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                    Education
                  </p>
                  <p className="text-slate-800 font-bold">
                    {formData.degree_title || "Not set"}
                  </p>
                  <p className="text-slate-500 text-sm font-medium">
                    {formData.education_years} Years of Schooling
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-input border border-surface-inputBorder">
                <Briefcase className="text-brand-primary mt-1" size={24} />
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                    Experience
                  </p>
                  <p className="text-slate-800 font-bold">
                    {formData.experience_years} Years Professional
                  </p>
                </div>
              </div>
            </div>

            {/* Resume Display Status */}
            <div
              className={`p-6 rounded-card border shadow-sm flex items-center justify-between ${hasResume ? "bg-emerald-50 border-emerald-200" : "bg-surface-card border-surface-inputBorder"}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${hasResume ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}
                >
                  {hasResume ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <AlertCircle size={24} />
                  )}
                </div>
                <div>
                  <h3
                    className={`font-bold ${hasResume ? "text-emerald-800" : "text-slate-800"}`}
                  >
                    AI Resume Enrichment
                  </h3>
                  <p
                    className={`text-sm font-medium mt-1 ${hasResume ? "text-emerald-700/80" : "text-slate-500"}`}
                  >
                    {hasResume
                      ? "Your CV is actively enriching your vector profile for hyper-accurate job matches."
                      : "Resume not added. Click 'Update Profile' to upload your CV for better AI matching."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ----------------------------- */
          /* EDIT MODE (Form)              */
          /* ----------------------------- */
          <div className="bg-surface-card border border-surface-inputBorder rounded-card shadow-sm p-6 md:p-8">
            <form onSubmit={handleSave} className="space-y-8">
              {/* SECTION: Personal */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-surface-inputBorder">
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Full Name (As per CNIC)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      className="w-full bg-surface-input border border-surface-inputBorder rounded-input px-4 py-3 text-slate-900 outline-none focus:bg-white focus:border-brand-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="03XXXXXXXXX"
                      value={formData.phone_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone_number: e.target.value,
                        })
                      }
                      className="w-full bg-surface-input border border-surface-inputBorder rounded-input px-4 py-3 text-slate-900 outline-none focus:bg-white focus:border-brand-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date_of_birth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          date_of_birth: e.target.value,
                        })
                      }
                      className="w-full bg-surface-input border border-surface-inputBorder rounded-input px-4 py-3 text-slate-900 outline-none focus:bg-white focus:border-brand-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="w-full bg-surface-input border border-surface-inputBorder rounded-input px-4 py-3 text-slate-900 outline-none focus:bg-white focus:border-brand-primary transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION: Location */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-surface-inputBorder">
                  Location / Domicile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Province / Territory
                    </label>
                    <select
                      required
                      value={formData.domicile}
                      onChange={handleProvinceChange}
                      className="w-full bg-surface-input border border-surface-inputBorder rounded-input px-4 py-3 text-slate-900 outline-none focus:bg-white focus:border-brand-primary transition-all"
                    >
                      {Object.keys(pakistanLocations).map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Division
                    </label>
                    <select
                      required
                      value={formData.division}
                      onChange={handleDivisionChange}
                      className="w-full bg-surface-input border border-surface-inputBorder rounded-input px-4 py-3 text-slate-900 outline-none focus:bg-white focus:border-brand-primary transition-all"
                    >
                      <option value="" disabled>
                        Select Division
                      </option>
                      {availableDivisions.map((div) => (
                        <option key={div} value={div}>
                          {div}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      District
                    </label>
                    <select
                      required
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                      className="w-full bg-surface-input border border-surface-inputBorder rounded-input px-4 py-3 text-slate-900 outline-none focus:bg-white focus:border-brand-primary transition-all"
                    >
                      <option value="" disabled>
                        Select District
                      </option>
                      {availableDistricts.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION: Qualifications */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-surface-inputBorder">
                  Qualifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Total Years of Education
                    </label>
                    <select
                      value={formData.education_years}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          education_years: parseInt(e.target.value),
                        })
                      }
                      className="w-full bg-surface-input border border-surface-inputBorder rounded-input px-4 py-3 text-slate-900 outline-none focus:bg-white focus:border-brand-primary transition-all"
                    >
                      <option value={8}>8 or below (Middle/Primary)</option>
                      <option value={10}>10 (Matriculation / O-Level)</option>
                      <option value={12}>
                        12 (Intermediate / DAE / A-Level)
                      </option>
                      <option value={14}>14 (Bachelors / Associate)</option>
                      <option value={16}>16 (BS / Masters / LLB)</option>
                      <option value={18}>18 (MS / MPhil)</option>
                      <option value={22}>22+ (PhD)</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700">
                      Degree Title / Specialization
                    </label>
                    {/* Using a datalist provides niche suggestions but allows any text input */}
                    <input
                      type="text"
                      list="degree-options"
                      required
                      placeholder="e.g. ACCA, MBBS, BBA, BS Computer Science"
                      value={formData.degree_title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          degree_title: e.target.value,
                        })
                      }
                      className="w-full bg-surface-input border border-surface-inputBorder rounded-input px-4 py-3 text-slate-900 outline-none focus:bg-white focus:border-brand-primary transition-all"
                    />
                    <datalist id="degree-options">
                      <option value="ACCA" />
                      <option value="CA" />
                      <option value="MBBS" />
                      <option value="BDS" />
                      <option value="Pharm-D" />
                      <option value="BBA" />
                      <option value="MBA" />
                      <option value="BS Computer Science" />
                      <option value="BS Software Engineering" />
                      <option value="BS Information Technology" />
                      <option value="BSc Electrical Engineering" />
                      <option value="BSc Civil Engineering" />
                      <option value="BSc Mechanical Engineering" />
                      <option value="BA" />
                      <option value="BCom" />
                      <option value="LLB" />
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      required
                      value={formData.experience_years}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          experience_years: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-surface-input border border-surface-inputBorder rounded-input px-4 py-3 text-slate-900 outline-none focus:bg-white focus:border-brand-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: Resume Uploader (Inside Form) */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-surface-inputBorder flex items-center gap-2">
                  AI Resume Upload{" "}
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary">
                    Optional
                  </span>
                </h3>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200
                    ${isDragging ? "border-brand-primary bg-brand-primary/5" : "border-slate-300 hover:border-brand-primary hover:bg-slate-50"}
                    ${fileToUpload ? "bg-emerald-50 border-emerald-300" : ""}
                  `}
                >
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                  />

                  {fileToUpload ? (
                    <>
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3 text-emerald-600 shadow-sm">
                        <FileText size={24} />
                      </div>
                      <p className="text-emerald-800 font-bold text-base mb-1">
                        {fileToUpload.name}
                      </p>
                      <p className="text-emerald-600 font-medium text-xs">
                        PDF ready to be uploaded upon saving.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-3 text-brand-primary shadow-sm">
                        <UploadCloud size={24} />
                      </div>
                      <p className="text-slate-800 font-bold text-base mb-1">
                        Click or drop your CV (PDF)
                      </p>
                      <p className="text-slate-500 font-medium text-xs">
                        {hasResume
                          ? "This will overwrite your existing AI resume vector."
                          : "Boost your match accuracy."}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 pt-6 mt-8 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setFileToUpload(null);
                    loadProfile(); // Reverts to display mode safely
                  }}
                  className="px-6 py-3.5 rounded-btn text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-gradient-cta text-white font-bold py-3.5 rounded-btn shadow-sm hover:shadow-ctaHover hover:-translate-y-[1px] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSaving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {isSaving
                    ? "Saving Identity & AI Data..."
                    : "Save Profile Data"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
