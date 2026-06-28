import { Skeleton } from "@/components/shared/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      <div className="relative p-6 max-w-[1400px] mx-auto space-y-12">
        <div className="flex flex-col gap-4 relative z-10 pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border w-fit">
            <Skeleton className="w-4 h-4 rounded-full bg-muted-foreground/30" />
            <Skeleton className="w-32 h-4 rounded-full bg-muted-foreground/20" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-12 w-3/4 max-w-md rounded-2xl" />
            <Skeleton className="h-12 w-1/2 max-w-sm rounded-2xl hidden md:block" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="relative rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl p-6 overflow-hidden h-[340px] flex flex-col">
              <Skeleton className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent rounded-none" />
              <div className="relative flex justify-between items-start mb-6">
                <Skeleton className="h-8 w-24 rounded-xl" />
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
              <Skeleton className="h-8 w-3/4 rounded-xl mb-4 relative" />
              <Skeleton className="h-5 w-1/2 rounded-xl mb-auto relative" />

              <div className="space-y-4 mt-8 relative">
                <div className="flex justify-between">
                  <Skeleton className="h-16 w-[48%] rounded-2xl" />
                  <Skeleton className="h-16 w-[48%] rounded-2xl" />
                </div>
                <Skeleton className="h-12 w-full rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
