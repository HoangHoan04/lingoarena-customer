import { useToast } from "@/context/ToastContext";
import type { ContactDto } from "@/dto";
import { useSendContact } from "@/hooks/contact";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useState } from "react";

interface ContactFormProps {
  title?: string;
  showCard?: boolean;
}

export default function ContactForm({
  title = "Liên hệ cho chúng tôi",
  showCard = true,
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactDto>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [agreed, setAgreed] = useState(false);

  const { showToast } = useToast();
  const { mutate: sendContact, isPending } = useSendContact();

  const subjects = [
    { label: "Câu hỏi chung", value: "general" },
    { label: "Đặt tour", value: "booking" },
    { label: "Hỗ trợ", value: "support" },
    { label: "Phản hồi", value: "feedback" },
  ];

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      showToast({
        type: "warn",
        title: "Cảnh báo",
        message: "Vui lòng điền đầy đủ thông tin bắt buộc!",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: "Email không hợp lệ!",
      });
      return;
    }

    if (!agreed) {
      showToast({
        type: "warn",
        title: "Cảnh báo",
        message: "Vui lòng xác nhận bạn không phải là robot!",
      });
      return;
    }

    sendContact(formData, {
      onSuccess: (data) => {
        showToast({
          type: "success",
          title: "Thành công",
          message:
            data.message ||
            "Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.",
        });
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setAgreed(false);
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message ||
          "Đã có lỗi xảy ra. Vui lòng thử lại sau.";
        showToast({
          type: "error",
          title: "Lỗi",
          message: errorMessage,
        });
      },
    });
  };

  const formContent = (
    <>
      <h2 className="text-3xl font-bold mb-6">
        <span className="">{title}</span>
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ và Tên <span className="text-red-500">*</span>
          </label>
          <InputText
            placeholder="Nhập họ và tên của bạn"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full"
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <InputText
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full"
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chủ đề
          </label>
          <Dropdown
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.value })}
            options={subjects}
            placeholder="Chọn chủ đề"
            className="w-full"
            disabled={isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung <span className="text-red-500">*</span>
          </label>
          <InputTextarea
            placeholder="Nhập nội dung tin nhắn của bạn..."
            value={formData.message}
            onChange={(e) =>
              setFormData({
                ...formData,
                message: e.target.value,
              })
            }
            rows={6}
            className="w-full"
            disabled={isPending}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            inputId="agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.checked || false)}
            disabled={isPending}
          />
          <label htmlFor="agree" className="text-sm text-gray-600">
            Tôi xác nhận không phải là robot
          </label>
        </div>

        <Button
          label={isPending ? "Đang gửi..." : "Gửi Tin Nhắn"}
          icon={isPending ? "pi pi-spin pi-spinner" : "pi pi-send"}
          onClick={handleSubmit}
          className="w-full"
          raised
          disabled={isPending}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            fontSize: "1.1rem",
            padding: "0.75rem",
          }}
        />
      </div>
    </>
  );

  if (showCard) {
    return <Card className="shadow-xl">{formContent}</Card>;
  }

  return <div>{formContent}</div>;
}
