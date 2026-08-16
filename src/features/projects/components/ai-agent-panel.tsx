"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, User, Send, Plus, Loader2, MessageSquare, Clock, Download, CheckCircle, XCircle } from "lucide-react";
import {
  useConversations,
  useConversation,
  useCreateConversation,
  useSendMessage,
  useConfirmPendingAction,
  useRejectPendingAction,
  useDownloadArtifact
} from "@/features/lecturer/hooks/useAiAgent";
import { Textarea } from "@/components/ui/textarea";
import { format, addHours } from "date-fns";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AiAgentPanel(props: { projectId?: string }) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [optimisticMessage, setOptimisticMessage] = useState<string | null>(null);

  const { data: conversationsData, isLoading: isLoadingConversations } = useConversations();
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
      const res = await createConversation({ title: "New Conversation" });
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
      await sendMessage({ conversationId: selectedConversationId, payload: { content } });
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
          ) : !conversationsData?.items?.length ? (
            <div className="text-center text-sm text-muted-foreground mt-4">Chưa có hội thoại nào</div>
          ) : (
            conversationsData.items.map(conv => (
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
          )}
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
                      if (msg.role === 'SYSTEM' || (msg as any).role === 'TOOL') return false;
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
                          {msg.pendingAction && msg.pendingAction.status === 'PENDING' && (
                            <div className="p-3 bg-card border border-border rounded-xl shadow-sm mt-2">
                              <span className="text-xs font-bold flex items-center gap-2 text-foreground mb-2">
                                <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                                Đề xuất hành động: {msg.pendingAction.actionType}
                              </span>
                              <p className="text-xs text-muted-foreground mb-3">{msg.pendingAction.description}</p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="h-8 text-success hover:bg-success/20 rounded-lg" onClick={() => confirmAction(msg.pendingAction!.id)} disabled={isConfirming || isRejecting}>
                                  <CheckCircle size={14} className="mr-1" /> Duyệt
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 text-destructive hover:bg-destructive/20 rounded-lg" onClick={() => rejectAction(msg.pendingAction!.id)} disabled={isConfirming || isRejecting}>
                                  <XCircle size={14} className="mr-1" /> Hủy
                                </Button>
                              </div>
                            </div>
                          )}

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
