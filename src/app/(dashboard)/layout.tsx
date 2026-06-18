// src/app/(dashboard)/layout.tsx
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 h-full overflow-hidden relative">
        <div className="flex-none relative">
          <Header />
        </div>

        {/* Phần main ở giữa được phép cuộn */}
        <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden scroll-smooth">
          <div className="mx-auto max-w-7xl pb-8">{children}</div>
        </main>

        <div className="flex-none">
          <Footer />
        </div>
      </div>
    </div>
  );
}
