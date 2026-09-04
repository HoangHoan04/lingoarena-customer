"use client";

import { ExamTypeHub } from "@/components/practice/ExamTypeHub";

export default function ToeicPracticeHubPage() {
  return (
    <ExamTypeHub
      examCode="TOEIC"
      accentClass="from-slate-950 via-[#192b55] to-slate-950"
      badgeClass="text-blue-200"
    />
  );
}
