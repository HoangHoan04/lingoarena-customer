import GlobalLoading from "@/components/layout/Loading";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const LoadingContext = createContext({
  showLoading: () => {},
  hideLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = useCallback(() => setIsLoading(true), []);
  const hideLoading = useCallback(() => setIsLoading(false), []);

  const value = useMemo(
    () => ({ showLoading, hideLoading }),
    [showLoading, hideLoading],
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && <GlobalLoading />}
    </LoadingContext.Provider>
  );
}
