import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  PiggyBank,
  TrendingUp,
} from "lucide-react";
import { MONTH_LABELS, MonthKey, SpendCategoryKey } from "@/lib/mock-data";
import { useSmartMoney } from "@/lib/smart-money-context";
import { formatNaira } from "@/lib/utils";
import type { InkTabType } from "../smart-money-view";

interface InkInsightsTabProps {
  onNavigateTab: (tab: InkTabType) => void;
}

const months: MonthKey[] = ["may", "june"]; // chronological for the stepper

const barColors: Record<SpendCategoryKey, string> = {
  Food: "bg-primary",
  Transport: "bg-amber-500",
  Utilities: "bg-sky-500",
  Shopping: "bg-ink",
};

export function InkInsightsTab({ onNavigateTab }: InkInsightsTabProps) {
  const { state, derived } = useSmartMoney();
  const [monthIndex, setMonthIndex] = useState(months.length - 1);

  const month = months[monthIndex];
  const spend = state.monthlySpend[month];
  const categories = Object.keys(spend) as SpendCategoryKey[];
  const totalSpent = categories.reduce((sum, key) => sum + spend[key], 0);

  const food = state.monthlySpend.june.Food;
  const foodPrev = state.monthlySpend.may.Food;
  const foodDelta = Math.round(((food - foodPrev) / foodPrev) * 100);
  const vacation = state.goals.find((g) => g.id === "goal-vacation");

  return (
    <div className="no-scrollbar h-full space-y-4 overflow-y-auto px-5 pb-8 pt-1">
      <h2 className="text-2xl font-bold tracking-tight">Insights</h2>

      {/* Month stepper */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setMonthIndex((i) => Math.max(0, i - 1))}
          disabled={monthIndex === 0}
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink/15 bg-white transition-colors hover:border-ink disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed dark:bg-zinc-900"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
        </button>
        <span className="min-w-32 rounded-full border-2 border-ink bg-white dark:bg-zinc-900 px-5 py-2 text-center text-sm font-bold">
          {MONTH_LABELS[month]}
        </span>
        <button
          onClick={() => setMonthIndex((i) => Math.min(months.length - 1, i + 1))}
          disabled={monthIndex === months.length - 1}
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink/15 bg-white transition-colors hover:border-ink disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed dark:bg-zinc-900"
          aria-label="Next month"
        >
          <ChevronRight className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Spending breakdown */}
      <section className="rounded-3xl border-2 border-ink bg-white dark:bg-zinc-900 p-5 shadow-[4px_4px_0_0_var(--color-ink)]">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-bold">Spending Breakdown</h3>
          <span className="text-base font-bold tabular-nums">
            {formatNaira(totalSpent)}
          </span>
        </div>

        <div className="mt-5 space-y-4">
          {categories.map((category) => {
            const amount = spend[category];
            const share = Math.round((amount / totalSpent) * 100);
            const limit = state.budgetLimits[category];
            const used = Math.min(100, Math.round((amount / limit) * 100));
            return (
              <div key={category} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-bold">
                    <span className={`h-2.5 w-2.5 rounded-full ${barColors[category]}`} />
                    {category}
                  </span>
                  <span className="font-bold tabular-nums text-ink/60">{share}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-ink/8">
                  <motion.div
                    className={`h-full rounded-full ${barColors[category]}`}
                    initial={false}
                    animate={{ width: `${used}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </div>
                <div className="flex justify-between text-xs font-semibold tabular-nums text-ink/40">
                  <span>
                    {formatNaira(amount)} of {formatNaira(limit)} limit
                  </span>
                  <span className={used >= 85 ? "text-primary" : ""}>{used}% used</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Food spike */}
      <section className="rounded-3xl bg-blush p-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
            <TrendingUp className="h-4.5 w-4.5 text-primary" />
          </span>
          <h4 className="text-lg font-bold">Food spending spike</h4>
        </div>
        <p className="mt-3 text-[15px] font-medium leading-relaxed">
          You&apos;ve spent <strong className="font-bold">{foodDelta}% more</strong> on
          Food this month compared to May. Most of it went to weekend dining.
        </p>
        <button
          onClick={() => onNavigateTab("coach")}
          className="mt-4 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-zinc-900 transition-transform active:scale-95 cursor-pointer"
        >
          <MessageSquare className="h-4 w-4" /> Discuss with KOBA
        </button>
      </section>

      {/* Vacation goal nudge */}
      {vacation && (
        <section className="rounded-3xl bg-mint p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
              <PiggyBank className="h-4.5 w-4.5 text-emerald-600" />
            </span>
            <h4 className="text-lg font-bold">Vacation Fund progress</h4>
          </div>
          <p className="mt-3 text-[15px] font-medium leading-relaxed">
            You&apos;re at{" "}
            <strong className="font-bold">{derived.goalPct(vacation)}%</strong> of your{" "}
            {formatNaira(vacation.targetAmount)} target. Keep saving consistently!
          </p>
          <button
            onClick={() => onNavigateTab("goals")}
            className="mt-4 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-zinc-900 transition-transform active:scale-95 cursor-pointer"
          >
            View Goal <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      )}

      {/* Ask AI CTA */}
      <button
        onClick={() => onNavigateTab("coach")}
        className="flex w-full items-center justify-between rounded-full bg-sun py-2 pl-6 pr-2 cursor-pointer transition-transform active:scale-[0.99]"
      >
        <span className="text-base font-bold text-zinc-900">Ask KOBA about my spending</span>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper">
          <ArrowRight className="h-5 w-5" />
        </span>
      </button>
    </div>
  );
}
