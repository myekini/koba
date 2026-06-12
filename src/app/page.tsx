"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

import { SmartMoneyProvider, useSmartMoney } from "@/lib/smart-money-context";
import { StatusBar } from "@/components/layout/status-bar";
import { BottomNav, ViewType } from "@/components/layout/bottom-nav";
import { HomeView } from "@/components/views/home-view";
import { SmartMoneyView } from "@/components/views/smart-money-view/smart-money-view";
import { HomeView as InkHomeView } from "@/components/illustrative/home-view";
import { SmartMoneyView as InkSmartMoneyView } from "@/components/illustrative/smart-money-view";

export default function Page() {
  return (
    <SmartMoneyProvider>
      <AppShell />
    </SmartMoneyProvider>
  );
}

// Full-bleed app on phones; centered device frame on desktop so the mobile
// feature can be reviewed on a laptop as it would ship in the UBA app.
// Two design variants render from the same wired state: "classic" (UBA red)
// and "illustrative" (the Stitch redesign). Both support dark mode. Switch
// via the bar at the top of the app or with ?design=classic|stitch.
function AppShell() {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const { state, toggleSetting, setDesign } = useSmartMoney();
  const isInk = state.design === "illustrative";
  const isDark = state.settings.darkMode;

  return (
    <div
      className={`${isDark ? "dark" : ""} min-h-dvh w-full bg-zinc-100 dark:bg-zinc-950 transition-colors duration-300 lg:flex lg:items-center lg:justify-center lg:p-6`}
    >
      <div
        className={`relative mx-auto flex h-dvh w-full flex-col overflow-hidden transition-colors duration-300 lg:h-[860px] lg:max-h-[94vh] lg:w-[412px] lg:rounded-[44px] lg:border-[10px] lg:border-zinc-900 lg:shadow-2xl ${
          isInk
            ? "bg-paper text-ink"
            : "bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50"
        }`}
      >
        {/* Simulated status bar — desktop frame only; real phones have their own */}
        <div className="hidden lg:block">
          <StatusBar />
        </div>

        {/* Design + theme switcher, always visible at the top */}
        <div
          className={`flex shrink-0 items-center justify-center gap-2.5 px-4 pb-1.5 pt-[max(env(safe-area-inset-top),0.5rem)] lg:pt-0 ${
            isInk ? "font-ink" : ""
          }`}
        >
          <div
            className={`flex rounded-full border p-0.5 ${
              isInk
                ? "border-ink/15 bg-white dark:bg-zinc-900"
                : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            }`}
          >
            {(["classic", "illustrative"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDesign(d)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                  state.design === d
                    ? isInk
                      ? "bg-ink text-paper"
                      : "bg-primary text-white"
                    : isInk
                      ? "text-ink/50 hover:text-ink"
                      : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                {d === "illustrative" ? "Stitch" : "Classic"}
              </button>
            ))}
          </div>
          <button
            onClick={() => toggleSetting("darkMode")}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors cursor-pointer ${
              isInk
                ? "border-ink/15 bg-white text-ink/60 hover:text-ink dark:bg-zinc-900"
                : "border-zinc-200 bg-white text-zinc-500 hover:text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {currentView === "home" ? (
              isInk ? (
                <InkHomeView key="ink-home" onNavigate={() => setCurrentView("smartmoney")} />
              ) : (
                <HomeView key="home" onNavigate={() => setCurrentView("smartmoney")} />
              )
            ) : isInk ? (
              <InkSmartMoneyView key="ink-koba" onNavigate={() => setCurrentView("home")} />
            ) : (
              <SmartMoneyView key="koba" onNavigate={() => setCurrentView("home")} />
            )}
          </AnimatePresence>
        </div>

        <BottomNav
          currentView={currentView}
          onNavigate={setCurrentView}
          variant={isInk ? "ink" : "classic"}
        />
      </div>
    </div>
  );
}
