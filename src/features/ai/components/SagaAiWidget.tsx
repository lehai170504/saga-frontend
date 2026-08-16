"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import { Bot, X, Send, Plus, Loader2, Check, Download, Sparkles, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAiConversations,
  useAiConversationDetail,
  useCreateAiConversation,
  useSendAiMessage,
  useConfirmAiAction,
  useRejectAiAction
} from "../hooks/useAi";
import { aiApi } from "../api/aiApi";
import { AiMessage } from "../types";

export function SagaAiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");

  const { data: conversations, isLoading: isLoadingConversations } = useAiConversations();
  const { data: detailData, isLoading: isLoadingDetail } = useAiConversationDetail(activeConversationId);
  const createMutation = useCreateAiConversation();
  const sendMutation = useSendAiMessage(activeConversationId || "");
  const confirmMutation = useConfirmAiAction(activeConversationId || "");
  const rejectMutation = useRejectAiAction(activeConversationId || "");

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [detailData?.messages, sendMutation.isPending]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    if (!activeConversationId) {
      // Create new conversation first
      createMutation.mutate(inputText.slice(0, 30) + "...", {
        onSuccess: (newConv) => {
          setActiveConversationId(newConv.id);
          // Note: React Query mutation success might need to trigger the actual send
          // But since activeConversationId just changed, we have to wait.
          // Better: If no active conversation, just create one and then send.
          // For simplicity, let's just make them select or create explicitly.
        }
      });
      return;
    }

    sendMutation.mutate(inputText);
    setInputText("");
  };

  const handleCreateNew = () => {
    createMutation.mutate("Trò chuyện mới", {
      onSuccess: (newConv) => {
        setActiveConversationId(newConv.id);
      }
    });
  };

  const renderMessageContent = (msg: AiMessage) => {
    const textStr = msg.content || msg.text || "";
    const artifactId = typeof msg.generatedArtifact === "string" ? msg.generatedArtifact : msg.artifactId;

    return (
      <div className="space-y-2">
        {/* Main Text Content */}
        {textStr && (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{textStr}</p>
        )}

        {/* Citations Metadata Badge */}
        {msg.citations && msg.citations.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit mt-1.5 border border-emerald-500/20">
            <Check size={12} className="text-emerald-500" />
            <span>Đã lấy dữ liệu thực tế từ SAGA System</span>
          </div>
        )}

        {/* Async Job Reference Rendering */}
        {msg.jobReference && (
          <div className="mt-2.5 p-3 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-primary animate-pulse" />
              <span>Tiến trình xử lý: <strong>{msg.jobReference.status}</strong></span>
            </div>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase",
              msg.jobReference.status === "COMPLETED" ? "bg-emerald-500/20 text-emerald-600" :
              msg.jobReference.status === "FAILED" ? "bg-destructive/20 text-destructive" :
              "bg-amber-500/20 text-amber-600 animate-pulse"
            )}>
              {msg.jobReference.status}
            </span>
          </div>
        )}

        {/* Pending Action Proposal Card */}
        {msg.pendingAction && (msg.pendingAction.status === 'PENDING' || !msg.pendingAction.status) && (
          <div className="mt-3 p-4 bg-card rounded-2xl border border-primary/30 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Sparkles size={14} />
                Đề xuất tạo/cập nhật Task
              </p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 uppercase">
                Chờ xác nhận
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <p className="font-extrabold text-foreground text-sm">
                {msg.pendingAction.description || "Tạo Task mới trên Jira"}
              </p>
              {msg.pendingAction.actionType && (
                <p className="text-muted-foreground font-semibold">
                  Loại hành động: <span className="text-foreground uppercase font-bold">{msg.pendingAction.actionType}</span>
                </p>
              )}
              {msg.pendingAction.payload && (
                <div className="bg-muted/40 p-2.5 rounded-xl space-y-1 text-[11px] font-medium border border-border/30">
                  {Object.entries(msg.pendingAction.payload).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <span className="text-muted-foreground capitalize">{k}:</span>
                      <span className="font-bold text-foreground truncate">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-[10px] text-muted-foreground italic">
              ℹ️ Nhiệm vụ chưa được tạo. Bấm <strong>Xác nhận</strong> để thực hiện thay đổi trên Jira.
            </p>

            <div className="flex gap-2 pt-1">
              <Button 
                size="sm" 
                onClick={() => confirmMutation.mutate(msg.pendingAction!.id)}
                disabled={confirmMutation.isPending}
                className="rounded-xl h-8 px-4 bg-primary text-primary-foreground text-xs font-bold gap-1.5 cursor-pointer flex-1"
              >
                {confirmMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                Xác nhận
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => rejectMutation.mutate(msg.pendingAction!.id)}
                disabled={rejectMutation.isPending}
                className="rounded-xl h-8 px-3 text-xs font-bold cursor-pointer"
              >
                <X size={13} className="mr-1" />
                Hủy
              </Button>
            </div>
          </div>
        )}

        {/* Artifact Download Rendering */}
        {artifactId && (
          <div className="mt-3">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => aiApi.downloadArtifact(artifactId)}
              className="rounded-xl h-8 px-3 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20 text-xs font-bold gap-1.5 cursor-pointer"
            >
              <Download size={13} />
              <span>Tải file báo cáo ({artifactId})</span>
            </Button>
          </div>
        )}

        {/* Suggested Followups */}
        {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
          <div className="mt-3 pt-2 border-t border-border/30 flex flex-wrap gap-1.5">
            {msg.suggestedFollowups.map((followup, fIdx) => (
              <button
                key={fIdx}
                type="button"
                onClick={() => {
                  if (activeConversationId) {
                    sendMutation.mutate(followup);
                  } else {
                    setInputText(followup);
                  }
                }}
                className="text-[11px] font-semibold bg-muted/60 hover:bg-primary/10 hover:text-primary text-muted-foreground px-2.5 py-1 rounded-full border border-border/40 transition-colors text-left"
              >
                💡 {followup}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center z-50 group"
      >
        <Bot size={28} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-[380px] h-[600px] max-h-[80vh] flex flex-col shadow-2xl rounded-[2rem] border border-border/50 bg-background/95 backdrop-blur-3xl z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-primary/5 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-foreground leading-none">SAGA AI</h3>
                <p className="text-xs text-muted-foreground mt-1">Trợ lý Phân tích Hệ thống</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 flex overflow-hidden">
            {/* Conversation List Sidebar (only show if no active conversation) */}
            {!activeConversationId ? (
              <div className="w-full flex flex-col">
                <div className="p-4 border-b border-border/50 flex justify-between items-center">
                  <h4 className="font-bold text-sm">Lịch sử trò chuyện</h4>
                  <Button size="icon" variant="ghost" onClick={handleCreateNew} disabled={createMutation.isPending}>
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {isLoadingConversations ? (
                    <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
                  ) : (() => {
                    const convList = Array.isArray(conversations) ? conversations : (conversations as any)?.content || (conversations as any)?.data || [];
                    return convList.length === 0 ? (
                      <div className="p-6 text-center text-sm text-muted-foreground">Chưa có lịch sử. Hãy bắt đầu chat!</div>
                    ) : (
                      <div className="p-2 space-y-1">
                        {convList.map((conv: any) => (
                          <button
                            key={conv.id}
                            onClick={() => setActiveConversationId(conv.id)}
                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-muted/50 text-sm font-medium transition-colors line-clamp-1"
                          >
                            {conv.title}
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              // Chat Interface
              <div className="w-full flex flex-col h-full bg-muted/10">
                {/* Chat Header inside active conversation */}
                <div className="px-4 py-2 bg-background border-b border-border/50 flex items-center gap-2">
                  <button onClick={() => setActiveConversationId(null)} className="text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    ← Quay lại
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                  {isLoadingDetail ? (
                    <div className="flex justify-center py-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
                  ) : (
                    <>
                      {(() => {
                        let msgList = Array.isArray(detailData?.messages) ? detailData?.messages : (detailData as any)?.messages?.content || (detailData as any)?.messages?.data || (Array.isArray(detailData) ? detailData : []);

                        // Filter out tool execution logs and raw metadata
                        msgList = msgList.filter((msg: any) => {
                          const text = (msg.content || msg.text || "").trim();
                          if (msg.role === 'SYSTEM' || msg.role === 'TOOL') return false;
                          // Hide strings like "discover_resource_context:COMPLETED", "propose_task_create:COMPLETED", etc.
                          if (/^[a-zA-Z0-9_]+:(COMPLETED|PENDING|STARTED|SUCCESS|FAILED|RUNNING)$/i.test(text)) return false;
                          if (text.startsWith("tool_") || text.includes(":COMPLETED") || text.includes(":STARTED")) return false;
                          return true;
                        });

                        return msgList.map((msg: any) => (
                          <div key={msg.id || msg.messageId} className={cn("flex w-full", msg.role === 'USER' ? "justify-end" : "justify-start")}>
                            <div className={cn(
                              "max-w-[85%] rounded-2xl px-4 py-3",
                              msg.role === 'USER' ? "bg-primary text-white rounded-tr-sm" : "bg-background border border-border/50 shadow-sm rounded-tl-sm text-foreground"
                            )}>
                              {renderMessageContent(msg)}
                            </div>
                          </div>
                        ));
                      })()}
                      {sendMutation.isPending && (
                        <div className="flex w-full justify-start">
                          <div className="bg-background border border-border/50 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 text-muted-foreground">
                            <Bot size={16} className="animate-pulse" /> Đang suy nghĩ...
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-3 bg-background border-t border-border/50">
                  <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                    <Input
                      placeholder="Hỏi trợ lý AI..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      disabled={
                        sendMutation.isPending ||
                        ['PENDING', 'RUNNING', 'WAITING_RETRY'].includes((Array.isArray(detailData?.messages) ? detailData?.messages : [])[((Array.isArray(detailData?.messages) ? detailData?.messages : []).length || 1) - 1]?.jobReference?.status || '')
                      }
                      className="rounded-xl border-border/50 bg-muted/30 focus-visible:ring-1"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={
                        !inputText.trim() ||
                        sendMutation.isPending ||
                        ['PENDING', 'RUNNING', 'WAITING_RETRY'].includes((Array.isArray(detailData?.messages) ? detailData?.messages : [])[((Array.isArray(detailData?.messages) ? detailData?.messages : []).length || 1) - 1]?.jobReference?.status || '')
                      }
                      className="rounded-xl shrink-0 disabled:opacity-50"
                    >
                      <Send size={16} />
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </>
  );
}
