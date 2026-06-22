import React from "react";

interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileOverlay({ isOpen, onClose }: MobileOverlayProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
      onClick={onClose}
    />
  );
}
