import { FileUpload } from "primereact/fileupload";
import { useToast } from "@/context/ToastContext";

interface DocumentTabProps {
  isDark: boolean;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
}

export function DocumentTab({ isDark, uploadedFile, setUploadedFile }: DocumentTabProps) {
  const { showToast } = useToast();

  const handleFileUploadEvent = (file: File) => {
    setUploadedFile(file);
    showToast({
      type: "success",
      title: "Thành công",
      message: `Đã nhận tệp: ${file.name}`,
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const isValid = !!file.name.match(/\.(pdf|docx|xlsx)$/i);
      if (isValid) {
        handleFileUploadEvent(file);
      } else {
        showToast({
          type: "error",
          title: "Lỗi",
          message: "Định dạng tệp không được hỗ trợ",
        });
      }
    }
  };

  return (
    <div
      className={`rounded-xl shadow-sm p-12 text-center outline-none ${isDark ? "bg-gray-800" : ""}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      tabIndex={0}
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        <div className="w-full">
          <div className="flex flex-col items-center justify-center">
            <div
              className={`w-96 h-64 rounded-3xl flex items-center justify-center mb-4 border border-dashed overflow-hidden ${uploadedFile ? "opacity-100" : "opacity-70"}`}
            >
              {uploadedFile ? (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <i className="pi pi-file text-6xl text-[#1a73e8] mb-4" />
                  <p className="font-medium text-lg truncate w-full px-4">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm opacity-60">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <i className="pi pi-file text-[12rem] cursor-pointer" />
              )}
            </div>
            <p className="text-xl font-medium">Kéo thả vào đây</p>
          </div>
        </div>

        <div className="h-40 border-l hidden md:block opacity-20" />
        <div className="w-full">
          <div className="flex flex-col gap-4 w-full justify-center items-center max-w-xs mx-auto">
            <p className="font-medium opacity-80">Hoặc chọn một tệp</p>
            <div className="flex flex-col gap-2 w-full">
              <FileUpload
                mode="basic"
                name="file"
                auto
                url="/api/translation/upload"
                accept=".pdf,.docx,.xlsx"
                maxFileSize={1000000}
                chooseLabel="Duyệt qua các tệp"
                className="w-full"
                pt={{ chooseButton: { className: "w-full justify-center" } }}
                onSelect={(e) => {
                  if (e.files && e.files.length > 0) {
                    handleFileUploadEvent(e.files[0]);
                  }
                }}
              />
            </div>
            <p className="text-[10px] opacity-50 mt-2">
              Hỗ trợ: .pdf, .docx, .xlsx
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
