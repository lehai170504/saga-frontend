"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function StudentSprintsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = (params?.courseId as string) || "";

  useEffect(() => {
    if (courseId) {
      router.replace(`/student/${courseId}/projects?tab=peer-review`);
    }
  }, [courseId, router]);

  return <div className="p-6 min-h-screen bg-background" />;
}

