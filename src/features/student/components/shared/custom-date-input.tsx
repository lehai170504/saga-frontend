"use client";

import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, X } from "lucide-react";

interface CustomDateInputProps {
  value: string; // yyyy-mm-dd (internal format)
  onChange: (val: string) => void; // returns yyyy-mm-dd
  min?: string; // yyyy-mm-dd
  className?: string;
  id?: string;
}

/**
 * A custom date input that displays dd-mm-yyyy to users
 * and supports clicking a Calendar icon to open the native DatePicker popup.
 */
export function CustomDateInput({ value, onChange, min, className, id }: CustomDateInputProps) {
  const hiddenDateRef = useRef<HTMLInputElement>(null);

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

  const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const openCalendarPicker = () => {
    if (hiddenDateRef.current) {
      if (typeof hiddenDateRef.current.showPicker === "function") {
        try {
          hiddenDateRef.current.showPicker();
        } catch {
          hiddenDateRef.current.click();
        }
      } else {
        hiddenDateRef.current.click();
      }
    }
  };

  return (
    <div className="relative flex items-center w-full">
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        placeholder="dd-mm-yyyy"
        value={value ? toDisplay(value) : ""}
        onChange={handleChange}
        pattern="\d{2}-\d{2}-\d{4}"
        maxLength={10}
        className={`pr-14 ${className || ""}`}
        onKeyDown={(e) => {
          const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
          if (allowed.includes(e.key)) return;
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
          const val = e.target.value;
          if (!val) {
            onChange("");
            return;
          }
          const match = val.match(/^(\d{2})-(\d{2})-(\d{4})$/);
          if (!match) {
            return;
          }
          const [, d, m, y] = match;
          const date = new Date(`${y}-${m}-${d}`);
          if (isNaN(date.getTime())) {
            onChange("");
            return;
          }
          if (min) {
            const minDate = new Date(min);
            if (date < minDate) {
              onChange(min);
              return;
            }
          }
          onChange(`${y}-${m}-${d}`);
        }}
      />

      {/* Hidden native date input for calendar popup */}
      <input
        ref={hiddenDateRef}
        type="date"
        min={min}
        value={value || ""}
        onChange={handleNativeDateChange}
        className="sr-only pointer-events-none absolute opacity-0 w-0 h-0"
        tabIndex={-1}
      />

      {/* Right control buttons: Clear button & Calendar Icon button */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            tabIndex={-1}
            title="Xóa ngày"
          >
            <X size={12} />
          </button>
        )}
        <button
          type="button"
          onClick={openCalendarPicker}
          className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors cursor-pointer shrink-0"
          tabIndex={-1}
          title="Chọn ngày từ Lịch"
        >
          <CalendarIcon size={15} />
        </button>
      </div>
    </div>
  );
}
