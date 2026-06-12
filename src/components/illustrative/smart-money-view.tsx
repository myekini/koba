import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Bell } from "lucide-react";

import { InkOverviewTab } from "./tabs/overview-tab";
import { InkCoachTab } from "./tabs/coach-tab";
import { InkGoalsTab } from "./tabs/goals-tab";
import { InkInsightsTab } from "./tabs/insights-tab";
import { InkSettingsTab } from "./tabs/settings-tab";

interface SmartMoneyViewProps {
  onNavigate: () => void;
}

export type InkTabType = "overview" | "coach" | "goals" | "insights" | "settings";

const tabs: { id: InkTabType; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "coach", label: "Coach" },
  { id: "goals", label: "Goals" },
  { id: "insights", label: "Insights" },
  { id: "settings", label: "Settings" },
];

export function SmartMoneyView({ onNavigate }: SmartMoneyViewProps) {
  const [activeTab, setActiveTab] = useState<InkTabType>("overview");

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute inset-0 flex flex-col overflow-hidden bg-graph font-ink text-ink"
    >
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between px-5 pb-2 pt-4">
        <button
          onClick={onNavigate}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ink/5 cursor-pointer"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-5.5 w-5.5" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">KOBA</h1>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ink/5 cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        </button>
      </header>

      {/* Pill tabs */}
      <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-5 py-3 select-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors cursor-pointer ${
                isActive
                  ? "bg-primary text-white"
                  : "border-2 border-ink/10 bg-white text-ink/60 hover:border-ink/25 dark:bg-zinc-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
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
            {activeTab === "overview" && <InkOverviewTab onNavigateTab={setActiveTab} />}
            {activeTab === "coach" && <InkCoachTab />}
            {activeTab === "goals" && <InkGoalsTab />}
            {activeTab === "insights" && <InkInsightsTab onNavigateTab={setActiveTab} />}
            {activeTab === "settings" && <InkSettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
