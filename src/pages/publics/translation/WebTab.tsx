import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Button } from "primereact/button";

interface WebTabProps {
  isDark: boolean;
  url: string;
  setUrl: (url: string) => void;
}

export function WebTab({ isDark, url, setUrl }: WebTabProps) {
  return (
    <div
      className={`rounded-xl shadow-sm border p-20 flex items-center justify-center ${isDark ? "border-gray-700 bg-gray-800" : ""}`}
    >
      <div className="w-full max-w-2xl relative flex items-center">
        <IconField iconPosition="left" className="w-full mr-2">
          <InputIcon className="pi pi-link" />
          <InputText
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`w-full p-4 pl-12 pr-16 ${isDark ? "bg-gray-700 text-white border-gray-600" : ""}`}
            placeholder="Nhập URL trang web..."
          />
        </IconField>
        <Button
          icon="pi pi-arrow-right"
          className="absolute right-12 h-12 w-14 ml-2 shadow-sm"
        />
      </div>
    </div>
  );
}
