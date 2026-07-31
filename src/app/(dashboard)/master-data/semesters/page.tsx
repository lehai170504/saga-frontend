import { SemesterList } from "@/features/semesters/components/semester-list";
import { ClientGuard } from "@/features/auth/components/client-guard";

export default function SemestersPage() {
  return (
    <ClientGuard allowedRoles={["ADMIN", "LECTURER", "STUDENT"]}>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SemesterList />
      </div>
    </ClientGuard>
  );
}
