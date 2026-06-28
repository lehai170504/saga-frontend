"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] md:max-w-5xl bg-card border-border p-0 overflow-hidden gap-0">
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Left: Info */}
          <div className="md:col-span-2 bg-muted/30 p-8 pr-14 md:pr-8 border-b md:border-b-0 md:border-r border-border flex flex-col justify-center">
            <DialogHeader className="mb-8 p-0 text-left">
              <DialogTitle className="text-2xl font-black mb-2">Liên hệ Hỗ trợ</DialogTitle>
              <DialogDescription>
                Bạn gặp sự cố khi đồng bộ dữ liệu học tập? Hãy để lại lời nhắn cho chúng tôi.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 text-muted-foreground font-medium">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs">Email Hỗ trợ</p>
                  <p className="text-foreground text-sm">support.saga@fpt.edu.vn</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs">Hotline (Giờ hành chính)</p>
                  <p className="text-foreground text-sm">024 7300 1866</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs">Văn phòng</p>
                  <p className="text-foreground text-sm">Phòng Khảo thí, ĐH FPT</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="md:col-span-3 p-8 flex flex-col justify-center">
            {!isSent ? (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wide">Họ và tên</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wide">Email FPT</label>
                    <input 
                      type="email" 
                      required
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                      placeholder="anvse@fpt.edu.vn"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground uppercase tracking-wide">Nội dung</label>
                  <textarea 
                    required
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all min-h-[120px]"
                    placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-foreground text-background font-bold rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors"
                >
                  Gửi yêu cầu
                  <Send className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-10 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Đã gửi thành công!</h3>
                <p className="text-muted-foreground text-sm">Chúng tôi sẽ phản hồi bạn qua email trong thời gian sớm nhất.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
