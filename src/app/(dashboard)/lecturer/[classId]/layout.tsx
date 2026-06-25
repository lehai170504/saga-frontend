"use client";

import React from "react";
import { LecturerClassProvider } from "@/context/LecturerClassContext";

export default function ClassLayout({ children }: { children: React.ReactNode }) {
  return <LecturerClassProvider>{children}</LecturerClassProvider>;
}
