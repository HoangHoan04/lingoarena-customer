export const Field = ({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <small className="text-red-500 font-bold ml-1 animate-fade-in">
        {error}
      </small>
    )}
  </div>
);
