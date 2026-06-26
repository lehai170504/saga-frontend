"use client";

import React, { createContext, useContext, useState } from "react";

interface FilterState {
  selectedGroup: string;
  selectedSprint: string;
  timeRange: string;
  setSelectedGroup: (val: string) => void;
  setSelectedSprint: (val: string) => void;
  setTimeRange: (val: string) => void;
}

const FilterContext = createContext<FilterState | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [selectedGroup, setSelectedGroup] = useState("pbl-07");
  const [selectedSprint, setSelectedSprint] = useState("sprint-4");
  const [timeRange, setTimeRange] = useState("14days");

  return (
    <FilterContext.Provider
      value={{
        selectedGroup,
        selectedSprint,
        timeRange,
        setSelectedGroup,
        setSelectedSprint,
        setTimeRange,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilter phải dùng bên trong FilterProvider");
  return ctx;
}
