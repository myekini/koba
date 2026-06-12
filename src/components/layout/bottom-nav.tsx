import React from "react";
import { motion } from "framer-motion";
import { Home, ArrowRightLeft, CreditCard, Sparkles } from "lucide-react";

export type ViewType = "home" | "smartmoney";

interface BottomNavProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  variant?: "classic" | "ink";
}

export function BottomNav({ currentView, onNavigate, variant = "classic" }: BottomNavProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "transfers", label: "Transfers", icon: ArrowRightLeft, disabled: true },
    { id: "cards", label: "Cards", icon: CreditCard, disabled: true },
    { id: "smartmoney", label: "KOBA", icon: Sparkles },
  ];

  const isInk = variant === "ink";

  return (
    <nav
      className={`shrink-0 px-4 pt-2 pb-[max(env(safe-area-inset-bottom),0.75rem)] lg:pb-6 z-40 select-none ${
        isInk
          ? "border-t-2 border-ink/10 bg-paper font-ink"
          : "border-t border-zinc-200/70 bg-white/90 backdrop-blur-lg dark:border-zinc-800/70 dark:bg-zinc-900/90"
      }`}
    >
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id && !item.disabled;
          return (
            <button
              key={item.id}
              disabled={item.disabled}
              onClick={() => !item.disabled && onNavigate(item.id as ViewType)}
              className={`relative flex min-h-12 min-w-16 flex-col items-center justify-center gap-1 transition-colors ${
                item.disabled
                  ? isInk
                    ? "cursor-not-allowed text-ink/25"
                    : "cursor-not-allowed text-zinc-300 dark:text-zinc-700"
                  : isActive
                    ? isInk
                      ? "text-ink cursor-pointer"
                      : "text-primary cursor-pointer"
                    : isInk
                      ? "cursor-pointer text-ink/40 hover:text-ink"
                      : "cursor-pointer text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-indicator"
                  className={`absolute -top-2 h-0.5 w-8 rounded-full ${
                    isInk ? "bg-ink" : "bg-primary"
                  }`}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
              <span
                className={`text-[11px] tracking-tight ${
                  isInk ? (isActive ? "font-bold" : "font-semibold") : "font-medium"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
