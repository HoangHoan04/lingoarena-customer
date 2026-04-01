import type { ToastContextType } from "@/context";

type ShowToastParams = Parameters<ToastContextType["showToast"]>[0];

let _showToast: ToastContextType["showToast"] | null = null;

export const toastEmitter = {
  register: (fn: ToastContextType["showToast"]) => {
    _showToast = fn;
  },
  emit: (params: ShowToastParams) => {
    if (_showToast) {
      _showToast(params);
    }
  },
};