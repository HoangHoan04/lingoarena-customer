"use client";

import { AiLiveCallRoom, AiTutorSelector } from "@/components/ai-conversation";
import { mapConversationMessage, mapPersonaToUi } from "@/lib/skill-mappers";
import { conversationService } from "@/services/conversation.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { AiConversationMessage, AiStatusState, AiTutorPersona } from "@/types/ai-conversation";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function AiConversationPage() {
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [personas, setPersonas] = useState<AiTutorPersona[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPersona, setSelectedPersona] = useState<AiTutorPersona | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [status, setStatus] = useState<AiStatusState>("idle");
  const [messages, setMessages] = useState<AiConversationMessage[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const rows = await conversationService.listPersonas();
        const mapped = rows.map(mapPersonaToUi);
        if (!mounted) return;
        setPersonas(mapped);
        setSelectedPersona(mapped[0] || null);
      } catch {
        if (mounted) setPersonas([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const speakText = useCallback((text: string, persona: AiTutorPersona) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setStatus("idle");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = persona.voiceLang;
    utterance.rate = persona.speechRate;
    utterance.pitch = persona.speechPitch;
    utterance.onstart = () => setStatus("speaking");
    utterance.onend = () => setStatus("idle");
    utterance.onerror = () => setStatus("idle");
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleStartCall = async (persona: AiTutorPersona) => {
    if (!isAuthenticated) {
      addToast("Đăng nhập để bắt đầu hội thoại AI.", "info");
      return;
    }
    try {
      const session = await conversationService.startAiSession(persona.id);
      setSelectedPersona(persona);
      setConversationId(session.id);
      setIsInCall(true);
      const mapped = (session.messages || []).map(mapConversationMessage);
      setMessages(mapped);
      const welcome = mapped.find((m) => m.sender === "ai") || {
        id: `welcome-${Date.now()}`,
        sender: "ai" as const,
        content: persona.welcomeMessage,
        translationVi: persona.welcomeMessageVi,
        timestamp: Date.now(),
      };
      if (!mapped.length) setMessages([welcome]);
      speakText(welcome.content, persona);
    } catch (err: any) {
      addToast(err?.message || "Không bắt đầu được hội thoại AI.", "error");
    }
  };

  const handleEndCall = async () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (conversationId) {
      await conversationService.closeConversation(conversationId).catch(() => null);
    }
    setIsInCall(false);
    setStatus("idle");
    setConversationId(null);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !conversationId || !selectedPersona) return;
    const userMsg: AiConversationMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setStatus("thinking");
    try {
      await conversationService.postMessage(conversationId, { content: text });
      const convo = await conversationService.getConversation(conversationId);
      setMessages((convo.messages || []).map(mapConversationMessage));
      const lastAi = [...(convo.messages || [])].reverse().find((m) => String(m.senderRole || "").toUpperCase() !== "USER");
      if (lastAi?.content) speakText(lastAi.content, selectedPersona);
      else setStatus("idle");
    } catch (err: any) {
      addToast(err?.message || "Không gửi được tin nhắn.", "error");
      setStatus("idle");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isInCall || !selectedPersona ? (
          personas.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-12 text-center space-y-2">
              <p className="font-black">Chưa có nhân vật AI</p>
              <p className="text-sm text-muted-foreground">Catalog trống cho đến khi quản trị viên kích hoạt persona.</p>
            </div>
          ) : (
            <AiTutorSelector
              personas={personas}
              selectedPersona={selectedPersona || personas[0]}
              onSelectPersona={setSelectedPersona}
              onStartCall={handleStartCall}
            />
          )
        ) : (
          <AiLiveCallRoom
            persona={selectedPersona}
            messages={messages}
            onSendMessage={handleSendMessage}
            onEndCall={handleEndCall}
            status={status}
            onReplayAudio={(text) => speakText(text, selectedPersona)}
          />
        )}
      </div>
    </div>
  );
}
