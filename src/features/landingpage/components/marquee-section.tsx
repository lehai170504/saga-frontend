"use client";

import React from "react";
import { GitBranch, Layout, Zap, Users, LineChart } from "lucide-react";

export function MarqueeSection() {
  return (
    <section className="border-y border-border bg-card/50 backdrop-blur-xl py-10 overflow-hidden flex flex-col items-center justify-center">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">Tích hợp hoàn hảo với các nền tảng hàng đầu</p>
      <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
          {[1, 2].map((set) => (
            <React.Fragment key={set}>
              <li className="flex items-center gap-2 text-2xl font-black text-foreground/20 hover:text-foreground/80 transition-colors cursor-default"><GitBranch className="w-8 h-8" /> GITHUB</li>
              <li className="flex items-center gap-2 text-2xl font-black text-foreground/20 hover:text-foreground/80 transition-colors cursor-default"><Layout className="w-8 h-8" /> JIRA</li>
              <li className="flex items-center gap-2 text-2xl font-black text-foreground/20 hover:text-foreground/80 transition-colors cursor-default"><Zap className="w-8 h-8" /> FPT ACADEMIC</li>
              <li className="flex items-center gap-2 text-2xl font-black text-foreground/20 hover:text-foreground/80 transition-colors cursor-default"><Users className="w-8 h-8" /> COURSERA</li>
              <li className="flex items-center gap-2 text-2xl font-black text-foreground/20 hover:text-foreground/80 transition-colors cursor-default"><LineChart className="w-8 h-8" /> GOOGLE SHEETS</li>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </section>
  );
}
