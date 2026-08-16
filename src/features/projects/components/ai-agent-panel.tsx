"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, User, Send, Plus, Loader2, MessageSquare, Clock, Download, CheckCircle, XCircle, Sparkles } from "lucide-react";
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AiAgentPanel(props: { projectId?: string }) {
  const params = useParams();
  const activeCourseId = typeof params?.courseId === "string" ? params.courseId : undefined;

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [optimisticMessage, setOptimisticMessage] = useState<string | null>(null);

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
            disabled={isCreating}
            className="w-full mt-4 font-bold rounded-xl bg-primary hover:bg-primary/90"
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
            const convItems = (conversationsData?.items || []).filter(conv =>
              activeCourseId ? conv.courseId === activeCourseId : !conv.courseId
            );
            return convItems.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground mt-4">Chưa có hội thoại nào trong không gian này</div>
            ) : (
              convItems.map(conv => (
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
            <CardHeader className="border-b border-border/50 bg-background/50 py-4 shrink-0">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Bot className="text-primary" size={20} />
                {conversationDetail?.title || "Đang tải..."}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {isLoadingMessages ? (
                  <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
                ) : !conversationDetail?.messages?.length ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                    <Bot size={48} className="opacity-20" />
                    <p className="text-sm font-medium">Bắt đầu trò chuyện với SAGA AI</p>
                  </div>
                ) : (
                  conversationDetail.messages
                    .filter(msg => {
                      const text = msg.content || msg.text || "";
                      if (msg.role === 'SYSTEM' || (msg as unknown as { role?: string }).role === 'TOOL') return false;
                      if (/^[a-zA-Z_]+:(COMPLETED|PENDING|STARTED)$/.test(text.trim())) return false;
                      return true;
                    })
                    .map(msg => (
                      <div key={msg.id} className={`flex gap-3 ${msg.role === 'USER' ? 'flex-row-reverse' : ''}`}>
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
                            {msg.text || msg.content}
                          </div>

                          {/* Render Pending Action Buttons */}
                          {(() => {
                            const pendingAction = msg.pendingAction || (msg as any).pending_action || (msg as any).proposedAction || (msg as any).action;
                            if (!pendingAction) return null;

                            const actionId = pendingAction.id || pendingAction.actionId;
                            const status = (pendingAction.status || "PENDING").toUpperCase();
                            const description = pendingAction.description || pendingAction.summary || pendingAction.title || "Tạo Task mới trên Jira";
                            const actionType = pendingAction.actionType || pendingAction.type || pendingAction.action_type;

                            return (
                              <div className="p-3.5 bg-card border border-primary/30 rounded-2xl shadow-sm mt-2 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold flex items-center gap-1.5 text-primary">
                                    <Sparkles size={14} />
                                    Đề xuất hành động: <span className="uppercase">{actionType || "TASK_CREATE"}</span>
                                  </span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status === "CONFIRMED" || status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-600" : status === "REJECTED" ? "bg-muted text-muted-foreground" : "bg-amber-500/10 text-amber-600"}`}>
                                    {status === "CONFIRMED" || status === "COMPLETED" ? "Đã xác nhận" : status === "REJECTED" ? "Đã hủy" : "Chờ xác nhận"}
                                  </span>
                                </div>
                                <p className="text-xs text-foreground font-medium">{description}</p>
                                {status === "PENDING" && actionId ? (
                                  <div className="flex gap-2 pt-1">
                                    <Button size="sm" className="h-8 text-xs font-bold rounded-xl flex-1 gap-1 cursor-pointer" onClick={() => confirmAction(actionId)} disabled={isConfirming || isRejecting}>
                                      <CheckCircle size={14} /> Xác nhận
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-8 text-xs font-bold rounded-xl gap-1 cursor-pointer" onClick={() => rejectAction(actionId)} disabled={isConfirming || isRejecting}>
                                      <XCircle size={14} /> Hủy
                                    </Button>
                                  </div>
                                ) : status === "CONFIRMED" || status === "COMPLETED" ? (
                                  <p className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle size={14} /> Đã tạo Task thành công trên Jira!</p>
                                ) : (
                                  <p className="text-xs font-medium text-muted-foreground">Đã hủy bỏ đề xuất tạo Task này.</p>
                                )}
                              </div>
                            );
                          })()}

                          {/* Render Artifact Download Buttons */}
                          {msg.generatedArtifact && (
                            <div className="p-3 bg-card border border-border rounded-xl flex items-center justify-between shadow-sm mt-2">
                              <span className="text-xs font-bold flex items-center gap-2 text-foreground">
                                <Download size={14} className="text-primary" />
                                Tài liệu Artifact
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 rounded-lg"
                                onClick={() => handleDownloadArtifact(msg.generatedArtifact!)}
                                disabled={downloadingArtifacts[msg.generatedArtifact!]}
                              >
                                {downloadingArtifacts[msg.generatedArtifact!] ? <Loader2 size={14} className="animate-spin mr-1" /> : <Download size={14} className="mr-1" />}
                                Tải xuống
                              </Button>
                            </div>
                          )}

                          {/* Render Job Reference Status */}
                          {msg.jobReference && (
                            <div className="mt-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${msg.jobReference.status === 'COMPLETED' ? "bg-emerald-500/15 text-emerald-600" :
                                msg.jobReference.status === 'FAILED' ? "bg-destructive/15 text-destructive" :
                                  "bg-amber-500/15 text-amber-600 animate-pulse"
                                }`}>
                                {['PENDING', 'RUNNING', 'WAITING_RETRY'].includes(msg.jobReference.status) && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                                Trạng thái hệ thống: {msg.jobReference.status}
                              </span>
                            </div>
                          )}

                          {/* Suggested Followups */}
                          {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {msg.suggestedFollowups.map((followup: string, idx: number) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    if (selectedConversationId) {
                                      setOptimisticMessage(followup);
                                      sendMessage({ conversationId: selectedConversationId, payload: { content: followup } }).catch(e => {
                                        console.error(e);
                                        setOptimisticMessage(null);
                                      }).finally(() => setOptimisticMessage(null));
                                    }
                                  }}
                                  disabled={isSending}
                                  className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-full transition-colors text-left disabled:opacity-50"
                                >
                                  {followup}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                )}

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
                      ['PENDING', 'RUNNING', 'WAITING_RETRY'].includes(conversationDetail?.messages?.[conversationDetail.messages.length - 1]?.jobReference?.status || '')
                    }
                    placeholder="Gõ tin nhắn cho AI... (Enter để gửi)"
                    className="min-h-[60px] max-h-[150px] resize-none rounded-2xl bg-background border-border/50 pr-12 custom-scrollbar"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={
                      isSending ||
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
