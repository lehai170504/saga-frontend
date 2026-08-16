import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

import { Bot, X, Send, Plus, Loader2, Check, Download, Sparkles, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAiConversations,
  useAiConversationDetail,
  useCreateAiConversation,
  useSendAiMessage,
  useSendAiMessageDynamic,
  useConfirmAiAction,
  useRejectAiAction
} from "../hooks/useAi";
import { aiApi } from "../api/aiApi";
import { AiMessage, AiConversation } from "../types";

const getConversationList = (data: unknown): AiConversation[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  const obj = data as Record<string, unknown>;
  if (Array.isArray(obj.content)) return obj.content;
  if (Array.isArray(obj.data)) return obj.data;
  return [];
};

const getMessageList = (data: unknown): AiMessage[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data as AiMessage[];
  const obj = data as Record<string, unknown>;
  if (Array.isArray(obj.messages)) return obj.messages as AiMessage[];
  const msgs = obj.messages as Record<string, unknown> | undefined;
  if (msgs && Array.isArray(msgs.content)) return msgs.content as AiMessage[];
  if (msgs && Array.isArray(msgs.data)) return msgs.data as AiMessage[];
  return [];
};

export function SagaAiWidget() {
  const params = useParams();
  const activeCourseId = typeof params?.courseId === "string" ? params.courseId : undefined;
  const currentScopeKey = activeCourseId || "GLOBAL";

  const [isOpen, setIsOpen] = useState(false);
  const [conversationByScope, setConversationByScope] = useState<Record<string, string>>({});
  const [inputText, setInputText] = useState("");

  const activeConversationId = conversationByScope[currentScopeKey] || null;

  const {
    data: conversations,
    isLoading: isLoadingConversations,
    isError: isErrorConversations,
    refetch: refetchConversations,
  } = useAiConversations();
  const { data: detailData, isLoading: isLoadingDetail } = useAiConversationDetail(activeConversationId);
  const createMutation = useCreateAiConversation();
  const sendMutation = useSendAiMessage(activeConversationId || "");
  const sendMutationDynamic = useSendAiMessageDynamic();
  const confirmMutation = useConfirmAiAction(activeConversationId || "");
  const rejectMutation = useRejectAiAction(activeConversationId || "");

  const scrollRef = useRef<HTMLDivElement>(null);

  // Parse lists securely
  const parsedConversations = useMemo(() => getConversationList(conversations), [conversations]);
  const filteredConversations = useMemo(() => {
    return parsedConversations.filter((conv: AiConversation) => activeCourseId ? conv.courseId === activeCourseId : !conv.courseId);
  }, [parsedConversations, activeCourseId]);

  const isServiceUnavailable = isErrorConversations ||
    (conversations as unknown as Record<string, unknown>)?.status === 503 ||
    (conversations as unknown as Record<string, unknown>)?.error === "AI_AGENT_UNAVAILABLE";

  const parsedMessages = useMemo(() => {
    const rawList = getMessageList(detailData);
    return rawList.filter((msg: AiMessage) => {
      const text = (msg.content || msg.text || "").trim();
      const roleStr = msg.role as string;
      if (roleStr === 'SYSTEM' || roleStr === 'TOOL') return false;
      // Hide strings like "discover_resource_context:COMPLETED", "propose_task_create:COMPLETED", etc.
      if (/^[a-zA-Z0-9_]+:(COMPLETED|PENDING|STARTED|SUCCESS|FAILED|RUNNING)$/i.test(text)) return false;
      if (text.startsWith("tool_") || text.includes(":COMPLETED") || text.includes(":STARTED")) return false;
      return true;
    });
  }, [detailData]);

  const isAiThinking = sendMutation.isPending || (
    parsedMessages.length > 0 &&
    ['PENDING', 'RUNNING', 'WAITING_RETRY'].includes(parsedMessages[parsedMessages.length - 1]?.jobReference?.status || '')
  );

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [detailData?.messages, sendMutation.isPending]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const messageContent = inputText.trim();
    setInputText("");

    if (!activeConversationId) {
      // Create new scoped conversation first
      createMutation.mutate(
        {
          title: messageContent.slice(0, 30) + "...",
          courseId: activeCourseId,
        },
        {
          onSuccess: (newConv) => {
            setConversationByScope((prev) => ({ ...prev, [currentScopeKey]: newConv.id }));
            sendMutationDynamic.mutate({
              conversationId: newConv.id,
              content: messageContent,
              courseId: activeCourseId,
            });
          },
        }
      );
      return;
    }

    sendMutation.mutate(
      { content: messageContent, courseId: activeCourseId },
      {
        onError: (err: unknown) => {
          const error = err as Record<string, unknown>;
          const response = error?.response as Record<string, unknown>;
          // If 409 scope mismatch or conflict
          if (response?.status === 409 || error?.status === 409 || String(error?.message).includes("409")) {
            toast.error("Cuộc trò chuyện này không thuộc Lớp học hiện tại. Đã tạo cuộc trò chuyện mới.");
            setConversationByScope((prev) => {
              const next = { ...prev };
              delete next[currentScopeKey];
              return next;
            });
          }
        },
      }
    );
  };

  const handleCreateNew = () => {
    createMutation.mutate(
      {
        title: activeCourseId ? "Trò chuyện Khóa học" : "Trò chuyện mới",
        courseId: activeCourseId,
      },
      {
        onSuccess: (newConv) => {
          setConversationByScope((prev) => ({ ...prev, [currentScopeKey]: newConv.id }));
        },
      }
    );
  };

  const formatMessageText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
      <p className="whitespace-pre-wrap text-sm leading-relaxed">
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
            return <strong key={index} className="font-extrabold">{part.slice(2, -2)}</strong>;
          }
          return <React.Fragment key={index}>{part}</React.Fragment>;
        })}
      </p>
    );
  };

  const renderMessageContent = (msg: AiMessage) => {
    const textStr = msg.content || msg.text || "";
    const artifactId = typeof msg.generatedArtifact === "string" ? msg.generatedArtifact : msg.artifactId;

    return (
      <div className="space-y-2">
        {/* Main Text Content */}
        {textStr && formatMessageText(textStr)}

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
        {(() => {
          const pendingAction = msg.pendingAction || (msg as any).pending_action || (msg as any).proposedAction || (msg as any).action;
          if (!pendingAction) return null;

          const actionId = pendingAction.id || pendingAction.actionId;
          const status = (pendingAction.status || "PENDING").toUpperCase();
          const description = pendingAction.description || pendingAction.summary || pendingAction.title || "Tạo Task mới trên Jira";
          const actionType = pendingAction.actionType || pendingAction.type || pendingAction.action_type;
          const payload = pendingAction.payload || pendingAction.parameters || pendingAction.data;

          return (
            <div className="mt-3 p-4 bg-card rounded-2xl border border-primary/30 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <p className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Sparkles size={14} />
                  Đề xuất tạo/cập nhật Task
                </p>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                  status === "CONFIRMED" || status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                    status === "REJECTED" ? "bg-muted text-muted-foreground border border-border/40" :
                      "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                )}>
                  {status === "CONFIRMED" || status === "COMPLETED" ? "Đã xác nhận" :
                    status === "REJECTED" ? "Đã hủy" : "Chờ xác nhận"}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="font-extrabold text-foreground text-sm">
                  {description}
                </p>
                {actionType && (
                  <p className="text-muted-foreground font-semibold">
                    Loại hành động: <span className="text-foreground uppercase font-bold">{actionType}</span>
                  </p>
                )}
                {payload && typeof payload === "object" && (
                  <div className="bg-muted/40 p-2.5 rounded-xl space-y-1 text-[11px] font-medium border border-border/30">
                    {Object.entries(payload).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2">
                        <span className="text-muted-foreground capitalize">{k}:</span>
                        <span className="font-bold text-foreground truncate">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {status === "PENDING" ? (
                <>
                  <p className="text-[10px] text-muted-foreground italic">
                    ℹ️ Nhiệm vụ chưa được tạo. Bấm <strong>Xác nhận</strong> để thực hiện thay đổi trên Jira.
                  </p>

                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      onClick={() => actionId && confirmMutation.mutate(actionId)}
                      disabled={confirmMutation.isPending || !actionId}
                      className="rounded-xl h-8 px-4 bg-primary text-primary-foreground text-xs font-bold gap-1.5 cursor-pointer flex-1"
                    >
                      {confirmMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                      Xác nhận
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => actionId && rejectMutation.mutate(actionId)}
                      disabled={rejectMutation.isPending || !actionId}
                      className="rounded-xl h-8 px-3 text-xs font-bold cursor-pointer"
                    >
                      <X size={13} className="mr-1" />
                      Hủy
                    </Button>
                  </div>
                </>
              ) : status === "CONFIRMED" || status === "COMPLETED" ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                  <Check size={14} />
                  <span>Đã tạo Task thành công trên Jira!</span>
                </div>
              ) : (
                <div className="text-xs font-semibold text-muted-foreground bg-muted p-2 rounded-xl">
                  <span>Đã hủy bỏ đề xuất tạo Task này.</span>
                </div>
              )}
            </div>
          );
        })()}

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
                    sendMutation.mutate({ content: followup, courseId: activeCourseId });
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
                <p className="text-xs text-muted-foreground mt-1">
                  {activeCourseId ? "Trợ lý Lớp học hiện tại" : "Trợ lý Phân tích Hệ thống"}
                </p>
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
                  ) : isServiceUnavailable ? (
                    <div className="p-6 text-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                        <Bot size={20} className="animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-foreground">Dịch vụ AI đang khởi động / gián đoạn</p>
                        <p className="text-[11px] text-muted-foreground leading-normal">
                          Hệ thống Trợ lý AI đang tạm ngưng kết nối (503 Service Unavailable). Vui lòng nhấn <strong>Thử lại</strong> sau ít phút.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => refetchConversations()}
                        className="rounded-xl h-8 text-xs font-bold gap-1.5 mx-auto cursor-pointer"
                      >
                        Thử lại
                      </Button>
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">Chưa có lịch sử cho không gian này. Hãy bắt đầu chat!</div>
                  ) : (
                    <div className="p-2 space-y-1">
                      {filteredConversations.map((conv: AiConversation) => (
                        <button
                          key={conv.id}
                          onClick={() => setConversationByScope((prev) => ({ ...prev, [currentScopeKey]: conv.id }))}
                          className="w-full text-left px-4 py-3 rounded-xl hover:bg-muted/50 text-sm font-medium transition-colors line-clamp-1 cursor-pointer"
                        >
                          {conv.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Chat Interface
              <div className="w-full flex flex-col h-full bg-muted/10">
                {/* Chat Header inside active conversation */}
                <div className="px-4 py-2 bg-background border-b border-border/50 flex items-center gap-2">
                  <button onClick={() => setConversationByScope((prev) => ({ ...prev, [currentScopeKey]: "" }))} className="text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer">
                    ← Quay lại
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                  {isLoadingDetail ? (
                    <div className="flex justify-center py-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
                  ) : (
                    <>
                      {parsedMessages.map((msg: AiMessage) => (
                        <div key={msg.id || (msg as unknown as Record<string, unknown>).messageId as string} className={cn("flex w-full", msg.role === 'USER' ? "justify-end" : "justify-start")}>
                          <div className={cn(
                            "max-w-[85%] rounded-2xl px-4 py-3",
                            msg.role === 'USER' ? "bg-primary text-white rounded-tr-sm" : "bg-background border border-border/50 shadow-sm rounded-tl-sm text-foreground"
                          )}>
                            {renderMessageContent(msg)}
                          </div>
                        </div>
                      ))}
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
                      disabled={isAiThinking}
                      className="rounded-xl border-border/50 bg-muted/30 focus-visible:ring-1"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!inputText.trim() || isAiThinking}
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
