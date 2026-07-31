"use client";

import React from "react";
import { StudentClassProvider } from "@/context/StudentClassContext";

export default function StudentClassLayout({ children }: { children: React.ReactNode }) {
  return <StudentClassProvider>{children}</StudentClassProvider>;
}
