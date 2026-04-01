import { toastEmitter } from "@/layout/lib/toast-event-emitter";
import { Toast } from "primereact/toast";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

export type ToastContextType = {
  showToast: (options: {
    type?: "success" | "info" | "warn" | "error";
    title?: string;
    message?: string;
    timeout?: number;
  }) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const toastRef = useRef<Toast>(null);

  const showToast = useCallback(
    ({
      type = "info",
      title,
      message,
      timeout = 3000,
    }: {
      type?: "success" | "info" | "warn" | "error";
      title?: string;
      message?: string;
      timeout?: number;
    }) => {
      toastRef.current?.show({
        severity: type,
        summary: title,
        detail: message,
        life: timeout,
      });
    },
    [],
  );

  useEffect(() => {
    toastEmitter.register(showToast);
  }, [showToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast ref={toastRef} position="top-right" />
    </ToastContext.Provider>
  );
};
