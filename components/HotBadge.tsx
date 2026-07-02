// components/HotBadge.tsx
// Compact flame-icon badge marking V1 selected products as "火热".

import type { CSSProperties } from "react";

interface HotBadgeProps {
  size?: "sm" | "md";
  className?: string;
  style?: CSSProperties;
  /** Tooltip / aria-label, defaults to "火热" */
  label?: string;
}

const SIZES = {
  sm: { box: "h-5 w-5", flame: "h-3.5 w-3.5" },
  md: { box: "h-7 w-7", flame: "h-5 w-5" },
} as const;

export default function HotBadge({ size = "md", className = "", style, label = "火热" }: HotBadgeProps) {
  const s = SIZES[size];
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-red-100 text-red-600 ${s.box} ${className}`}
      style={style}
      title={label}
      aria-label={label}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={s.flame}
        aria-hidden="true"
      >
        <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5 0.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
      </svg>
    </span>
  );
}