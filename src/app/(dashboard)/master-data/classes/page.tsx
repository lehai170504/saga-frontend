import { ClassCards } from "@/features/classes/components/class-cards";
import { ClientGuard } from "@/features/auth/components/client-guard";

export default function ClassesPage() {
  return (
    <ClientGuard allowedRoles={["ADMIN", "LECTURER", "STUDENT"]}>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ClassCards />
      </div>
    </ClientGuard>
  );
}
