import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send } from "lucide-react";
import { useSmartMoney } from "@/lib/smart-money-context";

export function InkCoachTab() {
  const { state, sendToCoach } = useSmartMoney();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const lastMessage = state.messages[state.messages.length - 1];
  const quickReplies =
    !state.coachTyping && lastMessage?.sender === "coach"
      ? lastMessage.quickReplies ?? []
      : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages, state.coachTyping]);

  const handleSend = (text: string) => {
    if (!text.trim() || state.coachTyping) return;
    sendToCoach(text);
    setInputValue("");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Title */}
      <div className="shrink-0 px-5 pb-3">
        <h2 className="text-2xl font-bold tracking-tight">KOBA Coach</h2>
        <p className="mt-1 text-sm font-medium text-ink/50">
          Your personal money guide, powered by UBA AI.
        </p>
      </div>

      {/* Messages */}
      <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-3">
        {state.messages.map((msg) => {
          const isCoach = msg.sender === "coach";
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-end gap-2.5 ${isCoach ? "justify-start" : "justify-end"}`}
            >
              {isCoach && <InkCoachAvatar />}
              <div
                className={`max-w-[80%] px-4 py-3 text-sm font-medium leading-relaxed ${
                  isCoach
                    ? "rounded-2xl rounded-bl-md bg-ink text-paper"
                    : "rounded-2xl rounded-br-md bg-sun text-zinc-900"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          );
        })}

        {state.coachTyping && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-2.5"
          >
            <InkCoachAvatar />
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-ink px-4 py-3.5">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-paper/70"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested + input */}
      <div className="shrink-0 px-5 pb-4 pt-2">
        <AnimatePresence>
          {quickReplies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mb-3"
            >
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ink/40">
                Suggested
              </p>
              <div className="no-scrollbar flex gap-2 overflow-x-auto">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className="shrink-0 whitespace-nowrap rounded-full border-2 border-ink/15 bg-white px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-ink cursor-pointer dark:bg-zinc-900"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask KOBA anything…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
            className="w-full rounded-full border-2 border-ink bg-white dark:bg-zinc-900 py-3.5 pl-5 pr-14 text-sm font-medium text-ink placeholder:text-ink/40 focus:outline-none"
          />
          <button
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim() || state.coachTyping}
            aria-label="Send message"
            className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-all hover:brightness-110 active:scale-95 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function InkCoachAvatar() {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-ink bg-white dark:bg-zinc-900">
      <Bot className="h-5 w-5" />
    </span>
  );
}
