import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SAGA Dashboard - Đánh giá Liên tục",
  description: "Hệ thống Đánh giá Liên tục dựa trên Mạng tương tác dành cho Sinh viên IT",
  icons: [
    { rel: "icon", url: "/saga-logo.png", type: "image/png" },
    { rel: "shortcut icon", url: "/saga-logo.png" },
    { rel: "apple-touch-icon", url: "/saga-logo.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${inter.variable} font-sans bg-background text-foreground antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col bg-background selection:bg-primary/20 selection:text-primary">
              {/* Premium Subtle Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10"></div>
              {children}
            </div>
            <Toaster
              position="top-right"
              richColors
              expand={false}
              toastOptions={{
                style: {
                  borderRadius: "16px",
                  padding: "16px",
                  border: "1px solid var(--border)",
                },
                className: "glass-panel",
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
