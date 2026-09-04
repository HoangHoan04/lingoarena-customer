"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToastStore } from "@/stores/useToastStore";
import {
  Camera,
  CheckCircle2,
  ImagePlus,
  Link as LinkIcon,
  Trash2,
  UploadCloud,
  User,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl: string;
  onSave: (newUrl: string) => void;
}

export default function AvatarModal({
  isOpen,
  onClose,
  currentAvatarUrl,
  onSave,
}: AvatarModalProps) {
  const { addToast } = useToastStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempAvatarUrl, setTempAvatarUrl] = useState(currentAvatarUrl);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTempAvatarUrl(currentAvatarUrl);
      setShowUrlInput(false);
    }
  }, [isOpen, currentAvatarUrl]);

  if (!isOpen) return null;

  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      addToast("Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP)", "warning");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast("Dung lượng tệp không được vượt quá 5MB", "warning");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;

      const img = new Image();
      img.onload = () => {
        const maxDim = 512;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.85);
          setTempAvatarUrl(compressed);
          addToast("Đã tải ảnh lên!", "success");
        } else {
          setTempAvatarUrl(result);
          addToast("Đã tải ảnh lên!", "success");
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave(tempAvatarUrl.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="size-4 text-brand" /> Thay đổi ảnh đại diện
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Live Avatar Circular Preview */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-brand/30 overflow-hidden shadow-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            {tempAvatarUrl ? (
              <img
                src={tempAvatarUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setTempAvatarUrl("")}
              />
            ) : (
              <User className="size-10 text-slate-400" />
            )}
          </div>
        </div>

        {/* Upload Card or URL input toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Chọn ảnh đại diện
            </span>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-xs font-semibold text-brand dark:text-[#7b9bee] hover:underline cursor-pointer"
            >
              {showUrlInput ? "Tải ảnh từ máy" : "Nhập link URL"}
            </button>
          </div>

          {showUrlInput ? (
            <div className="space-y-1.5">
              <Input
                type="url"
                value={tempAvatarUrl}
                onChange={(e) => setTempAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="h-11 rounded-xl text-xs font-mono"
              />
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.[0]) {
                  processImageFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer group ${
                isDragging
                  ? "border-brand bg-brand/5"
                  : "border-slate-200 dark:border-slate-800 hover:border-brand/40 bg-slate-50 dark:bg-slate-800/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    processImageFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-1.5 py-2">
                <div className="size-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UploadCloud className="size-5" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-white">
                  Nhấp để tải ảnh lên hoặc kéo thả
                </p>
                <p className="text-[10px] text-slate-400">
                  PNG, JPG, WEBP (tối đa 5MB)
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          {tempAvatarUrl ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setTempAvatarUrl("")}
              className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer gap-1"
            >
              <Trash2 className="size-3.5" /> Gỡ ảnh
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs font-bold cursor-pointer"
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="rounded-xl text-xs font-bold bg-brand hover:bg-[#1e2f5e] text-white cursor-pointer"
            >
              Áp dụng ảnh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
