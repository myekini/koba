import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { useSmartMoney } from "@/lib/smart-money-context";

export function CoachTab() {
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
    <div className="flex h-full flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Messages */}
      <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
        {state.messages.map((msg) => {
          const isCoach = msg.sender === "coach";
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-end gap-2 ${isCoach ? "justify-start" : "justify-end"}`}
            >
              {isCoach && <CoachAvatar />}
              <div className="flex max-w-[80%] flex-col gap-1">
                <div
                  className={`px-4 py-3 text-sm leading-relaxed ${
                    isCoach
                      ? "rounded-2xl rounded-bl-md border border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                      : "rounded-2xl rounded-br-md bg-primary text-white"
                  }`}
                >
                  {msg.text}
                </div>
                <span
                  className={`px-1 text-[11px] text-zinc-400 dark:text-zinc-500 ${
                    isCoach ? "text-left" : "text-right"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </motion.div>
          );
        })}

        {state.coachTyping && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-2"
          >
            <CoachAvatar />
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-4 py-3.5 dark:border-zinc-800 dark:bg-zinc-900">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400 dark:bg-zinc-500"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies + input */}
      <div className="shrink-0 border-t border-zinc-200/70 bg-white p-4 dark:border-zinc-800/70 dark:bg-zinc-900">
        <AnimatePresence>
          {quickReplies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="no-scrollbar mb-3 flex gap-2 overflow-x-auto"
            >
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleSend(reply)}
                  className="shrink-0 whitespace-nowrap rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-medium text-zinc-700 transition-colors hover:border-primary/40 hover:text-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 cursor-pointer"
                >
                  {reply}
                </button>
              ))}
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
            className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-3 pl-4 pr-12 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-primary/50 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          />
          <button
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim() || state.coachTyping}
            aria-label="Send message"
            className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition-all hover:brightness-110 active:scale-95 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CoachAvatar() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
      K
    </span>
  );
}
