import React from "react";
import { Menu, X } from "lucide-react";

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="lg:hidden pl-4 text-slate-600 hover:text-slate-900 focus:outline-none shrink-0"
      onClick={onClick}
    >
      <Menu className="w-6 h-6" />
    </button>
  );
}

export function MobileCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="text-slate-500 hover:text-slate-900 focus:outline-none"
      onClick={onClick}
    >
      <X className="w-6 h-6" />
    </button>
  );
}
