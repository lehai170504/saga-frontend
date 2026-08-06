import { SemesterCards } from "@/features/semesters/components/semester-cards";
import { ClientGuard } from "@/features/auth/components/client-guard";

export default function SemestersPage() {
  return (
    <ClientGuard allowedRoles={["ADMIN", "LECTURER", "STUDENT"]}>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SemesterCards />
      </div>
    </ClientGuard>
  );
}
