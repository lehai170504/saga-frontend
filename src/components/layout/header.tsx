import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Image
            src="/logo-header.png"
            alt="SAGA Logo"
            width={240}
            height={72}
            priority
            className="w-48 h-auto"
          />
        </Link>

        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

        <h2 className="text-lg font-semibold text-slate-800 hidden sm:block">
          SE102 - PBL Project
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-slate-900">
            Giảng viên Hướng dẫn
          </p>
          <p className="text-xs text-slate-500">instructor@university.edu</p>
        </div>
        <Avatar>
          <AvatarImage src="" alt="Instructor" />
          <AvatarFallback className="bg-indigo-100 text-indigo-700">
            GV
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
