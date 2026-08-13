import React from "react";
import { Badge } from "@/components/ui/badge";
import { Bug, CheckSquare, Sparkles, PlusSquare, Bookmark, ChevronsUp, ChevronUp, Equal, ChevronDown, ChevronsDown } from "lucide-react";

export const PRIORITIES = [
  { id: "HIGHEST", label: "Highest", icon: <ChevronsUp size={14} className="text-red-500 shrink-0" /> },
  { id: "HIGH", label: "High", icon: <ChevronUp size={14} className="text-red-400 shrink-0" /> },
  { id: "MEDIUM", label: "Medium", icon: <Equal size={14} className="text-amber-500 shrink-0" /> },
  { id: "LOW", label: "Low", icon: <ChevronDown size={14} className="text-blue-400 shrink-0" /> },
  { id: "LOWEST", label: "Lowest", icon: <ChevronsDown size={14} className="text-blue-500 shrink-0" /> },
];

export const getAssigneeInitials = (name?: string) => {
  if (!name) return "??";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "??";
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  const firstLetter = words[0].charAt(0);
  const lastLetter = words[words.length - 1].charAt(0);
  return (firstLetter + lastLetter).toUpperCase();
};

export const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDueDate = (dateStr?: string) => {
  if (!dateStr) return "Không có hạn";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  } catch {
    return dateStr;
  }
};

export const getTypeIcon = (type?: string) => {
  switch (type?.toUpperCase()) {
    case "BUG":
      return <Bug size={14} className="text-red-500 shrink-0" />;
    case "FEATURE":
      return <Sparkles size={14} className="text-emerald-500 shrink-0" />;
    case "REQUEST":
      return <PlusSquare size={14} className="text-blue-500 shrink-0" />;
    case "STORY":
      return <Bookmark size={14} className="text-emerald-600 shrink-0" />;
    case "TASK":
    default:
      return <CheckSquare size={14} className="text-blue-600 shrink-0" />;
  }
};

export const getTypeBadge = (type?: string) => {
  switch (type?.toUpperCase()) {
    case "BUG":
      return (
        <Badge variant="secondary" className="rounded-xl font-extrabold text-[10px] px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20">
          Bug
        </Badge>
      );
    case "FEATURE":
      return (
        <Badge variant="secondary" className="rounded-xl font-extrabold text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          Feature
        </Badge>
      );
    case "REQUEST":
      return (
        <Badge variant="secondary" className="rounded-xl font-extrabold text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/20">
          Request
        </Badge>
      );
    case "STORY":
      return (
        <Badge variant="secondary" className="rounded-xl font-extrabold text-[10px] px-2 py-0.5 bg-emerald-600/10 text-emerald-600 border border-emerald-600/20">
          Story
        </Badge>
      );
    case "TASK":
    default:
      return (
        <Badge variant="secondary" className="rounded-xl font-extrabold text-[10px] px-2 py-0.5 bg-blue-600/10 text-blue-600 border border-blue-600/20">
          Task
        </Badge>
      );
  }
};
