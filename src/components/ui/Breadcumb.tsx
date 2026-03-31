import { useTheme } from "@/context";
import { useRouter } from "@/routes/hooks";
import { PUBLIC_ROUTES } from "@/routes/routes";

interface BreadcrumbProps {
  items: {
    label: string;
    icon?: string;
    link?: string;
    active?: boolean;
  }[];
}

export default function BreadcrumbCustom({ items }: BreadcrumbProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3 flex-wrap">
        <li className="inline-flex items-center">
          <button
            onClick={() => router.push(PUBLIC_ROUTES.HOME)}
            className={`inline-flex items-center text-sm font-medium transition-colors duration-200 ${
              isDark
                ? "text-slate-400 hover:text-blue-400"
                : "text-slate-500 hover:text-blue-600"
            }`}
          >
            <i className="pi pi-home mr-2 text-xs"></i>
            <span>Trang chủ</span>
          </button>
        </li>

        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center justify-center">
              <i
                className={`pi pi-angle-right mx-2 text-xs ${isDark ? "text-slate-600" : "text-slate-300"}`}
              ></i>

              {item.active ? (
                <span
                  className={`ml-1 text-sm flex items-center font-bold md:ml-2 truncate max-w-[150px] md:max-w-none ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {item.icon && (
                    <i className={`pi ${item.icon} mr-2 text-xs`}></i>
                  )}
                  <span className="text-xs">{item.label}</span>
                </span>
              ) : (
                <button
                  onClick={() => item.link && router.push(item.link)}
                  className={`ml-1 text-sm  flex items-center font-medium md:ml-2 transition-colors duration-200 ${
                    isDark
                      ? "text-slate-400 hover:text-blue-400"
                      : "text-slate-500 hover:text-blue-600"
                  }`}
                >
                  {item.icon && (
                    <i className={`pi ${item.icon} mr-2 text-xs`}></i>
                  )}
                  <span className="text-xs">{item.label}</span>
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
