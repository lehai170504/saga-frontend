import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SAGA Dashboard - Continuous Assessment",
  description: "Student Activity Graph-Based Continuous Assessment System",
  icons: {
    icon: "/logo-ico.png",
  },
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
        {children}
        <Toaster
          position="top-right"
          richColors
          expand={false}
          toastOptions={{
            style: {
              borderRadius: "12px",
              padding: "16px",
            },
          }}
        />
      </body>
    </html>
  );
}
