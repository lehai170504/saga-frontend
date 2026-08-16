"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, User, Send, Plus, Loader2, MessageSquare, Clock, Download, CheckCircle, XCircle, Sparkles, RotateCw } from "lucide-react";
import {
  useConversations,
  useConversation,
  useCreateConversation,
  useSendMessage,
  useConfirmPendingAction,
  useRejectPendingAction,
  useDownloadArtifact
} from "@/features/lecturer/hooks/useAiAgent";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { format, addHours } from "date-fns";
import { isJiraRecoveryError } from "@/lib/error-utils";
import { AlertTriangle } from "lucide-react";
import { useCourse } from "@/features/courses/hooks/useCourses";
import { isCourseEnded } from "@/lib/course-utils";
import { useAuth } from "@/features/auth/hooks/useAuth";

import { AiConversation, AiMessage } from "@/features/ai/types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AiAgentPanel(props?: { projectId?: string }) {
  const params = useParams();
  const activeCourseId = typeof params?.courseId === "string" ? params.courseId : undefined;

  const { user } = useAuth();
  const { data: activeCourse } = useCourse(activeCourseId || "");
  const isStudent = String(user?.applicationRole || "").toUpperCase().includes("STUDENT");
  const isCourseReadonly = isStudent && isCourseEnded(activeCourse);

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [optimisticMessage, setOptimisticMessage] = useState<string | null>(null);
  const [recoveryActionIds, setRecoveryActionIds] = useState<Record<string, boolean>>({});

  const {
    data: conversationsData,
    isLoading: isLoadingConversations,
    isError: isErrorConversations,
    refetch: refetchConversations,
  } = useConversations();
  const { data: conversationDetail, isLoading: isLoadingMessages } = useConversation(selectedConversationId);

  const { mutateAsync: createConversation, isPending: isCreating } = useCreateConversation();
  const { mutateAsync: sendMessage, isPending: isSending } = useSendMessage();
  const { mutateAsync: confirmAction, isPending: isConfirming } = useConfirmPendingAction();
  const { mutateAsync: rejectAction, isPending: isRejecting } = useRejectPendingAction();
  const { mutateAsync: downloadArtifact } = useDownloadArtifact();
  const [downloadingArtifacts, setDownloadingArtifacts] = useState<Record<string, boolean>>({});

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversationDetail?.messages, isSending]);

  // Auto-select latest conversation from history
  useEffect(() => {
    const rawData = conversationsData as unknown as { items?: AiConversation[]; content?: AiConversation[] } | undefined;
    const convs = rawData?.items || rawData?.content || (Array.isArray(conversationsData) ? (conversationsData as AiConversation[]) : []);
    if (convs.length > 0 && !selectedConversationId) {
      const latestId = convs[0]?.id;
      if (latestId) {
        queueMicrotask(() => {
          setSelectedConversationId(latestId);
        });
      }
    }
  }, [conversationsData, selectedConversationId]);

  const handleNewChat = async () => {
    try {
      const res = await createConversation({ title: "New Conversation", courseId: activeCourseId });
      if (res && res.id) {
        setSelectedConversationId(res.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversationId) return;
    const content = messageInput;
    setMessageInput("");
    setOptimisticMessage(content);
    try {
      await sendMessage({ conversationId: selectedConversationId, payload: { content, courseId: activeCourseId } });
    } catch (e) {
      console.error(e);
      setMessageInput(content); // restore on error
    } finally {
      setOptimisticMessage(null);
    }
  };

  // Regex extractors removed as BE now returns structured data in AiMessage

  const handleDownloadArtifact = async (artifactId: string) => {
    try {
      setDownloadingArtifacts(prev => ({ ...prev, [artifactId]: true }));
      const blob = await downloadArtifact(artifactId);
      const url = URL.createObjectURL(blob as unknown as Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "saga-srs.docx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Lỗi khi tải artifact:", e);
    } finally {
      setDownloadingArtifacts(prev => ({ ...prev, [artifactId]: false }));
    }
  };

  return (
    <div className="h-[800px] flex gap-4">
      {/* Sidebar: Conversation History */}
      <Card className="w-1/3 rounded-[2rem] border-border bg-card/60 backdrop-blur-xl shadow-lg flex flex-col overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-primary/5 pb-4 shrink-0">
          <CardTitle className="text-xl font-bold flex items-center justify-between text-primary">
            <span className="flex items-center gap-2"><Bot size={24} /> Lịch sử Chat</span>
          </CardTitle>
          <Button
            onClick={handleNewChat}
            disabled={isCreating || isCourseReadonly}
            className="w-full mt-4 font-bold rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            Hội thoại mới
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
          {isLoadingConversations ? (
            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : isErrorConversations || (conversationsData as unknown as { status?: number; error?: string })?.status === 503 || (conversationsData as unknown as { status?: number; error?: string })?.error === "AI_AGENT_UNAVAILABLE" ? (
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
          ) : (() => {
            const rawData = conversationsData as unknown as { items?: AiConversation[]; content?: AiConversation[] } | undefined;
            const rawConvs = rawData?.items || rawData?.content || (Array.isArray(conversationsData) ? (conversationsData as AiConversation[]) : []);
            const convItems = rawConvs.filter((conv: AiConversation) =>
              activeCourseId ? conv.courseId === activeCourseId : !conv.courseId
            );
            return convItems.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground mt-4">Chưa có hội thoại nào trong không gian này</div>
            ) : (
              convItems.map((conv: AiConversation) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all border ${selectedConversationId === conv.id ? 'bg-primary/10 border-primary/30' : 'bg-background hover:bg-muted/50 border-transparent'}`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <MessageSquare size={14} className="text-primary" />
                    <span className="truncate">{conv.title || "Hội thoại không tên"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1.5">
                    <Clock size={10} />
                    {format(addHours(new Date(conv.updatedAt || conv.createdAt || 0), 7), "dd/MM/yyyy HH:mm")}
                  </div>
                </div>
              ))
            );
          })()}
        </CardContent>
      </Card>

      {/* Main Chat Area */}
      <Card className="flex-1 rounded-[2rem] border-border bg-card/60 backdrop-blur-xl shadow-lg flex flex-col overflow-hidden">
        {selectedConversationId ? (
          <>
            <CardHeader className="border-b border-border/50 bg-primary/5 py-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Bot className="text-primary" size={20} />
                {conversationDetail?.title || "Đang tải..."}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {(() => {
                  const rawData = conversationsData as unknown as { items?: AiConversation[]; content?: AiConversation[] } | undefined;
                  const rawConvs = rawData?.items || rawData?.content || (Array.isArray(conversationsData) ? (conversationsData as AiConversation[]) : []);
                  const activeConv = rawConvs.find((c: AiConversation) => c.id === selectedConversationId);
                  const detailObj = conversationDetail as unknown as { items?: AiMessage[]; messages?: AiMessage[] } | undefined;
                  const msgsList = (conversationDetail?.messages && conversationDetail.messages.length > 0)
                    ? conversationDetail.messages
                    : (detailObj?.items && detailObj.items.length > 0)
                    ? detailObj.items
                    : activeConv?.messages || [];

                  if (isLoadingMessages && msgsList.length === 0) {
                    return <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>;
                  }

                  if (msgsList.length === 0) {
                    return (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                        <Bot size={48} className="opacity-20" />
                        <p className="text-sm font-medium">Bắt đầu trò chuyện với SAGA AI</p>
                      </div>
                    );
                  }

                  const validMsgs = msgsList.filter((msgRecord: unknown) => {
                    const msg = msgRecord as Record<string, unknown>;
                    const text = String(msg.content || msg.text || "");
                    if (msg.role === 'SYSTEM' || msg.role === 'TOOL') return false;
                    if (/^[a-zA-Z_]+:(COMPLETED|PENDING|STARTED)$/.test(text.trim())) return false;
                    return true;
                  });

                  return validMsgs.map((msgRecord: unknown, index: number) => {
                      const msg = msgRecord as Record<string, unknown>;
                      return (
                        <div key={String(msg.id || index)} className={`flex gap-3 ${msg.role === 'USER' ? 'flex-row-reverse' : ''}`}>
                          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'USER' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                            {msg.role === 'USER' ? <User size={16} /> : <Bot size={16} />}
                          </div>
                          <div className={`max-w-[75%] space-y-2 ${msg.role === 'USER' ? 'items-end' : 'items-start'}`}>
                            <div
                              className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'USER'
                                ? 'bg-primary text-primary-foreground rounded-tr-sm selection:bg-white/30 selection:text-white'
                                : 'bg-muted text-foreground rounded-tl-sm selection:bg-primary/25 selection:text-foreground'
                                }`}
                            >
                              {String(msg.text || msg.content || "")}
                            </div>

                            {/* Render Pending Action Buttons */}
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
                                <div className="p-4 bg-card border border-primary/30 rounded-2xl shadow-sm mt-2 space-y-3">
                                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                                    <span className="text-xs font-extrabold flex items-center gap-1.5 text-primary">
                                      <Sparkles size={14} />
                                      Đề xuất tạo Task
                                    </span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status === "CONFIRMED" || status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : status === "REJECTED" ? "bg-muted text-muted-foreground border border-border/40" : "bg-amber-500/10 text-amber-600 border border-amber-500/20"}`}>
                                      {status === "CONFIRMED" || status === "COMPLETED" ? "Đã xác nhận" : status === "REJECTED" ? "Đã hủy" : "Chờ xác nhận"}
                                    </span>
                                  </div>

                                  <div className="space-y-1 text-xs">
                                    <p className="font-extrabold text-foreground text-sm leading-snug">{titleVal}</p>
                                    <div className="bg-muted/40 p-2.5 rounded-xl space-y-1 text-[11px] font-medium border border-border/30 mt-2">
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

                                  {status === "PENDING" && actionId ? (
                                    <div className="flex gap-2 pt-1">
                                      <Button
                                        size="sm"
                                        className="h-8 text-xs font-bold rounded-xl flex-1 gap-1 cursor-pointer"
                                        onClick={async () => {
                                          try {
                                            await confirmAction(actionId);
                                            setRecoveryActionIds((prev) => ({ ...prev, [actionId]: false }));
                                          } catch (err: unknown) {
                                            if (isJiraRecoveryError(err)) {
                                              setRecoveryActionIds((prev) => ({ ...prev, [actionId]: true }));
                                            }
                                          }
                                        }}
                                        disabled={isConfirming || isRejecting || isCourseReadonly}
                                      >
                                        {recoveryActionIds[actionId] ? <RotateCw size={14} className={isConfirming ? "animate-spin" : ""} /> : <CheckCircle size={14} />}
                                        {recoveryActionIds[actionId] ? "Thử lại" : "Xác nhận"}
                                      </Button>
                                      <Button size="sm" variant="outline" className="h-8 text-xs font-bold rounded-xl gap-1 cursor-pointer disabled:opacity-50" onClick={() => rejectAction(actionId)} disabled={isConfirming || isRejecting || isCourseReadonly}>
                                        <XCircle size={14} /> Hủy
                                      </Button>
                                    </div>
                                  ) : status === "CONFIRMED" || status === "COMPLETED" ? (
                                    <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                                      Đã xác nhận tạo Task thành công!
                                    </div>
                                  ) : (
                                    <div className="text-xs font-semibold text-muted-foreground bg-muted p-2 rounded-xl">
                                      Đã hủy bỏ hành động này.
                                    </div>
                                  )}
                                </div>
                              );
                          })()}

                          {/* Render Artifact Download Buttons */}
                          {typeof msg.generatedArtifact === 'string' && msg.generatedArtifact && (
                            <div className="p-3 bg-card border border-border rounded-xl flex items-center justify-between shadow-sm mt-2">
                              <span className="text-xs font-bold flex items-center gap-2 text-foreground">
                                <Download size={14} className="text-primary" />
                                Tài liệu Artifact
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 rounded-lg"
                                onClick={() => handleDownloadArtifact(String(msg.generatedArtifact))}
                                disabled={!!downloadingArtifacts[String(msg.generatedArtifact)]}
                              >
                                {downloadingArtifacts[String(msg.generatedArtifact)] ? <Loader2 size={14} className="animate-spin mr-1" /> : <Download size={14} className="mr-1" />}
                                Tải xuống
                              </Button>
                            </div>
                          )}

                          {/* Render Job Reference Status */}
                          {Boolean(msg.jobReference) && (() => {
                            const jobRef = msg.jobReference as { status?: string };
                            const statusStr = String(jobRef?.status || "");
                            return (
                              <div className="mt-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${statusStr === 'COMPLETED' ? "bg-emerald-500/15 text-emerald-600" :
                                  statusStr === 'FAILED' ? "bg-destructive/15 text-destructive" :
                                    "bg-amber-500/15 text-amber-600 animate-pulse"
                                  }`}>
                                  {['PENDING', 'RUNNING', 'WAITING_RETRY'].includes(statusStr) && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                                  Trạng thái hệ thống: {statusStr}
                                </span>
                              </div>
                            );
                          })()}

                          {/* Suggested Followups */}
                          {Array.isArray(msg.suggestedFollowups) && msg.suggestedFollowups.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {(msg.suggestedFollowups as string[]).map((followup: string, idx: number) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    if (selectedConversationId) {
                                      setOptimisticMessage(followup);
                                      sendMessage({ conversationId: selectedConversationId, payload: { content: followup } }).catch((e: unknown) => {
                                        console.error(e);
                                        setOptimisticMessage(null);
                                      }).finally(() => setOptimisticMessage(null));
                                    }
                                  }}
                                  disabled={isSending || isCourseReadonly}
                                  className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-full transition-colors text-left disabled:opacity-50 disabled:pointer-events-none"
                                >
                                  {followup}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}

                {/* Render Optimistic Message */}
                {optimisticMessage && (
                  <div className="flex gap-3 flex-row-reverse animate-in fade-in zoom-in duration-300">
                    <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                      <User size={16} />
                    </div>
                    <div className="max-w-[75%] space-y-2 items-end">
                      <div className="p-4 rounded-2xl text-sm bg-primary text-primary-foreground rounded-tr-sm opacity-70 selection:bg-white/30 selection:text-white">
                        {optimisticMessage}
                      </div>
                    </div>
                  </div>
                )}

                {isSending && (
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="p-4 rounded-2xl bg-muted rounded-tl-sm flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-medium">AI đang gõ...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Read-Only Notice for Ended Course */}
              {isCourseReadonly && (
                <div className="mx-4 my-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold flex items-center gap-2.5 shadow-sm shrink-0">
                  <AlertTriangle size={16} className="shrink-0 text-amber-600 dark:text-amber-500" />
                  <span>Khóa học đã kết thúc. Chế độ chỉ xem (Read-Only), chức năng nhắn tin AI đã bị khóa.</span>
                </div>
              )}

              <div className="p-4 bg-background/50 border-t border-border/50 shrink-0">
                <div className="relative flex items-end gap-2">
                  <Textarea
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={
                      isSending ||
                      isCourseReadonly ||
                      ['PENDING', 'RUNNING', 'WAITING_RETRY'].includes(conversationDetail?.messages?.[conversationDetail.messages.length - 1]?.jobReference?.status || '')
                    }
                    placeholder={isCourseReadonly ? "Khóa học đã kết thúc (Chế độ chỉ xem)..." : "Gõ tin nhắn cho AI... (Enter để gửi)"}
                    className="min-h-[60px] max-h-[150px] resize-none rounded-2xl bg-background border-border/50 pr-12 custom-scrollbar disabled:opacity-60"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={
                      isSending ||
                      isCourseReadonly ||
                      !messageInput.trim() ||
                      ['PENDING', 'RUNNING', 'WAITING_RETRY'].includes(conversationDetail?.messages?.[conversationDetail.messages.length - 1]?.jobReference?.status || '')
                    }
                    size="icon"
                    className="absolute right-2 bottom-2 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-50"
                  >
                    <Send size={18} className={messageInput.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm font-medium p-6 text-center space-y-4 flex-col">
            <div className="p-4 rounded-full bg-primary/10">
              <MessageSquare size={32} className="text-primary" />
            </div>
            <p>Chọn một hội thoại bên trái hoặc tạo mới để bắt đầu trò chuyện</p>
          </div>
        )}
      </Card>
    </div>
  );
}
