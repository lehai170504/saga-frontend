import { redirect } from "next/navigation";

export default async function OverviewDashboardPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  redirect(`/student/${courseId}/projects`);
}
