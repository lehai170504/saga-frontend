"use client";

import React from "react";
import { motion } from "framer-motion";
import { GitBranch, Layout, PenTool, Database, Terminal } from "lucide-react";
import { fadeUp } from "./animations";

export function MarqueeSection() {
  return (
    <section className="border-y border-border bg-card/50 backdrop-blur-xl py-10 overflow-hidden flex flex-col items-center justify-center">
      <motion.p
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6"
      >
        Lấy dữ liệu tự động, không nhập liệu thủ công
      </motion.p>
      <motion.div
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
      >
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
          {[1, 2, 3].map((set) => (
            <React.Fragment key={set}>
              <li className="flex items-center gap-2 text-2xl font-black text-foreground/20 hover:text-foreground/80 transition-colors cursor-default hover:drop-shadow-[0_0_10px_currentColor]"><GitBranch className="w-8 h-8" /> GITHUB</li>
              <li className="flex items-center gap-2 text-2xl font-black text-foreground/20 hover:text-foreground/80 transition-colors cursor-default hover:drop-shadow-[0_0_10px_currentColor]"><Layout className="w-8 h-8" /> JIRA</li>
              <li className="flex items-center gap-2 text-2xl font-black text-foreground/20 hover:text-foreground/80 transition-colors cursor-default hover:drop-shadow-[0_0_10px_currentColor]"><PenTool className="w-8 h-8" /> FIGMA</li>
              <li className="flex items-center gap-2 text-2xl font-black text-foreground/20 hover:text-foreground/80 transition-colors cursor-default hover:drop-shadow-[0_0_10px_currentColor]"><Database className="w-8 h-8" /> DATA SYNC</li>
              <li className="flex items-center gap-2 text-2xl font-black text-foreground/20 hover:text-foreground/80 transition-colors cursor-default hover:drop-shadow-[0_0_10px_currentColor]"><Terminal className="w-8 h-8" /> AUTOMATION</li>
            </React.Fragment>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
