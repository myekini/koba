"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

import { SmartMoneyProvider, useSmartMoney } from "@/lib/smart-money-context";
import { StatusBar } from "@/components/layout/status-bar";
import { BottomNav, ViewType } from "@/components/layout/bottom-nav";
import { HomeView } from "@/components/views/home-view";
import { SmartMoneyView } from "@/components/views/smart-money-view/smart-money-view";

export default function Page() {
  return (
    <SmartMoneyProvider>
      <AppShell />
    </SmartMoneyProvider>
  );
}

// Full-bleed app on phones; centered device frame on desktop so the mobile
// feature can be reviewed on a laptop as it would ship in the UBA app.
function AppShell() {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const { state, toggleSetting } = useSmartMoney();
  const isDark = state.settings.darkMode;

  return (
    <div
      className={`${isDark ? "dark" : ""} min-h-dvh w-full bg-zinc-100 dark:bg-zinc-950 transition-colors duration-300 lg:flex lg:items-center lg:justify-center lg:p-6`}
    >
      <div className="relative flex flex-col items-center lg:gap-3 w-full lg:w-auto">
        <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300 lg:h-[860px] lg:max-h-[94vh] lg:w-[412px] lg:rounded-[44px] lg:border-[10px] lg:border-zinc-900 lg:shadow-2xl">
          {/* Simulated status bar — desktop frame only; real phones have their own */}
          <div className="hidden lg:block">
            <StatusBar />
          </div>

          <div className="relative flex-1 overflow-hidden pt-[env(safe-area-inset-top)] lg:pt-0">
            <AnimatePresence mode="wait">
              {currentView === "home" ? (
                <HomeView key="home" onNavigate={() => setCurrentView("smartmoney")} />
              ) : (
                <SmartMoneyView key="smartmoney" onNavigate={() => setCurrentView("home")} />
              )}
            </AnimatePresence>
          </div>

          <BottomNav currentView={currentView} onNavigate={setCurrentView} />
        </div>

        {/* Desktop-only theme toggle below the frame */}
        <button
          onClick={() => toggleSetting("darkMode")}
          className="hidden lg:flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        >
          {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          {isDark ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </div>
  );
}
