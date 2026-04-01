import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog"; // Thêm Dialog
import { useRouter } from "@/routes/hooks";
import FancyDivider from "@/components/ui/Divider";

// Cấu trúc dữ liệu chi tiết cho từng Part của từng kỹ năng
const SKILL_DETAILS: Record<string, Record<string, string[]>> = {
  TOEIC: {
    Listening: [
      "Part 1: Photographs",
      "Part 2: Question-Response",
      "Part 3: Short Conversations",
      "Part 4: Short Talks",
    ],
    Reading: [
      "Part 5: Incomplete Sentences",
      "Part 6: Text Completion",
      "Part 7: Reading Comprehension",
    ],
  },
  IELTS: {
    Listening: ["Part 1", "Part 2", "Part 3", "Part 4"],
    Reading: ["Passage 1", "Passage 2", "Passage 3"],
    Writing: ["Task 1", "Task 2"],
    Speaking: ["Part 1", "Part 2", "Part 3"],
  },
  APTIS: {
    "Grammar & Vocab": ["Grammar", "Vocabulary"],
    Listening: ["Part 1", "Part 2", "Part 3", "Part 4"],
    Reading: ["Part 1", "Part 2", "Part 3", "Part 4"],
    Writing: ["Part 1", "Part 2", "Part 3", "Part 4"],
    Speaking: ["Part 1", "Part 2", "Part 3", "Part 4"],
  },
  VSTEP: {
    Listening: ["Part 1", "Part 2", "Part 3"],
    Reading: ["Passage 1", "Passage 2", "Passage 3", "Passage 4"],
    Writing: ["Task 1", "Task 2"],
    Speaking: ["Part 1", "Part 2", "Part 3"],
  },
};

const CERT_DATA = {
  IELTS: {
    color: "from-purple-600 to-indigo-600",
    icon: "pi-globe",
    skills: ["Listening", "Reading", "Writing", "Speaking"],
  },
  TOEIC: {
    color: "from-blue-600 to-cyan-600",
    icon: "pi-briefcase",
    skills: ["Listening", "Reading"],
  },
  APTIS: {
    color: "from-orange-500 to-red-600",
    icon: "pi-desktop",
    skills: ["Grammar & Vocab", "Listening", "Reading", "Writing", "Speaking"],
  },
  VSTEP: {
    color: "from-emerald-500 to-teal-600",
    icon: "pi-bookmark",
    skills: ["Listening", "Reading", "Writing", "Speaking"],
  },
};

type CertType = keyof typeof CERT_DATA;

export default function PracticeScreen() {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const certParam = searchParams.get("cert");

  const [activeCert, setActiveCert] = useState<CertType>(
    (certParam as CertType) || "IELTS",
  );
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showPartModal, setShowPartModal] = useState(false);

  useEffect(() => {
    if (certParam && certParam in CERT_DATA) {
      setActiveCert(certParam as CertType);
    }
  }, [certParam]);

  const handleOpenSkill = (skill: string) => {
    setSelectedSkill(skill);
    setShowPartModal(true);
  };

  const navigateToPractice = (path: string) => {
    setShowPartModal(false);
    router.push(path);
  };

  return (
    <div className="pb-12 px-6 container mx-auto">
      {/* Header Section giữ nguyên */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold mb-4 tracking-tight">
          Trung Tâm{" "}
          <span className="text-indigo-600 dark:text-cyan-400">Luyện Tập</span>
        </h1>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Tab Buttons giữ nguyên */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {(Object.keys(CERT_DATA) as CertType[]).map((cert) => (
            <button
              key={cert}
              onClick={() => setActiveCert(cert)}
              className={`px-8 py-3 rounded-2xl font-bold transition-all duration-300 border-2 ${
                activeCert === cert
                  ? "bg-indigo-600 border-indigo-600 text-white scale-105 shadow-lg"
                  : "border-slate-200 dark:border-white/10 opacity-60 hover:opacity-100"
              }`}
            >
              {cert}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Full Test Card */}
          <Card className="lg:col-span-1 overflow-hidden border-none shadow-xl relative group">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${CERT_DATA[activeCert].color} opacity-90`}
            ></div>
            <div className="relative z-1 p-6 text-white h-full flex flex-col justify-between min-h-[350px]">
              <div>
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                  <i
                    className={`pi ${CERT_DATA[activeCert].icon} text-3xl`}
                  ></i>
                </div>
                <h2 className="text-3xl font-black mb-3">Thi Thử Full Đề</h2>
                <p className="opacity-80 font-medium">
                  Trải nghiệm áp lực phòng thi thật.
                </p>
              </div>
              <Button
                label="Bắt đầu ngay"
                icon="pi pi-play"
                className="bg-white text-indigo-600 font-bold border-none py-3"
                onClick={() =>
                  router.push(`/practice/${activeCert.toLowerCase()}/full-test`)
                }
              />
            </div>
          </Card>

          {/* Skills Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CERT_DATA[activeCert].skills.map((skill) => (
              <div
                key={skill}
                onClick={() => handleOpenSkill(skill)}
                className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 hover:border-indigo-500 dark:hover:border-cyan-400 transition-all cursor-pointer group bg-white/5 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold group-hover:text-indigo-600 dark:group-hover:text-cyan-400">
                    Luyện {skill}
                  </h3>
                  <i className="pi pi-arrow-right opacity-0 group-hover:opacity-100 transition-all"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal chọn Part - Trái tim của yêu cầu mới */}
      <Dialog
        header={`Luyện tập ${selectedSkill} - ${activeCert}`}
        visible={showPartModal}
        onHide={() => setShowPartModal(false)}
        className="w-full max-w-lg"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        draggable={false}
      >
        <div className="flex flex-col gap-4 py-2">
          {/* Option: Làm Full Skill */}
          <button
            onClick={() =>
              navigateToPractice(
                `/practice/${activeCert.toLowerCase()}/${selectedSkill?.toLowerCase()}/full`,
              )
            }
            className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-md"
          >
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <i className="pi pi-bolt"></i>
            </div>
            <div className="text-left">
              <p className="text-lg">Làm Full Kỹ Năng</p>
              <p className="text-xs font-normal opacity-80">
                Làm toàn bộ các Part của {selectedSkill}
              </p>
            </div>
          </button>

          <FancyDivider children="Hoặc chọn từng Part" />

          {/* List: Chọn từng Part */}
          <div className="grid grid-cols-1 gap-2">
            {selectedSkill &&
              SKILL_DETAILS[activeCert][selectedSkill]?.map((part, index) => (
                <button
                  key={part}
                  onClick={() =>
                    navigateToPractice(
                      `/practice/${activeCert.toLowerCase()}/${selectedSkill.toLowerCase()}/part-${index + 1}`,
                    )
                  }
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all font-semibold"
                >
                  <span>{part}</span>
                  <i className="pi pi-chevron-right text-xs opacity-50"></i>
                </button>
              ))}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
