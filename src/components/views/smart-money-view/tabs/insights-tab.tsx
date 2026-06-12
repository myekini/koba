import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, UtensilsCrossed, Zap } from "lucide-react";
import { MONTH_LABELS, MonthKey, SpendCategoryKey } from "@/lib/mock-data";
import { useSmartMoney } from "@/lib/smart-money-context";
import { formatNaira } from "@/lib/utils";

interface InsightsTabProps {
  onNavigateChat: () => void;
}

const months: MonthKey[] = ["june", "may"];

export function InsightsTab({ onNavigateChat }: InsightsTabProps) {
  const { state } = useSmartMoney();
  const [month, setMonth] = useState<MonthKey>("june");

  const spend = state.monthlySpend[month];
  const categories = Object.keys(spend) as SpendCategoryKey[];
  const totalSpent = categories.reduce((sum, key) => sum + spend[key], 0);

  const food = state.monthlySpend.june.Food;
  const foodPrev = state.monthlySpend.may.Food;
  const foodDelta = Math.round(((food - foodPrev) / foodPrev) * 100);
  const currentAccount = state.accounts.find((a) => a.type === "Current");

  return (
    <div className="no-scrollbar h-full space-y-4 overflow-y-auto p-4 pb-8">
      {/* Month selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Spending
        </h3>
        <div className="flex rounded-full border border-zinc-200 bg-white p-0.5 dark:border-zinc-800 dark:bg-zinc-900">
          {months.map((key) => (
            <button
              key={key}
              onClick={() => setMonth(key)}
              className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                month === key
                  ? "text-white"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {month === key && (
                <motion.span
                  layoutId="month-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{MONTH_LABELS[key].split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-baseline justify-between">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Total spent · {MONTH_LABELS[month]}
          </p>
          <p className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
            {formatNaira(totalSpent)}
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {categories.map((category) => {
            const amount = spend[category];
            const limit = state.budgetLimits[category];
            const pct = Math.min(100, Math.round((amount / limit) * 100));
            const over = pct >= 85;
            return (
              <div key={category} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {category}
                  </span>
                  <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                    {formatNaira(amount)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <motion.div
                    className={`h-full rounded-full ${over ? "bg-primary" : "bg-zinc-400 dark:bg-zinc-500"}`}
                    initial={false}
                    animate={{ width: `${pct}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </div>
                <div className="flex justify-between text-[11px] tabular-nums text-zinc-400 dark:text-zinc-500">
                  <span>Limit {formatNaira(limit)}</span>
                  <span className={over ? "font-semibold text-primary" : ""}>
                    {pct}% used
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Insight cards */}
      <section className="space-y-3">
        <InsightCard
          icon={<UtensilsCrossed className="h-4.5 w-4.5" />}
          title="Food spending spike"
          when="Today"
          actionLabel="Discuss with KOBA"
          onAction={onNavigateChat}
        >
          You&apos;ve spent{" "}
          <strong className="font-semibold text-zinc-900 dark:text-zinc-50">
            {formatNaira(food)}
          </strong>{" "}
          on food in June — {foodDelta}% above May.
        </InsightCard>

        <InsightCard
          icon={<Zap className="h-4.5 w-4.5" />}
          title="Idle cash detected"
          when="2 days ago"
          actionLabel="Ask KOBA to sweep"
          onAction={onNavigateChat}
        >
          <strong className="font-semibold text-zinc-900 dark:text-zinc-50">
            {formatNaira(currentAccount?.balance ?? 0)}
          </strong>{" "}
          in your Current account isn&apos;t earning interest. A sweep to Savings
          fixes that.
        </InsightCard>
      </section>
    </div>
  );
}

function InsightCard({
  icon,
  title,
  when,
  actionLabel,
  onAction,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  when: string;
  actionLabel: string;
  onAction: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4.5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </span>
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {title}
            </h4>
            <span className="shrink-0 text-[11px] text-zinc-400 dark:text-zinc-500">
              {when}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {children}
          </p>
          <button
            onClick={onAction}
            className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-primary cursor-pointer"
          >
            {actionLabel}
            <MessageSquare className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
