"use client";

import React, { use } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useMyTeamMembers } from "@/features/courses/hooks/useCourseStudents";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { AiAgentPanel } from "@/features/projects/components/ai-agent-panel";
import { Skeleton } from "@/components/shared/Skeleton";
import { Users, ShieldAlert } from "lucide-react";

interface StudentAiAgentPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default function StudentAiAgentPage({ params }: StudentAiAgentPageProps) {
  const { courseId } = use(params);

  const { data: myTeamData, isLoading: isLoadingTeam } = useMyTeamMembers(courseId);
  const { data: courseData, isLoading: isLoadingCourse } = useCourse(courseId);

  const projectId = myTeamData?.project?.id || "";
  const isLoading = isLoadingTeam || isLoadingCourse;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative p-6 max-w-[1200px] mx-auto space-y-6">
        <PageHeader
          title="Trợ Lý AI SAGA"
          description={
            courseData
              ? `Hỏi đáp thông minh, phân tích tiến độ & đề xuất công việc cho Khóa học ${courseData.courseCode || ""}`
              : "Hỏi đáp thông minh, phân tích tiến độ & đề xuất công việc với Trợ lý AI"
          }
        />

        {isLoading ? (
          <Skeleton className="h-[600px] w-full rounded-3xl" />
        ) : !myTeamData ? (
          <div className="text-center p-12 glass-panel rounded-[2rem]">
            <Users size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground">Chưa có nhóm</h3>
            <p className="text-sm text-muted-foreground mt-2">Bạn chưa tham gia vào nhóm nào trong khóa học này.</p>
          </div>
        ) : !projectId ? (
          <div className="text-center p-12 glass-panel rounded-[2rem]">
            <ShieldAlert size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground">Chưa liên kết dự án</h3>
            <p className="text-sm text-muted-foreground mt-2">Nhóm của bạn chưa khởi tạo dự án nào để sử dụng Trợ lý AI.</p>
          </div>
        ) : (
          <AiAgentPanel projectId={projectId} />
        )}
      </div>
    </div>
  );
}
