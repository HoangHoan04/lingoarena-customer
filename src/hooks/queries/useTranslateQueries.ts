import { translateService } from "@/services/translate.service";
import type { TranslateRequest } from "@/types/translate";
import { useMutation } from "@tanstack/react-query";

export function useTranslateMutation() {
  return useMutation({
    mutationFn: (payload: TranslateRequest) => translateService.translate(payload),
  });
}
