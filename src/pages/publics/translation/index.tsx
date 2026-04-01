import { useState, useEffect } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import ISO6391 from "iso-639-1";
import Title from "@/components/ui/Tilte";
import { useTheme } from "@/context";

const menuItems = [
  { label: "Văn bản", icon: "pi pi-language" },
  { label: "Hình ảnh", icon: "pi pi-image" },
  { label: "Tài liệu", icon: "pi pi-file" },
  { label: "Trang web", icon: "pi pi-globe" },
];

interface Language {
  code: string;
  name: string;
}

export default function TranslationScreen() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [sourceText, setSourceText] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>("vi");
  const [selectedTarget, setSelectedTarget] = useState<string>("en");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const langList = ISO6391.getAllCodes().map((code) => ({
      code: code,
      name: ISO6391.getNativeName(code),
    }));
    setLanguages(langList);
  }, []);

  const renderTextInput = () => (
    <div className="rounded-lg  overflow-hidden ">
      <div className="flex items-stretch h-12">
        <div className="flex items-center flex-1 px-2">
          {[
            { code: "auto", name: "Phát hiện ngôn ngữ" },
            { code: "vi", name: "Việt" },
            { code: "en", name: "Anh" },
            { code: "fr", name: "Pháp" },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedSource(lang.code)}
              className={`
              h-full px-3 text-sm whitespace-nowrap transition-colors
              ${
                selectedSource === lang.code
                  ? "text-[#1a73e8] font-medium border-b-4 border-[#1a73e8]"
                  : "text-[#444746] border-transparent"
              }
            `}
            >
              {lang.name}
            </button>
          ))}
          <button className="flex items-center px-2 h-full text-[#444746]">
            <i className="pi pi-chevron-down text-xs" />
          </button>
        </div>

        {/* Swap Button */}
        <div className="flex items-center justify-center w-[52px] shrink-0">
          <button
            onClick={() => {
              const src = selectedSource;
              const tgt = selectedTarget;
              if (src !== "auto") {
                setSelectedSource(tgt);
                setSelectedTarget(src);
              }
            }}
            className={`
            flex items-center justify-center w-9 h-9 rounded-full transition-colors
            ${
              selectedSource === "auto"
                ? "text-[#bdc1c6] cursor-not-allowed"
                : "text-[#1a73e8] hover:bg-[#e8f0fe] cursor-pointer"
            }
          `}
            disabled={selectedSource === "auto"}
          >
            <i className="pi pi-arrow-right-arrow-left text-base" />
          </button>
        </div>

        {/* Target Languages */}
        <div className="flex items-center flex-1 px-2">
          {[
            { code: "en", name: "Anh" },
            { code: "vi", name: "Việt" },
            { code: "zh", name: "Trung (Giản thể)" },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedTarget(lang.code)}
              className={`
              h-full px-3 text-sm whitespace-nowrap transition-colors
              ${
                selectedTarget === lang.code
                  ? "text-[#1a73e8] font-medium border-b-4 border-[#1a73e8]"
                  : "text-[#444746] border-b-4 border-transparent"
              }
            `}
            >
              {lang.name}
            </button>
          ))}
          <button className="flex items-center px-2 h-full text-[#444746]">
            <i className="pi pi-chevron-down text-xs" />
          </button>
        </div>
      </div>

      {/* Text Panels Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:rounded-xl md:shadow-sm overflow-hidden gap-5">
        {/* Source Panel (Ô Nhập Liệu) */}
        <div className="flex flex-col p-4 min-h-[200px] border border-gray-200 rounded-3xl">
          {/* Vùng văn bản chính */}
          <div className="flex-1">
            <InputTextarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Nhập văn bản"
              maxLength={5000}
              className="w-full border-none! shadow-none! text-2xl resize-none p-0 focus:ring-0! bg-transparent text-[#202124] leading-relaxed"
              rows={6}
              autoResize={false}
            />
          </div>

          {/* Toolbar Footer (Bên trái) */}
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-transparent">
            <div className="flex gap-1">
              <Button
                icon="pi pi-microphone"
                rounded
                text
                severity="secondary"
                className="text-[#444746] w-10 h-10"
                title="Nhập bằng giọng nói"
                pt={{
                  root: {
                    className: `!border-none !shadow-none !ring-0 !outline-none !focus:ring-0 !focus:outline-none !focus:border-none transition-all duration-300 active:scale-90 flex items-center justify-center !bg-transparent`,
                  },
                  icon: {
                    className: `text-xl text-cyan-400 opacity-80 group-hover:opacity-100`,
                  },
                }}
              />
              <Button
                icon="pi pi-pencil"
                rounded
                text
                severity="secondary"
                className="text-[#444746] w-10 h-10"
                title="Nhập bằng chữ viết tay"
                pt={{
                  root: {
                    className: `!border-none !shadow-none !ring-0 !outline-none !focus:ring-0 !focus:outline-none !focus:border-none transition-all duration-300 active:scale-90 flex items-center justify-center !bg-transparent`,
                  },
                  icon: {
                    className: `text-xl text-cyan-400 opacity-80 group-hover:opacity-100`,
                  },
                }}
              />
              <Button
                icon="pi pi-copy"
                rounded
                text
                severity="secondary"
                className="text-[#444746] hover:bg-[#e8eaed] w-10 h-10"
                pt={{
                  root: {
                    className: `!border-none !shadow-none !ring-0 !outline-none !focus:ring-0 !focus:outline-none !focus:border-none transition-all duration-300 active:scale-90 flex items-center justify-center !bg-transparent`,
                  },
                  icon: {
                    className: `text-xl text-cyan-400 opacity-80 group-hover:opacity-100`,
                  },
                }}
              />
            </div>
            <span className="text-xs text-[#80868b]">
              {sourceText.length} / 5000
            </span>
          </div>
        </div>

        {/* Target Panel (Ô Hiển Thị) */}
        <div className="flex flex-col p-4 min-h-[200px] border border-gray-200 rounded-3xl">
          {/* Vùng văn bản chính - Sử dụng cùng font và line-height */}
          <div
            className={`flex-1 ${isDark ? "text-white" : "text-[#202124]"}  text-2xl leading-relaxed wrap-break-word overflow-y-auto`}
          >
            {sourceText ? (
              <span className="text-[#202124]">{sourceText}</span>
            ) : (
              <span className="text-[#9aa0a6]">Bản dịch</span>
            )}
          </div>

          {/* Toolbar Footer (Bên phải) - Giữ chiều cao bằng bên trái để cân đối */}
          <div className="flex items-center justify-between mt-4 pt-2">
            <div className="flex gap-1">
              {/* Thêm các nút tương tác cho bản dịch để giống Google Translate */}
              <Button
                icon="pi pi-volume-up"
                rounded
                text
                severity="secondary"
                className="text-[#444746] hover:bg-[#e8eaed] w-10 h-10"
                pt={{
                  root: {
                    className: `
                            !border-none !shadow-none !ring-0 !outline-none 
                            !focus:ring-0 !focus:outline-none !focus:border-none
                            transition-all duration-300 active:scale-90
                            flex items-center justify-center !bg-transparent
                        `,
                  },
                  icon: {
                    className: `text-xl text-cyan-400 opacity-80 group-hover:opacity-100`,
                  },
                }}
              />
              <Button
                icon="pi pi-copy"
                rounded
                text
                severity="secondary"
                className="text-[#444746] hover:bg-[#e8eaed] w-10 h-10"
                pt={{
                  root: {
                    className: `!border-none !shadow-none !ring-0 !outline-none !focus:ring-0 !focus:outline-none !focus:border-none transition-all duration-300 active:scale-90 flex items-center justify-center !bg-transparent`,
                  },
                  icon: {
                    className: `text-xl text-cyan-400 opacity-80 group-hover:opacity-100`,
                  },
                }}
              />
            </div>
            <span className="text-[11px] text-[#80868b] italic cursor-pointer hover:underline">
              Gửi ý kiến phản hồi
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFileUpload = (isImage: boolean) => (
    <div className="rounded-xl shadow-sm  p-12 text-center">
      <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        <div className="flex flex-col items-center">
          <div className="w-48 h-32 rounded-3xl flex items-center justify-center mb-4 border border-dashed opacity-70">
            <i
              className={`pi ${isImage ? "pi-image" : "pi-file"} text-5xl`}
            ></i>
          </div>
          <p className="text-xl font-medium">Kéo và thả</p>
        </div>
        <div className="h-40 border-l hidden md:block opacity-20"></div>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <p className="font-medium opacity-80">Hoặc chọn một tệp</p>
          <FileUpload
            mode="basic"
            name="demo[]"
            auto
            url="/api/upload"
            accept={isImage ? "image/*" : ".pdf,.docx,.xlsx"}
            maxFileSize={1000000}
            chooseLabel="Duyệt qua các tệp"
            className="w-full"
          />
          {isImage && (
            <Button
              label="Dán tệp từ bảng nhớ tạm"
              icon="pi pi-clipboard"
              outlined
              className="w-full"
            />
          )}
          <p className="text-[10px] opacity-50 mt-2">
            Hỗ trợ: {isImage ? ".jpg, .png, .webp" : ".pdf, .docx, .xlsx"}
          </p>
        </div>
      </div>
    </div>
  );

  const renderWebInput = () => (
    <div className="rounded-xl shadow-sm border p-20 flex items-center justify-center">
      <div className="w-full max-w-2xl relative flex items-center">
        <InputText
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-4 pr-16"
          placeholder="Nhập URL trang web..."
        />
        <Button
          icon="pi pi-arrow-right"
          rounded
          className="absolute right-2 h-10 w-10 shadow-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <Title
          className={`text-center ${isDark ? "text-white" : "text-[#202124]"}`}
        >
          Hỗ trợ bạn dịch thuật chuẩn nhất
        </Title>

        {/* Custom Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-6 py-4">
          {menuItems.map((item, index) => (
            <Button
              key={item.label}
              label={item.label}
              icon={item.icon}
              onClick={() => setActiveTabIndex(index)}
              text={activeTabIndex !== index}
              outlined={activeTabIndex === index}
              className="px-4 py-2 text-sm font-medium transition-all shadow-none"
              rounded
              size="small"
              pt={{
                root: {
                  className: `!shadow-none !ring-0 !outline-none !focus:ring-0 !focus:outline-none !focus:border-none transition-all duration-300 active:scale-90 flex items-center justify-center !bg-transparent`,
                },
                icon: {
                  className: `text-xl text-cyan-400 opacity-80 group-hover:opacity-100`,
                },
              }}
            />
          ))}
        </div>

        {/* Nội dung Render */}
        <div className="transition-all duration-300">
          {activeTabIndex === 0 && renderTextInput()}
          {activeTabIndex === 1 && renderFileUpload(true)}
          {activeTabIndex === 2 && renderFileUpload(false)}
          {activeTabIndex === 3 && renderWebInput()}
        </div>

        {/* Footer Buttons */}
        <div className="max-w-md mx-auto mt-16 flex justify-around">
          {[
            { label: "Nhật ký", icon: "pi pi-history" },
            { label: "Đã lưu", icon: "pi pi-star" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center cursor-pointer"
            >
              <Button
                icon={item.icon}
                rounded
                outlined
                severity="secondary"
                className="mb-2 w-14 h-14"
              />
              <span className="text-xs font-medium opacity-70">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
