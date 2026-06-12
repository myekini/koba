import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";

import { OverviewTab } from "./tabs/overview-tab";
import { CoachTab } from "./tabs/coach-tab";
import { GoalsTab } from "./tabs/goals-tab";
import { InsightsTab } from "./tabs/insights-tab";
import { SettingsTab } from "./tabs/settings-tab";

interface SmartMoneyViewProps {
  onNavigate: () => void;
}

type TabType = "overview" | "coach" | "goals" | "insights" | "settings";

const tabs: { id: TabType; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "coach", label: "Coach" },
  { id: "goals", label: "Goals" },
  { id: "insights", label: "Insights" },
  { id: "settings", label: "Settings" },
];

export function SmartMoneyView({ onNavigate }: SmartMoneyViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute inset-0 flex flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950"
    >
      {/* Header */}
      <header className="flex shrink-0 items-center gap-2 border-b border-zinc-200/70 bg-white/90 px-3 py-3 backdrop-blur-lg dark:border-zinc-800/70 dark:bg-zinc-900/90">
        <button
          onClick={onNavigate}
          className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
          aria-label="Back to home"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          KOBA
        </h1>
      </header>

      {/* Tab bar */}
      <div className="shrink-0 border-b border-zinc-200/70 bg-white dark:border-zinc-800/70 dark:bg-zinc-900 select-none">
        <div className="no-scrollbar flex overflow-x-auto px-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 px-3.5 py-3 text-sm transition-colors cursor-pointer ${
                  isActive
                    ? "font-semibold text-zinc-900 dark:text-zinc-50"
                    : "font-medium text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                }`}
              >
                {tab.label}
                {isActive && (
                  <motion.span
                    layoutId="smart-money-tab"
                    className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="h-full w-full"
          >
            {activeTab === "overview" && (
              <OverviewTab onNavigateChat={() => setActiveTab("coach")} />
            )}
            {activeTab === "coach" && <CoachTab />}
            {activeTab === "goals" && <GoalsTab />}
            {activeTab === "insights" && (
              <InsightsTab onNavigateChat={() => setActiveTab("coach")} />
            )}
            {activeTab === "settings" && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
