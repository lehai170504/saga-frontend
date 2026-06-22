import Image from "next/image";

export default function Footer() {
  return (
    <footer className="h-16 border-t border-border bg-background flex items-center justify-center gap-4 px-6 transition-colors">
      <Image
        src="/logo-footer.png"
        alt="SAGA Logo"
        width={100}
        height={32}
        // Tự động lật ngược màu logo thành trắng trong Dark Mode
        className="w-auto h-8 opacity-70 hover:opacity-100 dark:brightness-0 dark:invert transition-all"
      />
      <p className="text-sm text-muted-foreground font-medium">
        &copy; {new Date().getFullYear()} SAGA Dashboard. All rights reserved.
      </p>
    </footer>
  );
}
