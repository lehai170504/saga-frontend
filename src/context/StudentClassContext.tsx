"use client";

import React, { createContext, useContext } from "react";
import { useParams } from "next/navigation";

interface StudentClassContextType {
  classId: string;
}

const StudentClassContext = createContext<StudentClassContextType | undefined>(undefined);

export function StudentClassProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const classId = (params?.classId as string) || "";

  return (
    <StudentClassContext.Provider value={{ classId }}>
      {children}
    </StudentClassContext.Provider>
  );
}

export function useStudentClass() {
  const context = useContext(StudentClassContext);
  if (context === undefined) {
    throw new Error("useStudentClass must be used within a StudentClassProvider");
  }
  return context;
}
