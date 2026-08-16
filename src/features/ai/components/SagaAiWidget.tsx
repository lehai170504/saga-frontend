import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

import { Bot, X, Send, Plus, Loader2, Check, Download, Sparkles, Activity, RotateCw, History, MessageSquare, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addHours } from "date-fns";
import { isJiraRecoveryError } from "@/lib/error-utils";
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
import { AiMessage, AiConversation, AiPendingAction } from "../types";

const getConversationList = (data: unknown): AiConversation[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  const obj = data as Record<string, unknown>;
  if (Array.isArray(obj.items)) return obj.items as AiConversation[];
  if (Array.isArray(obj.content)) return obj.content as AiConversation[];
  if (Array.isArray(obj.data)) return obj.data as AiConversation[];
  return [];
};

const getMessageList = (data: unknown): AiMessage[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data as AiMessage[];
  const obj = data as Record<string, unknown>;
  if (Array.isArray(obj.messages)) return obj.messages as AiMessage[];
  if (Array.isArray(obj.items)) return obj.items as AiMessage[];
  const msgs = obj.messages as Record<string, unknown> | undefined;
  if (msgs && Array.isArray(msgs.content)) return msgs.content as AiMessage[];
  if (msgs && Array.isArray(msgs.data)) return msgs.data as AiMessage[];
  if (Array.isArray(obj.content)) return obj.content as AiMessage[];
  if (Array.isArray(obj.data)) return obj.data as AiMessage[];
  return [];
};

