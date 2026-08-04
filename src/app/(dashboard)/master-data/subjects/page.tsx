import { SubjectCards } from "@/features/subjects/components/subject-cards";
import { ClientGuard } from "@/features/auth/components/client-guard";

export default function SubjectsPage() {
  return (
    <ClientGuard allowedRoles={["ADMIN", "LECTURER", "STUDENT"]}>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubjectCards />
      </div>
    </ClientGuard>
  );
}
