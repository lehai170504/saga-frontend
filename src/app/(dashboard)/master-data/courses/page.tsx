import { CourseCards } from "@/features/courses/components/course-cards";
import { ClientGuard } from "@/features/auth/components/client-guard";

export default function CoursesPage() {
  return (
    <ClientGuard allowedRoles={["ADMIN", "LECTURER", "STUDENT"]}>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CourseCards />
      </div>
    </ClientGuard>
  );
}
