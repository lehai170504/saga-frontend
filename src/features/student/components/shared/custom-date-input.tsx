"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface CustomDateInputProps {
  value: string; // yyyy-mm-dd (internal format)
  onChange: (val: string) => void; // returns yyyy-mm-dd
  min?: string; // yyyy-mm-dd
  className?: string;
  id?: string;
}

/**
 * A custom date input that displays dd-mm-yyyy to users
 * while keeping the internal value as yyyy-mm-dd for API compatibility.
 */
export function CustomDateInput({ value, onChange, min, className, id }: CustomDateInputProps) {
  // Convert yyyy-mm-dd -> dd-mm-yyyy for display
  const toDisplay = (iso: string) => {
    if (!iso || iso.length < 10) return iso;
    const [y, m, d] = iso.split("-");
    return `${d}-${m}-${y}`;
  };

  // Convert dd-mm-yyyy -> yyyy-mm-dd for internal state
  const toISO = (display: string) => {
    if (!display) return "";
    const parts = display.split("-");
    if (parts.length === 3) {
      const [d, m, y] = parts;
      if (y && y.length === 4) return `${y}-${m}-${d}`;
    }
    return display;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    onChange(toISO(raw));
  };

  // Determine the min display value for native min constraint fallback
  const minDisplay = min ? toDisplay(min) : undefined;

  return (
    <div className="relative">
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        placeholder="dd-mm-yyyy"
        value={value ? toDisplay(value) : ""}
        onChange={handleChange}
        pattern="\d{2}-\d{2}-\d{4}"
        maxLength={10}
        className={className}
        onKeyDown={(e) => {
          // Allow: backspace, delete, tab, arrows, digits and hyphen
          const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
          if (allowed.includes(e.key)) return;
          // Auto-insert hyphen
          const curVal = (e.target as HTMLInputElement).value;
          if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
            return;
          }
          if (curVal.length === 2 || curVal.length === 5) {
            (e.target as HTMLInputElement).value = curVal + "-";
          }
        }}
        onBlur={(e) => {
          // Validate on blur: if not valid dd-mm-yyyy, clear
          const val = e.target.value;
          const match = val.match(/^(\d{2})-(\d{2})-(\d{4})$/);
          if (!match) {
            onChange("");
            return;
          }
          const [, d, m, y] = match;
          const date = new Date(`${y}-${m}-${d}`);
          if (isNaN(date.getTime())) {
            onChange("");
            return;
          }
          // Enforce min date
          if (min) {
            const minDate = new Date(min);
            if (date < minDate) {
              onChange(min);
            }
          }
          onChange(`${y}-${m}-${d}`);
        }}
        title={minDisplay ? `Từ ngày ${minDisplay}` : undefined}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground text-xs leading-none"
          tabIndex={-1}
          title="Xóa ngày"
        >
          ✕
        </button>
      )}
    </div>
  );
}
