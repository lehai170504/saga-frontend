import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchX, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-6">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute top-[20%] left-[20%] w-[30rem] h-[30rem] bg-primary/20 rounded-full blur-[8rem] opacity-50 mix-blend-screen" />
      <div className="absolute bottom-[20%] right-[20%] w-[30rem] h-[30rem] bg-secondary/20 rounded-full blur-[8rem] opacity-50 mix-blend-screen" />

      <Card className="relative z-10 max-w-lg w-full border border-border/50 shadow-2xl rounded-[2rem] bg-card/60 backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <CardHeader className="text-center space-y-6 pt-12 pb-4">
          <div className="mx-auto w-28 h-28 bg-primary/10 rounded-3xl flex items-center justify-center text-primary shadow-inner border border-primary/20 backdrop-blur-md transition-transform duration-500 hover:scale-110">
            <SearchX size={56} className="opacity-80" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-5xl font-black tracking-tight text-primary drop-shadow-sm">
              404
            </CardTitle>
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              Không tìm thấy trang
            </h2>
          </div>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground pt-2 pb-10 text-base leading-relaxed px-10 font-medium">
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không thể truy cập. Vui lòng kiểm tra lại đường dẫn.
        </CardContent>
        <CardFooter className="pb-12 px-10">
          <Button
            asChild
            className="w-full rounded-xl h-14 text-lg font-bold transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <Link href="/">
              <Home className="mr-2" size={24} />
              Quay lại trang chủ
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
