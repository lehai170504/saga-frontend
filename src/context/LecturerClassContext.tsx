"use client";

import React, { createContext, useContext } from "react";
import { useParams } from "next/navigation";

interface LecturerClassContextType {
  classId: string;
}

const LecturerClassContext = createContext<LecturerClassContextType | undefined>(undefined);

export function LecturerClassProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const classId = (params?.classId as string) || "";

  return (
    <LecturerClassContext.Provider value={{ classId }}>
      {children}
    </LecturerClassContext.Provider>
  );
}

export function useLecturerClass() {
  const context = useContext(LecturerClassContext);
  if (context === undefined) {
    throw new Error("useLecturerClass must be used within a LecturerClassProvider");
  }
  return context;
}
