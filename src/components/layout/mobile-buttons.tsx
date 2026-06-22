import React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden ml-2 text-slate-600 hover:text-slate-900 shrink-0"
      onClick={onClick}
    >
      <Menu className="w-6 h-6" />
    </Button>
  );
}

export function MobileCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
      onClick={onClick}
    >
      <X className="w-6 h-6" />
    </Button>
  );
}
