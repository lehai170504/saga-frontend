import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SAGA Dashboard - Continuous Assessment",
  description: "Student Activity Graph-Based Continuous Assessment System",
};

export default function RootLayout({ 
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}
      >
        <div className="flex min-h-screen">
          {/* Sidebar cố định bên trái */}
          <Sidebar />

          <div className="flex flex-col flex-1 w-full">
            {/* Header chứa thông tin user/context */}
            <Header />

            {/* Main content area */}
            <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto">
              <div className="mx-auto max-w-7xl">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
