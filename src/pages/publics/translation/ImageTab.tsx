import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { useToast } from "@/context/ToastContext";

interface ImageTabProps {
  isDark: boolean;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
}

export function ImageTab({
  isDark,
  uploadedFile,
  setUploadedFile,
}: ImageTabProps) {
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
      const validImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      const isValid =
        validImageTypes.includes(file.type) ||
        !!file.name.match(/\.(jpg|jpeg|png|webp)$/i);
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
      onPaste={(e) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const file = items[i].getAsFile();
            if (file) handleFileUploadEvent(file);
          }
        }
      }}
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        <div className="w-full">
          <div className="flex flex-col items-center justify-center">
            <div
              className={`w-96 h-64 rounded-3xl flex items-center justify-center mb-4 border border-dashed overflow-hidden ${uploadedFile ? "opacity-100" : "opacity-70"}`}
            >
              {uploadedFile ? (
                <img
                  src={URL.createObjectURL(uploadedFile)}
                  alt="uploaded"
                  className="w-full h-full object-contain"
                />
              ) : (
                <i className="pi pi-image text-[12rem] cursor-pointer" />
              )}
            </div>
            <p className="text-xl font-medium">Kéo thả hoặc dán tệp (Ctrl+V)</p>
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
                accept=".jpg,.jpeg,.png,.webp"
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
              <Button
                label="Dán tệp từ bảng nhớ tạm"
                icon="pi pi-clipboard"
                outlined
                className="w-full justify-center"
                pt={{ root: { className: "w-full justify-center p-0 m-0" } }}
                onClick={async () => {
                  try {
                    const clipboardItems = await (
                      navigator.clipboard as any
                    ).read();
                    for (const clipboardItem of clipboardItems) {
                      const imageTypes = clipboardItem.types.filter(
                        (type: string) => type.startsWith("image/"),
                      );
                      if (imageTypes.length > 0) {
                        const blob = await clipboardItem.getType(imageTypes[0]);
                        const file = new File([blob], "pasted-image.png", {
                          type: blob.type,
                        });
                        handleFileUploadEvent(file);
                        return;
                      }
                    }
                    showToast({
                      type: "warn",
                      title: "Cảnh báo",
                      message: "Không tìm thấy ảnh trong bảng tạm",
                    });
                  } catch (err: any) {
                    showToast({
                      type: "error",
                      title: "Lỗi",
                      message: `Không thể đọc bảng tạm ${err.message}`,
                    });
                  }
                }}
              />
            </div>
            <p className="text-[10px] opacity-50 mt-2">
              Hỗ trợ: .jpg, .jpeg, .png, .webp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