import { useCourse } from "@/features/courses/hooks/useCourses";
import { isCourseEnded } from "@/lib/course-utils";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function SagaAiWidget() {
  const pathname = usePathname();
  const params = useParams();
  const activeCourseId = typeof params?.courseId === "string" ? params.courseId : undefined;
  const currentScopeKey = activeCourseId || "GLOBAL";

  const { user } = useAuth();
  const { data: activeCourse } = useCourse(activeCourseId || "");
  const isStudent = String(user?.applicationRole || "").toUpperCase().includes("STUDENT");
  const isCourseReadonly = isStudent && isCourseEnded(activeCourse);

  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [conversationByScope, setConversationByScope] = useState<Record<string, string>>({});
  const [inputText, setInputText] = useState("");
  const [recoveryActionIds, setRecoveryActionIds] = useState<Record<string, boolean>>({});
  const [optimisticUserMessage, setOptimisticUserMessage] = useState<string | null>(null);

  const activeConversationId = conversationByScope[currentScopeKey] || null;

  const {
    data: conversations,
    isLoading: isLoadingConversations,
  } = useAiConversations();
  const { data: detailData, isLoading: isLoadingDetail } = useAiConversationDetail(activeConversationId);
  const createMutation = useCreateAiConversation();
  const sendMutation = useSendAiMessage(activeConversationId || "");
  const sendMutationDynamic = useSendAiMessageDynamic();
  const confirmMutation = useConfirmAiAction(activeConversationId || "");
  const rejectMutation = useRejectAiAction(activeConversationId || "");

  const scrollRef = useRef<HTMLDivElement>(null);

  const parsedConversations = useMemo(() => getConversationList(conversations), [conversations]);
  const filteredConversations = useMemo(() => {
    return parsedConversations.filter((conv: AiConversation) => activeCourseId ? conv.courseId === activeCourseId : !conv.courseId);
  }, [parsedConversations, activeCourseId]);

  useEffect(() => {
    if (filteredConversations.length > 0 && !conversationByScope[currentScopeKey]) {
      const latestId = filteredConversations[0]?.id;
      if (latestId) {
        queueMicrotask(() => {
          setConversationByScope((prev) => (prev[currentScopeKey] ? prev : { ...prev, [currentScopeKey]: latestId }));
        });
      }
    }
  }, [filteredConversations, currentScopeKey, conversationByScope]);

  const queryClient = useQueryClient();
  const cachedPendingAction = activeConversationId
    ? (queryClient.getQueryData(["latest-pending-action", activeConversationId]) as Record<string, unknown> | undefined)
    : null;

  const parsedMessages = useMemo(() => {
    let rawList = getMessageList(detailData);
    if (rawList.length === 0 && activeConversationId) {
      const activeConv = filteredConversations.find(c => c.id === activeConversationId);
      const activeConvData = activeConv as (AiConversation & { messages?: AiMessage[] }) | undefined;
      if (activeConvData && Array.isArray(activeConvData.messages)) {
        rawList = activeConvData.messages;
      }
    }
    const validMsgs = rawList.filter((msg: AiMessage) => {
      const text = (msg.content || msg.text || "").trim();
      const roleStr = msg.role as string;
      if (roleStr === 'SYSTEM' || roleStr === 'TOOL') return false;
      if (/^[a-zA-Z0-9_]+:(COMPLETED|PENDING|STARTED|SUCCESS|FAILED|RUNNING)$/i.test(text)) return false;
      if (text.startsWith("tool_") || text.includes(":COMPLETED") || text.includes(":STARTED")) return false;
      return true;
    });

    const lastAssistantIndex = validMsgs.map(m => m.role).lastIndexOf("ASSISTANT");
    if (lastAssistantIndex !== -1 && cachedPendingAction) {
      const lastMsg = validMsgs[lastAssistantIndex];
      if (!lastMsg.pendingAction) {
        validMsgs[lastAssistantIndex] = {
          ...lastMsg,
          pendingAction: cachedPendingAction as unknown as AiPendingAction,
        };
      }
    }
    return validMsgs;
  }, [detailData, cachedPendingAction, activeConversationId, filteredConversations]);

  const isAiThinking = sendMutation.isPending || sendMutationDynamic.isPending || createMutation.isPending || (
    parsedMessages.length > 0 &&
    ['PENDING', 'RUNNING', 'WAITING_RETRY'].includes(parsedMessages[parsedMessages.length - 1]?.jobReference?.status || '')
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [detailData?.messages, sendMutation.isPending, optimisticUserMessage]);

  const handleSend = () => {
    if (!inputText.trim() || isAiThinking) return;

    const messageContent = inputText.trim();
    setInputText("");
    setOptimisticUserMessage(messageContent);

    if (!activeConversationId) {
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
            }, {
              onSuccess: () => setOptimisticUserMessage(null),
              onError: () => {
                setOptimisticUserMessage(null);
                setInputText(messageContent);
              }
            });
          },
          onError: () => {
            setOptimisticUserMessage(null);
            setInputText(messageContent);
          }
        }
      );
      return;
    }

    sendMutation.mutate(
      { content: messageContent, courseId: activeCourseId },
      {
        onSuccess: () => setOptimisticUserMessage(null),
        onError: (err: unknown) => {
          setOptimisticUserMessage(null);
          setInputText(messageContent);
          const error = err as Record<string, unknown>;
          const response = error?.response as Record<string, unknown>;
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
        title: "Cuộc trò chuyện mới",
        courseId: activeCourseId,
      },
      {
        onSuccess: (newConv) => {
          setConversationByScope((prev) => ({ ...prev, [currentScopeKey]: newConv.id }));
          setShowHistory(false);
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
        {textStr && (
          <p className="whitespace-pre-wrap text-xs leading-relaxed">{textStr}</p>
        )}

        {msg.citations && msg.citations.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit mt-1.5 border border-emerald-500/20">
            <Check size={12} className="text-emerald-500" />
            <span>Đã lấy dữ liệu thực tế từ SAGA System</span>
          </div>
        )}

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

        {(() => {
          const msgData = msg as unknown as Record<string, unknown>;
          const rawPendingAction = msg.pendingAction || msgData.pending_action || msgData.proposedAction || msgData.action;
          if (!rawPendingAction) return null;
          const pendingAction = rawPendingAction as { id?: string; actionId?: string; status?: string; description?: string; summary?: string; title?: string; actionType?: string; type?: string; action_type?: string; payload?: Record<string, unknown>; parameters?: Record<string, unknown>; data?: Record<string, unknown>; };

          const actionId = pendingAction.id || pendingAction.actionId;
          const status = (pendingAction.status || "PENDING").toUpperCase();
          const description = pendingAction.description || pendingAction.summary || pendingAction.title || "Tạo Task mới trên Jira";
          const payload = pendingAction.payload || pendingAction.parameters || pendingAction.data;

          const titleVal = String(payload?.title || payload?.name || description || "");
          const priorityVal = String(payload?.priority || "Medium");
          const assigneeVal = String(payload?.assigneeName || payload?.assignee || "Chưa giao");
          const sprintVal = String(payload?.sprintName || payload?.sprint || (payload?.sprintId ? `Sprint (${payload.sprintId})` : "Backlog (Chưa phân Sprint)"));
          const typeVal = payload?.issueType || payload?.type || payload?.taskType ? String(payload?.issueType || payload?.type || payload?.taskType) : null;
          const dueDateVal = payload?.dueDate || payload?.deadline || payload?.due_date ? String(payload?.dueDate || payload?.deadline || payload?.due_date) : null;

          return (
            <div className="mt-3 p-3.5 bg-card rounded-2xl border border-primary/30 shadow-md space-y-2.5">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <p className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Sparkles size={13} />
                  Đề xuất tạo Task
                </p>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${status === "CONFIRMED" || status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : status === "REJECTED" ? "bg-muted text-muted-foreground border border-border/40" : "bg-amber-500/10 text-amber-600 border border-amber-500/20"}`}>
                  {status === "CONFIRMED" || status === "COMPLETED" ? "Đã xác nhận" : status === "REJECTED" ? "Đã hủy" : "Chờ xác nhận"}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-extrabold text-foreground leading-snug">{titleVal}</p>
                <div className="bg-muted/40 p-2 rounded-xl space-y-1 text-[11px] font-medium border border-border/30 mt-1">
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Title:</span>
                    <span className="font-bold text-foreground truncate">{titleVal}</span>
                  </div>
                  {typeVal && (
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-bold text-foreground capitalize">{typeVal}</span>
                    </div>
                  )}
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Priority:</span>
                    <span className="font-bold text-foreground uppercase">{priorityVal}</span>
                  </div>
                  {dueDateVal && (
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground">Hạn chót:</span>
                      <span className="font-bold text-foreground">{dueDateVal}</span>
                    </div>
                  )}
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Assignee:</span>
                    <span className="font-bold text-foreground truncate">{assigneeVal}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-muted-foreground">Sprint:</span>
                    <span className="font-extrabold text-primary truncate">{sprintVal}</span>
                  </div>
                </div>
              </div>

              {status === "PENDING" ? (
                <>
                  <p className="text-[10px] text-muted-foreground italic">
                    ℹ️ Nhiệm vụ chưa được tạo. Bấm <strong>Xác nhận</strong> để thực hiện thay đổi trên Jira.
                  </p>

                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      onClick={async () => {
                        if (!actionId) return;
                        try {
                          await confirmMutation.mutateAsync(actionId);
                          setRecoveryActionIds((prev) => ({ ...prev, [actionId]: false }));
                        } catch (err: unknown) {
                          if (isJiraRecoveryError(err)) {
                            setRecoveryActionIds((prev) => ({ ...prev, [actionId]: true }));
                          }
                        }
                      }}
                      disabled={confirmMutation.isPending || !actionId || isCourseReadonly}
                      className="rounded-xl h-8 px-4 bg-primary text-primary-foreground text-xs font-bold gap-1.5 cursor-pointer flex-1 disabled:opacity-50"
                    >
                      {confirmMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : (actionId && recoveryActionIds[actionId]) ? <RotateCw size={13} /> : <Check size={13} />}
                      {(actionId && recoveryActionIds[actionId]) ? "Thử lại" : "Xác nhận"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => actionId && rejectMutation.mutate(actionId)}
                      disabled={rejectMutation.isPending || !actionId || isCourseReadonly}
                      className="rounded-xl h-8 px-3 text-xs font-bold cursor-pointer disabled:opacity-50"
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

        {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
          <div className="mt-3 pt-2 border-t border-border/30 flex flex-wrap gap-1.5">
            {msg.suggestedFollowups.map((followup, fIdx) => (
              <button
                key={fIdx}
                type="button"
                disabled={isCourseReadonly}
                onClick={() => {
                  if (activeConversationId) {
                    sendMutation.mutate({ content: followup, courseId: activeCourseId });
                  } else {
                    setInputText(followup);
                  }
                }}
                className="text-[11px] font-semibold bg-muted/60 hover:bg-primary/10 hover:text-primary text-muted-foreground px-2.5 py-1 rounded-full border border-border/40 transition-colors text-left disabled:opacity-50 disabled:pointer-events-none"
              >
                💡 {followup}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (pathname === "/student") {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center z-50 group cursor-pointer"
      >
        <Bot size={28} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-[380px] h-[600px] max-h-[80vh] flex flex-col shadow-2xl rounded-[2rem] border border-border/50 bg-background/95 backdrop-blur-3xl z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">

          {/* Header */}
          <div className="p-4 bg-primary/10 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                  SAGA AI Assistant
                  <Sparkles size={14} className="text-amber-500 animate-pulse" />
                </h3>
                <p className="text-[10px] text-muted-foreground font-medium">Hỗ trợ quản lý Task & Dự án</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHistory(!showHistory)}
                title={showHistory ? "Quay lại Chat" : "Lịch sử trò chuyện"}
                className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground cursor-pointer"
              >
                {showHistory ? <MessageSquare size={16} /> : <History size={16} />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCreateNew()}
                disabled={isCourseReadonly}
                title="Tạo cuộc trò chuyện mới"
                className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground cursor-pointer disabled:opacity-50"
              >
                <Plus size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground cursor-pointer"
              >
                <X size={16} />
              </Button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {showHistory ? (
              <div className="w-full h-full bg-background p-3 flex flex-col overflow-hidden">
                <div className="text-xs font-bold text-muted-foreground px-2 py-1 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Lịch sử hội thoại</span>
                  <span className="text-[10px] lowercase font-normal">({filteredConversations.length} hội thoại)</span>
                </div>
                {isLoadingConversations ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="animate-spin text-muted-foreground" />
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-2 text-muted-foreground">
                    <Activity size={32} className="opacity-30" />
                    <p className="text-xs font-medium">Chưa có lịch sử trò chuyện nào</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                    {filteredConversations.map((conv) => {
                      const isSelected = conv.id === activeConversationId;
                      const dateSource = conv.updatedAt || conv.createdAt;
                      const formattedDate = dateSource
                        ? format(addHours(new Date(dateSource), 7), "dd/MM/yyyy HH:mm")
                        : null;

                      return (
                        <button
                          key={conv.id}
                          onClick={() => {
                            setConversationByScope((prev) => ({ ...prev, [currentScopeKey]: conv.id }));
                            setShowHistory(false);
                          }}
                          className={cn(
                            "w-full text-left p-2.5 rounded-xl text-xs transition-all flex flex-col gap-1 border cursor-pointer",
                            isSelected
                              ? "bg-primary/10 border-primary/30 font-bold text-primary shadow-sm"
                              : "bg-card hover:bg-muted/50 border-border/40 text-card-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <MessageSquare size={13} className={cn("shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                            <span className="truncate font-semibold">{conv.title || "Cuộc trò chuyện mới"}</span>
                          </div>
                          {formattedDate && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground pl-5">
                              <Clock size={10} className="shrink-0 opacity-70" />
                              <span>{formattedDate}</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              // Main Chat Interface
              <div className="w-full flex flex-col h-full bg-muted/10">
                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                  {isLoadingDetail && parsedMessages.length === 0 ? (
                    <div className="flex justify-center py-6"><Loader2 className="animate-spin text-muted-foreground" /></div>
                  ) : parsedMessages.length === 0 && !optimisticUserMessage ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 my-auto">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <Bot size={24} />
                      </div>
                      <h4 className="font-extrabold text-sm text-foreground">Xin chào! SAGA AI sẵn sàng hỗ trợ</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Bạn có thể gửi câu hỏi, yêu cầu tạo Task hoặc phân tích tiến độ dự án trực tiếp tại đây.
                      </p>
                    </div>
                  ) : (
                    <>
                      {parsedMessages.map((msg: AiMessage) => (
                        <div key={msg.id || (msg as unknown as Record<string, unknown>).messageId as string} className={cn("flex w-full", msg.role === 'USER' ? "justify-end" : "justify-start")}>
                          <div className={cn(
                            "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
                            msg.role === 'USER' ? "bg-primary text-white rounded-tr-sm" : "bg-card border border-border/50 text-card-foreground rounded-tl-sm"
                          )}>
                            {renderMessageContent(msg)}
                          </div>
                        </div>
                      ))}

                      {optimisticUserMessage && (
                        <div className="flex w-full justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-3 bg-primary text-white text-xs leading-relaxed shadow-sm">
                            <p className="whitespace-pre-wrap">{optimisticUserMessage}</p>
                          </div>
                        </div>
                      )}

                      {isAiThinking && (
                        <div className="flex w-full justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div className="bg-card border border-border/50 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 text-xs text-muted-foreground font-semibold">
                            <Bot size={16} className="animate-spin text-primary" /> SAGA AI đang suy nghĩ...
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Read-Only Notice for Ended Course */}
                {isCourseReadonly && (
                  <div className="mx-3 my-1.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>Khóa học đã kết thúc. Chức năng nhắn tin AI đã bị khóa (Chỉ xem).</span>
                  </div>
                )}

                {/* Input Area (Always rendered!) */}
                <div className="p-3 bg-background border-t border-border/50">
                  <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                    <Input
                      placeholder={isCourseReadonly ? "Khóa học đã kết thúc (Chế độ chỉ xem)..." : "Hỏi trợ lý AI..."}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      disabled={isAiThinking || isCourseReadonly}
                      className="rounded-xl border-border/50 bg-muted/30 focus-visible:ring-1 text-xs disabled:opacity-60"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!inputText.trim() || isAiThinking || isCourseReadonly}
                      className="rounded-xl shrink-0 disabled:opacity-50 cursor-pointer"
                    >
                      <Send size={15} />
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
