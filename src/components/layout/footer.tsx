import Image from "next/image";

export default function Footer() {
  return (
    <footer className="h-16 border-t bg-white flex items-center justify-center gap-4 px-6">
      <Image
        src="/logo-footer.png"
        alt="SAGA Logo"
        width={100}
        height={32}
        className="w-auto h-auto"
      />
      <p className="text-sm text-slate-500">
        &copy; {new Date().getFullYear()} SAGA Dashboard. All rights reserved.
      </p>
    </footer>
  );
}
