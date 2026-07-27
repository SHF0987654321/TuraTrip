import React from "react";

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[hsl(210_20%_30%)] dark:text-[hsl(174_20%_70%)] uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span aria-hidden="true">⚠️</span> {error}
        </p>
      )}
    </div>
  );
}

export function inputClass(hasError?: boolean) {
  return [
    "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all",
    "bg-white dark:bg-[hsl(210_20%_12%)]",
    "text-[hsl(210_20%_12%)] dark:text-[hsl(174_20%_94%)]",
    "placeholder:text-[hsl(210_10%_70%)] dark:placeholder:text-[hsl(210_10%_40%)]",
    hasError
      ? "border border-red-400 focus:ring-2 focus:ring-red-300"
      : "border border-[hsl(174_20%_88%)] dark:border-[hsl(210_15%_20%)] focus:ring-2 focus:ring-[hsl(174_72%_40%)/30%] focus:border-[hsl(174_72%_40%)]",
  ].join(" ");
}
