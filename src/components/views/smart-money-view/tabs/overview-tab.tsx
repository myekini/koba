import React from "react";
import { MessageSquare, TrendingUp } from "lucide-react";
import { useSmartMoney } from "@/lib/smart-money-context";
import { formatNaira } from "@/lib/utils";

interface OverviewTabProps {
  onNavigateChat: () => void;
}

export function OverviewTab({ onNavigateChat }: OverviewTabProps) {
  const { state, derived } = useSmartMoney();
  const food = state.monthlySpend.june.Food;
  const foodPrev = state.monthlySpend.may.Food;
  const foodDelta = Math.round(((food - foodPrev) / foodPrev) * 100);

  const score = derived.wellnessScore;
  const circumference = 2 * Math.PI * 15.9155;

  return (
    <div className="no-scrollbar h-full space-y-4 overflow-y-auto p-4 pb-8">
      {/* Totals */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Total across {state.accounts.length} UBA accounts
        </p>
        <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
          {formatNaira(derived.totalBalance, { decimals: true })}
        </p>

        <div className="mt-4 grid grid-cols-3 divide-x divide-zinc-200 rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {[
            { label: "Income", value: `+${formatNaira(derived.income)}`, tone: "text-emerald-600 dark:text-emerald-400" },
            { label: "Spent", value: `−${formatNaira(derived.totalSpent)}`, tone: "text-zinc-900 dark:text-zinc-50" },
            { label: "Saved", value: `+${formatNaira(derived.savedThisMonth)}`, tone: "text-emerald-600 dark:text-emerald-400" },
          ].map((item) => (
            <div key={item.label} className="px-2 py-3 text-center">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.label}</p>
              <p className={`mt-0.5 text-sm font-semibold tabular-nums ${item.tone}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Wellness score */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Financial wellness
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              Improving — saved more than last month
            </p>
          </div>
          <div className="relative flex h-16 w-16 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18" cy="18" r="15.9155" fill="none" strokeWidth="3"
                className="stroke-zinc-100 dark:stroke-zinc-800"
              />
              <circle
                cx="18" cy="18" r="15.9155" fill="none" strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
                className="stroke-primary transition-all duration-700"
              />
            </svg>
            <span className="absolute text-base font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {score}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            {
              label: "Savings rate",
              value: `${Math.round(derived.savingsRate * 100)}%`,
            },
            {
              label: "Budget used",
              value: `${Math.round(derived.budgetUtilization * 100)}%`,
            },
            {
              label: "Goals on track",
              value: `${derived.goalsOnTrack}/${state.goals.length}`,
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl bg-zinc-50 px-3 py-3 dark:bg-zinc-950"
            >
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{metric.label}</p>
              <p className="mt-1 text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Coach insight */}
      <section className="rounded-3xl bg-primary p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
          KOBA insight
        </p>
        <p className="mt-2 text-sm leading-relaxed">
          You&apos;ve spent <span className="font-semibold">{formatNaira(food)} on food</span>{" "}
          this month — {foodDelta}% above May. Cutting back gets your Vacation Fund
          there three weeks earlier.
        </p>
        <button
          onClick={onNavigateChat}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-primary transition-transform active:scale-[0.98] cursor-pointer"
        >
          <MessageSquare className="h-4 w-4" />
          Ask KOBA
        </button>
      </section>
    </div>
  );
}
