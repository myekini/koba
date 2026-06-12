import React from "react";
import { ArrowRight, Bot, Goal, Lightbulb } from "lucide-react";
import { useSmartMoney } from "@/lib/smart-money-context";
import { formatNaira } from "@/lib/utils";
import type { InkTabType } from "../smart-money-view";

interface InkOverviewTabProps {
  onNavigateTab: (tab: InkTabType) => void;
}

export function InkOverviewTab({ onNavigateTab }: InkOverviewTabProps) {
  const { state, derived } = useSmartMoney();
  const food = state.monthlySpend.june.Food;
  const foodPrev = state.monthlySpend.may.Food;
  const foodDelta = Math.round(((food - foodPrev) / foodPrev) * 100);

  return (
    <div className="no-scrollbar h-full space-y-4 overflow-y-auto px-5 pb-8 pt-1">
      {/* Balance */}
      <section className="rounded-3xl border-2 border-ink bg-white dark:bg-zinc-900 p-5 shadow-[4px_4px_0_0_var(--color-ink)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
          Total balance
        </p>
        <p className="mt-1.5 text-[32px] font-bold leading-none tracking-tight tabular-nums">
          {formatNaira(derived.totalBalance)}
        </p>
        <p className="mt-2 text-sm font-medium text-ink/50">
          Across {state.accounts.length} UBA accounts · live
        </p>

        <div className="mt-5 grid grid-cols-3 border-t-2 border-ink/5 pt-4">
          {[
            { label: "Income", value: `+${formatNaira(derived.income)}`, tone: "text-emerald-600" },
            { label: "Spent", value: `−${formatNaira(derived.totalSpent)}`, tone: "text-primary" },
            { label: "Saved", value: `+${formatNaira(derived.savedThisMonth)}`, tone: "text-emerald-600" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink/40">
                {item.label}
              </p>
              <p className={`mt-1 text-sm font-bold tabular-nums ${item.tone}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Shortcut chips */}
      <div className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5">
        {[
          { label: "Ask KOBA", icon: Bot, tab: "coach" as const },
          { label: "My Goals", icon: Goal, tab: "goals" as const },
          { label: "Insights", icon: Lightbulb, tab: "insights" as const },
        ].map((chip) => (
          <button
            key={chip.label}
            onClick={() => onNavigateTab(chip.tab)}
            className="flex shrink-0 items-center gap-2 rounded-full border-2 border-ink bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm font-bold transition-transform active:scale-95 cursor-pointer"
          >
            <chip.icon className="h-4.5 w-4.5" />
            {chip.label}
          </button>
        ))}
      </div>

      {/* KOBA AI alert */}
      <section className="rounded-3xl bg-blush p-5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]">KOBA AI</p>
        </div>
        <p className="mt-2.5 text-[15px] font-medium leading-relaxed">
          You spent <strong className="font-bold">{formatNaira(food)} on food</strong>{" "}
          this month — {foodDelta}% above your May average. Cut back and hit your
          Vacation Fund 3 weeks earlier.
        </p>
        <button
          onClick={() => onNavigateTab("coach")}
          className="mt-4 flex items-center gap-1.5 text-sm font-bold text-primary cursor-pointer"
        >
          Ask KOBA <ArrowRight className="h-4 w-4" />
        </button>
      </section>

      {/* Financial health */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold">Financial Health</h3>
        <div className="rounded-3xl border-2 border-ink bg-white dark:bg-zinc-900 p-5 shadow-[4px_4px_0_0_var(--color-ink)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-xl font-bold leading-tight">
                Financial
                <br />
                Wellness
              </h4>
              <p className="mt-1.5 text-sm font-medium text-ink/50">
                Improving — saved more than last month
              </p>
            </div>
            <span className="text-5xl font-bold tabular-nums text-emerald-600">
              {derived.wellnessScore}
            </span>
          </div>

          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${derived.wellnessScore}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {[
              {
                label: "Savings Rate",
                value: `↑ ${Math.round(derived.savingsRate * 100)}%`,
                tone: "text-emerald-600",
              },
              {
                label: "Budget Used",
                value: `${Math.round(derived.budgetUtilization * 100)}%`,
                tone: "text-primary",
              },
              {
                label: "Spending",
                value: formatNaira(derived.totalSpent),
                tone: "text-amber-600",
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border-2 border-ink/8 bg-paper px-3 py-3"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                  {metric.label}
                </p>
                <p className={`mt-1 text-sm font-bold tabular-nums ${metric.tone}`}>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
