import { useGetMe } from "@/hooks/auth/useAuth";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { Avatar } from "primereact/avatar";
import { useState } from "react";

// Mock Data for Arena
const AVAILABLE_ARENAS = [
  {
    id: 1,
    title: "IELTS Full Test #129",
    type: "FULL TEST",
    participants: 1240,
    duration: "180 min",
    difficulty: "Advanced",
    reward: "500 XP",
    image: "https://vcdn1-vnexpress.vnecdn.net/2021/04/13/IELTS-8761-1618302062.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=W4Zg8H9nE6gE0a6QvjWlgA",
    active: true,
  },
  {
    id: 2,
    title: "TOEIC Rapid Fire",
    type: "PRACTICE",
    participants: 856,
    duration: "45 min",
    difficulty: "Intermediate",
    reward: "200 XP",
    image: "https://anhngumshoa.com/uploads/images/userfiles/2020/06/trung-tam-luyen-thi-toeic-uy-tin.jpg",
    active: false,
  },
  {
    id: 3,
    title: "Vocabulary Master",
    type: "MINI GAME",
    participants: 3421,
    duration: "15 min",
    difficulty: "Beginner",
    reward: "100 XP",
    image: "https://tienganhmoingay.com/static/img/course/vocabulary.png",
    active: false,
  }
];

const LEADERBOARD_MOCK = [
  { rank: 1, name: "Hoàng Hoàn", score: 950, avatar: "https://i.pravatar.cc/150?u=1" },
  { rank: 2, name: "Minh Anh", score: 920, avatar: "https://i.pravatar.cc/150?u=2" },
  { rank: 3, name: "Thanh Tùng", score: 890, avatar: "https://i.pravatar.cc/150?u=3" },
];

export default function ArenaScreen() {
  const { data: meData } = useGetMe();
  const user = (meData as any)?.user ?? (meData as any);
  const student = user?.student;

  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero Stats Section */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-700 pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar 
                image={student?.avatarUrl || "https://i.pravatar.cc/150?u=lingo"} 
                shape="circle" 
                className="w-24 h-24 border-4 border-white/20 shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full border-2 border-indigo-600 shadow-sm">
                RANK #12
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white mb-1">
                Chào mừng, {student?.fullName || user?.username}! 🎯
              </h1>
              <p className="text-white/80 font-medium">Bạn đang đứng thứ 12 trong danh sách học viên xuất sắc tháng này.</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <span className="text-white/60 text-xs block font-bold uppercase">Điểm Arena</span>
                  <span className="text-white text-xl font-black">2,450 XP</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <span className="text-white/60 text-xs block font-bold uppercase">Tỷ lệ chính xác</span>
                  <span className="text-white text-xl font-black">88%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block w-72 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-bold">Cấp độ tiếp theo</span>
              <span className="text-white/60 text-sm">LV. 14</span>
            </div>
            <ProgressBar value={65} showValue={false} className="h-2 bg-white/20" color="#facc15" />
            <p className="text-white/60 text-xs mt-3 text-center">Cần thêm 350 XP để đạt cấp độ Master</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Tabs & Search */}
            <div className="flex items-center justify-between">
              <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5">
                {["all", "ielts", "toeic", "daily"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                      activeTab === tab 
                        ? "bg-indigo-600 text-white shadow-lg" 
                        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
              <Button icon="pi pi-filter" rounded text className="text-slate-400" />
            </div>

            {/* Featured Arena Card */}
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900 aspect-16/9 md:aspect-21/9 shadow-2xl shadow-indigo-500/20">
              <img 
                src={AVAILABLE_ARENAS[0].image} 
                alt="Main Challenge" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col md:flex-row items-end justify-between gap-6">
                <div className="max-w-md">
                  <Tag value="LIVE CHALLENGE" severity="danger" className="mb-4 animate-pulse px-3 py-1 font-black" />
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                    {AVAILABLE_ARENAS[0].title}
                  </h2>
                  <div className="flex items-center gap-4 text-white/80 font-medium">
                    <span className="flex items-center gap-1.5"><i className="pi pi-users text-indigo-400" /> {AVAILABLE_ARENAS[0].participants}+</span>
                    <span className="flex items-center gap-1.5"><i className="pi pi-clock text-indigo-400" /> {AVAILABLE_ARENAS[0].duration}</span>
                  </div>
                </div>
                <Button 
                  label="VÀO THI NGAY" 
                  icon="pi pi-bolt" 
                  className="bg-indigo-600 hover:bg-indigo-700 border-none px-10 py-5 rounded-2xl font-black text-lg shadow-xl"
                />
              </div>
            </div>

            {/* Grid of Arenas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {AVAILABLE_ARENAS.slice(1).map((arena) => (
                <div key={arena.id} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-2">
                       <Tag value={arena.type} className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold" />
                       <Tag severity="success" value={arena.reward} className="font-bold" />
                    </div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{arena.difficulty}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{arena.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Thách thức bản thân với hàng nghìn câu hỏi sát thực tế.</p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map(i => (
                        <Avatar key={i} image={`https://i.pravatar.cc/50?u=${i + arena.id}`} shape="circle" className="w-8 h-8 border-2 border-white dark:border-slate-900" />
                      ))}
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold text-slate-400 border-2 border-white dark:border-slate-900">
                        +{arena.participants}
                      </div>
                    </div>
                    <Button icon="pi pi-arrow-right" rounded text className="text-indigo-600 hover:bg-indigo-50 dark:hover:bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Leaderboard Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-800 dark:text-white">Bảng Xếp Hạng</h3>
                <Button label="Tất cả" link className="text-indigo-600 p-0 font-bold" />
              </div>
              <div className="space-y-6">
                {LEADERBOARD_MOCK.map((item) => (
                  <div key={item.rank} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-black ${
                        item.rank === 1 ? "bg-yellow-100 text-yellow-600" : 
                        item.rank === 2 ? "bg-slate-100 text-slate-600" :
                        "bg-orange-100 text-orange-600"
                      }`}>
                        {item.rank}
                      </div>
                      <Avatar image={item.avatar} shape="circle" className="w-10 h-10" />
                      <span className="font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
                    </div>
                    <span className="font-black text-indigo-600">{item.score} <span className="text-[10px] text-slate-400 uppercase">XP</span></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Card */}
            <div className="bg-linear-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full translate-x-12 -translate-y-12" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <i className="pi pi-trophy text-yellow-400 text-xl" />
                </div>
                <h3 className="text-xl font-black mb-2">Bộ sưu tập Huy hiệu</h3>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">Bạn đã thu thập được 12/24 huy hiệu đấu trường. Cố gắng thêm nhé!</p>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                      <i className="pi pi-star-fill text-yellow-500 shadow-sm" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Global Chat/Feed Callout */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-[2.5rem] p-8 border border-indigo-100 dark:border-indigo-500/10">
               <div className="flex items-center gap-4 mb-4">
                 <div className="flex -space-x-2">
                   <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white dark:border-slate-900" />
                   <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900" />
                 </div>
                 <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold">1,204 học viên đang online</span>
               </div>
               <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-6 italic">"Ai rủ group luyện Speaking IELTS Target 7.5 không ạ?"</p>
               <Button label="Tham gia thảo luận" className="w-full bg-white dark:bg-slate-900 text-indigo-600 border border-indigo-200 dark:border-indigo-500/20 font-bold py-3 rounded-2xl" />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
