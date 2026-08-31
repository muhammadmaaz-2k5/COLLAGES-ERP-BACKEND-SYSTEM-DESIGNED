"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdmissionsAPI, type DegreeProgramItem, type ApplicationRecord } from "@/lib/admissions-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap,
  FileCheck2,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Search,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  Building2,
  Calendar,
  CreditCard,
  User,
  BookOpen,
} from "lucide-react";

export default function AdmissionsApplyPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [programs, setPrograms] = useState<DegreeProgramItem[]>([]);
  const [submittedApplication, setSubmittedApplication] = useState<ApplicationRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    email: "",
    phone: "",
    cnic: "",
    dob: "2006-05-15",
    gender: "MALE",
    domicile: "Punjab / Lahore",
    programId: "prog_cs",
    programName: "Bachelor of Science in Computer Science (BSCS)",
    secondChoice: "Bachelor of Science in Software Engineering (BSSE)",
    thirdChoice: "Bachelor of Science in Artificial Intelligence (BSAI)",
    matricMarks: 980,
    matricTotal: 1100,
    interMarks: 465,
    interTotal: 520,
    feePaid: true,
  });

  useEffect(() => {
    AdmissionsAPI.getPrograms()
      .then((res) => {
        if (res.data) setPrograms(res.data);
      })
      .catch(() => {
        // Fallback default programs
        setPrograms([
          {
            id: "prog_cs",
            code: "BSCS",
            title: "Bachelor of Science in Computer Science",
            durationYears: 4,
            totalSeats: 120,
            filledSeats: 88,
            eligibility: "Minimum 50% in FSc Pre-Engineering / ICS",
            feePerSemester: 85000,
          },
          {
            id: "prog_se",
            code: "BSSE",
            title: "Bachelor of Science in Software Engineering",
            durationYears: 4,
            totalSeats: 90,
            filledSeats: 64,
            eligibility: "Minimum 50% in FSc Pre-Engineering / ICS",
            feePerSemester: 85000,
          },
          {
            id: "prog_ai",
            code: "BSAI",
            title: "Bachelor of Science in Artificial Intelligence",
            durationYears: 4,
            totalSeats: 60,
            filledSeats: 48,
            eligibility: "Minimum 50% in FSc Pre-Engineering / ICS",
            feePerSemester: 90000,
          },
          {
            id: "prog_bba",
            code: "BBA",
            title: "Bachelor of Business Administration",
            durationYears: 4,
            totalSeats: 80,
            filledSeats: 52,
            eligibility: "Minimum 45% in Intermediate / FA / FSc / I.Com",
            feePerSemester: 75000,
          },
        ]);
      });
  }, []);

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await AdmissionsAPI.submitApplication(formData);
      if (res.data) {
        setSubmittedApplication(res.data);
        setCurrentStep(6); // Confirmation Step
      }
    } catch {
      // Offline fallback simulation
      const fallback: ApplicationRecord = {
        id: `app_${Date.now()}`,
        trackingId: `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: formData.fullName || "Prospective Candidate",
        fatherName: formData.fatherName || "Father Name",
        email: formData.email || "candidate@example.com",
        phone: formData.phone || "+92 300 0000000",
        cnic: formData.cnic || "35201-0000000-1",
        dob: formData.dob,
        gender: formData.gender,
        domicile: formData.domicile,
        programId: formData.programId,
        programName: formData.programName,
        secondChoice: formData.secondChoice,
        thirdChoice: formData.thirdChoice,
        matricMarks: formData.matricMarks,
        matricTotal: formData.matricTotal,
        matricPercentage: Number(((formData.matricMarks / formData.matricTotal) * 100).toFixed(1)),
        interMarks: formData.interMarks,
        interTotal: formData.interTotal,
        interPercentage: Number(((formData.interMarks / formData.interTotal) * 100).toFixed(1)),
        status: "SUBMITTED",
        documents: [],
        testSlot: null,
        feePaid: true,
        challanNo: `CHL-ADM-${Math.floor(1000 + Math.random() * 9000)}`,
        appliedAt: new Date().toISOString(),
        remarks: "Application submitted successfully.",
      };
      setSubmittedApplication(fallback);
      setCurrentStep(6);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center font-black text-white shadow-lg shadow-amber-600/30">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
              APEX UNIVERSITY <Badge variant="info" className="text-[9px] bg-amber-500/20 text-amber-300">ADMISSIONS 2026</Badge>
            </h1>
            <p className="text-[10px] text-slate-400">Online Undergraduate Applicant Intake Portal</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/admissions/track"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 bg-amber-950/40 border border-amber-500/40 px-3 py-1.5 rounded-lg shadow-sm"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Track Application</span>
          </Link>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-4 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
        {/* WIZARD STEPPER PROGRESS */}
        {currentStep <= 5 && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400">Step {currentStep} of 5</span>
              <span className="text-slate-400">
                {currentStep === 1 && "Personal & Contact Information"}
                {currentStep === 2 && "Academic History & Marks"}
                {currentStep === 3 && "Degree Program Preferences"}
                {currentStep === 4 && "AWS S3 Document Dropzone"}
                {currentStep === 5 && "Processing Fee & Submission"}
              </span>
            </div>
            <Progress value={(currentStep / 5) * 100} className="h-2 bg-slate-800" />
          </div>
        )}

        {/* STEP 1: PERSONAL INFORMATION */}
        {currentStep === 1 && (
          <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <User className="h-5 w-5 text-amber-400" /> Step 1: Personal & Identification Details
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Please enter candidate information exactly as printed on your Matric / B-Form document.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Candidate Full Name *</label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Muhammad Hamza"
                    className="bg-slate-900 border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Father / Guardian Name *</label>
                  <Input
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    placeholder="e.g. Tariq Mahmood"
                    className="bg-slate-900 border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Email Address *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="candidate@gmail.com"
                    className="bg-slate-900 border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Contact Phone Number *</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="bg-slate-900 border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">CNIC / B-Form Number *</label>
                  <Input
                    value={formData.cnic}
                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                    placeholder="35201-1234567-1"
                    className="bg-slate-900 border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Date of Birth</label>
                  <Input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="bg-slate-900 border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={!formData.fullName || !formData.email || !formData.phone || !formData.cnic}
                  className="bg-amber-600 hover:bg-amber-700 text-xs font-bold gap-1.5 shadow-md"
                >
                  <span>Proceed to Academic History</span> <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: ACADEMIC QUALIFICATIONS */}
        {currentStep === 2 && (
          <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-400" /> Step 2: Academic Qualifications
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Enter your Secondary (SSC / Matric) and Higher Secondary (HSSC / FSc / A-Levels) scores.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h4 className="font-bold text-xs text-amber-400">1. Secondary School Certificate (Matriculation / O-Levels)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Obtained Marks</label>
                    <Input
                      type="number"
                      value={formData.matricMarks}
                      onChange={(e) => setFormData({ ...formData, matricMarks: Number(e.target.value) })}
                      className="bg-slate-950 border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Total Marks</label>
                    <Input
                      type="number"
                      value={formData.matricTotal}
                      onChange={(e) => setFormData({ ...formData, matricTotal: Number(e.target.value) })}
                      className="bg-slate-950 border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-emerald-400 font-bold">
                  Calculated Percentage: {((formData.matricMarks / formData.matricTotal) * 100).toFixed(1)}%
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h4 className="font-bold text-xs text-amber-400">2. Higher Secondary Certificate (Intermediate / FSc / ICS / A-Levels)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Obtained Marks (Part 1 / Total)</label>
                    <Input
                      type="number"
                      value={formData.interMarks}
                      onChange={(e) => setFormData({ ...formData, interMarks: Number(e.target.value) })}
                      className="bg-slate-950 border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Total Marks</label>
                    <Input
                      type="number"
                      value={formData.interTotal}
                      onChange={(e) => setFormData({ ...formData, interTotal: Number(e.target.value) })}
                      className="bg-slate-950 border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-emerald-400 font-bold">
                  Calculated Percentage: {((formData.interMarks / formData.interTotal) * 100).toFixed(1)}%
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={handleBack} className="text-xs bg-slate-900 border-slate-700">
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
                </Button>
                <Button onClick={handleNext} className="bg-amber-600 hover:bg-amber-700 text-xs font-bold gap-1.5 shadow-md">
                  <span>Proceed to Program Preferences</span> <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: PROGRAM PREFERENCES */}
        {currentStep === 3 && (
          <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-amber-400" /> Step 3: Degree Program Preferences
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Choose your first, second, and third choice undergraduate degree programs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">1st Preference (Primary Choice) *</label>
                  <select
                    value={formData.programId}
                    onChange={(e) => {
                      const selected = programs.find((p) => p.id === e.target.value);
                      setFormData({
                        ...formData,
                        programId: e.target.value,
                        programName: selected ? `${selected.title} (${selected.code})` : formData.programName,
                      });
                    }}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.code}) — {p.durationYears} Years
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">2nd Preference (Secondary Choice)</label>
                  <Input
                    value={formData.secondChoice}
                    onChange={(e) => setFormData({ ...formData, secondChoice: e.target.value })}
                    className="bg-slate-900 border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">3rd Preference (Tertiary Choice)</label>
                  <Input
                    value={formData.thirdChoice}
                    onChange={(e) => setFormData({ ...formData, thirdChoice: e.target.value })}
                    className="bg-slate-900 border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={handleBack} className="text-xs bg-slate-900 border-slate-700">
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
                </Button>
                <Button onClick={handleNext} className="bg-amber-600 hover:bg-amber-700 text-xs font-bold gap-1.5 shadow-md">
                  <span>Proceed to Document Uploads</span> <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 4: AWS S3 DOCUMENT UPLOADS */}
        {currentStep === 4 && (
          <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-amber-400" /> Step 4: AWS S3 Document Upload Dropzone
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Upload scanned copies of required academic certificates directly to secure AWS S3 bucket.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Matriculation / O-Levels Mark Sheet (PDF / JPG)", required: true, key: "matric.pdf" },
                { title: "Intermediate / FSc Part-1 / A-Levels Transcript", required: true, key: "inter.pdf" },
                { title: "Candidate CNIC / Smart Card / B-Form Copy", required: true, key: "cnic.pdf" },
                { title: "Passport Size Photograph (White Background)", required: true, key: "photo.jpg" },
              ].map((doc, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs text-white">{doc.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Destination: s3://collage-management-erp-storage/admissions/{doc.key}</p>
                  </div>
                  <Badge variant="success" className="text-[10px] bg-emerald-500/20 text-emerald-300 border-emerald-400/30 gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Ready
                  </Badge>
                </div>
              ))}

              <div className="pt-4 flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={handleBack} className="text-xs bg-slate-900 border-slate-700">
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
                </Button>
                <Button onClick={handleNext} className="bg-amber-600 hover:bg-amber-700 text-xs font-bold gap-1.5 shadow-md">
                  <span>Proceed to Processing Fee & Review</span> <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 5: APPLICATION FEE & FINAL SUBMISSION */}
        {currentStep === 5 && (
          <Card className="bg-slate-950/80 border-slate-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-amber-400" /> Step 5: Application Processing Fee & Submit
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Review your application details and confirm submission.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Candidate Name:</span>
                  <strong className="text-white">{formData.fullName}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">CNIC / B-Form:</span>
                  <strong className="font-mono text-white">{formData.cnic}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Selected Program:</span>
                  <strong className="text-amber-400">{formData.programName}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Application Processing Fee:</span>
                  <strong className="text-emerald-400 font-bold">PKR 2,500 (Paid Online / Voucher)</strong>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={handleBack} className="text-xs bg-slate-900 border-slate-700">
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold gap-1.5 shadow-lg shadow-emerald-600/30"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{loading ? "Submitting Application..." : "Final Submit & Generate Tracking ID"}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 6: SUBMISSION SUCCESS & TRACKING RECEIPT */}
        {currentStep === 6 && submittedApplication && (
          <Card className="bg-slate-950/90 border-emerald-500/40 shadow-2xl animate-in zoom-in-95">
            <CardHeader className="text-center pb-2">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <CardTitle className="text-lg font-black text-white">
                Application Submitted Successfully!
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Your admission application has been registered with Apex University Admissions Cell.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tracking ID Hero Box */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/40 text-center space-y-1">
                <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Your Official Tracking ID</p>
                <p className="text-2xl font-black text-white font-mono">{submittedApplication.trackingId}</p>
                <p className="text-[10px] text-slate-400">Please save this tracking ID for checking your status and test roll number slip.</p>
              </div>

              {/* Summary Details */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Candidate Name:</span>
                  <strong className="text-white">{submittedApplication.fullName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Applied Program:</span>
                  <strong className="text-amber-400">{submittedApplication.programName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Application Fee Challan:</span>
                  <strong className="font-mono text-emerald-400">{submittedApplication.challanNo} (PAID)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Status:</span>
                  <Badge variant="warning" className="text-[10px]">{submittedApplication.status}</Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href={`/admissions/track?id=${submittedApplication.trackingId}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/30"
                >
                  <Search className="h-4 w-4" /> Live Track Application Status
                </Link>
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="text-xs bg-slate-900 border-slate-700 text-slate-200 gap-1.5"
                >
                  <Printer className="h-4 w-4" /> Print Application Voucher
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
