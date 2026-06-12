import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Home,
  MoreHorizontal,
  Plane,
  Plus,
  ShieldPlus,
  X,
  LucideIcon,
} from "lucide-react";
import { SavingGoal } from "@/lib/mock-data";
import { useSmartMoney } from "@/lib/smart-money-context";
import { formatNaira } from "@/lib/utils";

const goalStyles: Record<
  SavingGoal["category"],
  { icon: LucideIcon; tile: string }
> = {
  vacation: { icon: Plane, tile: "bg-sun text-zinc-900" },
  emergency: { icon: ShieldPlus, tile: "bg-blush text-zinc-900 dark:text-ink" },
  house: { icon: Home, tile: "bg-mint text-zinc-900 dark:text-ink" },
};

export function InkGoalsTab() {
  const { state, derived, contributeToGoal } = useSmartMoney();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [contribution, setContribution] = useState(10_000);
  const [justSaved, setJustSaved] = useState(false);

  const selectedGoal = state.goals.find((g) => g.id === selectedGoalId) ?? null;
  const currentAccount = state.accounts.find((a) => a.type === "Current");

  const openGoal = (goal: SavingGoal) => {
    setSelectedGoalId(goal.id);
    setContribution(
      Math.min(10_000, Math.max(0, goal.targetAmount - goal.savedAmount))
    );
    setJustSaved(false);
  };

  const handleConfirmSave = () => {
    if (!selectedGoal || !currentAccount || contribution <= 0) return;
    contributeToGoal(selectedGoal.id, contribution, currentAccount.id);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1600);
  };

  const maxContribution = selectedGoal
    ? Math.max(
        5_000,
        Math.min(
          50_000,
          selectedGoal.targetAmount - selectedGoal.savedAmount,
          currentAccount?.balance ?? 0
        )
      )
    : 50_000;
  const selectedComplete =
    selectedGoal && selectedGoal.savedAmount >= selectedGoal.targetAmount;

  return (
    <div className="relative h-full">
      <div className="no-scrollbar h-full space-y-4 overflow-y-auto px-5 pb-8 pt-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">My Goals</h2>
          <span className="text-sm font-semibold text-ink/50">
            {state.goals.length} Active
          </span>
        </div>

        {/* Status chips */}
        <div className="flex gap-2">
          <span className="rounded-full border-2 border-emerald-500/40 bg-emerald-50 px-3.5 py-1.5 text-sm font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            {derived.goalsOnTrack} On Track
          </span>
          {derived.goalsAtRisk > 0 && (
            <span className="rounded-full border-2 border-primary/30 bg-red-50 px-3.5 py-1.5 text-sm font-bold text-primary dark:bg-red-950/30">
              {derived.goalsAtRisk} At Risk
            </span>
          )}
        </div>

        {/* Goal cards */}
        <div className="space-y-4 pt-1">
          {state.goals.map((goal) => {
            const style = goalStyles[goal.category];
            const Icon = style.icon;
            const pct = derived.goalPct(goal);
            const atRisk = derived.goalStatus(goal) === "at risk";
            const complete = goal.savedAmount >= goal.targetAmount;
            return (
              <button
                key={goal.id}
                onClick={() => openGoal(goal)}
                className="w-full rounded-3xl border-2 border-ink bg-white dark:bg-zinc-900 p-5 text-left shadow-[4px_4px_0_0_var(--color-ink)] transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_var(--color-ink)] cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-ink/15 ${style.tile}`}
                    >
                      <Icon className="h-5.5 w-5.5" strokeWidth={2.2} />
                    </span>
                    <div>
                      <h4 className="text-lg font-bold leading-tight">{goal.name}</h4>
                      <p
                        className={`text-sm font-semibold ${
                          complete
                            ? "text-emerald-600"
                            : atRisk
                              ? "text-primary"
                              : "text-ink/45"
                        }`}
                      >
                        {complete
                          ? "Fully funded"
                          : atRisk
                            ? "Behind schedule"
                            : `Target: ${goal.targetDate}`}
                      </p>
                    </div>
                  </div>
                  <MoreHorizontal className="h-5 w-5 text-ink/40" />
                </div>

                <div className="mt-4 flex justify-between text-sm">
                  <span className="font-bold tabular-nums">
                    {formatNaira(goal.savedAmount)} saved
                  </span>
                  <span className="font-medium tabular-nums text-ink/45">
                    of {formatNaira(goal.targetAmount)}
                  </span>
                </div>
                <div className="mt-2 h-3 w-full overflow-hidden rounded-full border-2 border-ink/10 bg-ink/5">
                  <motion.div
                    className={`h-full rounded-full ${
                      atRisk ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    initial={false}
                    animate={{ width: `${pct}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Add goal */}
        <button className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-ink/30 py-4 text-sm font-bold uppercase tracking-wider text-ink/60 transition-colors hover:border-ink hover:text-ink cursor-pointer">
          <Plus className="h-4.5 w-4.5" /> Add a new goal
        </button>
      </div>

      {/* Goal detail sheet */}
      <AnimatePresence>
        {selectedGoal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGoalId(null)}
              className="absolute inset-0 z-40 bg-ink"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
              className="absolute inset-x-0 bottom-0 z-50 max-h-[85%] overflow-y-auto no-scrollbar rounded-t-[28px] border-t-2 border-ink bg-paper p-5 pb-7"
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-ink/20" />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-ink/15 ${goalStyles[selectedGoal.category].tile}`}
                  >
                    {React.createElement(goalStyles[selectedGoal.category].icon, {
                      className: "h-5.5 w-5.5",
                    })}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold leading-tight">
                      {selectedGoal.name}
                    </h3>
                    <p className="text-sm font-semibold text-ink/45">
                      Target: {selectedGoal.targetDate}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGoalId(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-ink/5 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Progress */}
              <div className="mt-6 flex justify-between text-sm">
                <span className="font-bold tabular-nums">
                  {formatNaira(selectedGoal.savedAmount)} saved
                </span>
                <span className="font-medium tabular-nums text-ink/45">
                  of {formatNaira(selectedGoal.targetAmount)}
                </span>
              </div>
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full border-2 border-ink/10 bg-ink/5">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${derived.goalPct(selectedGoal)}%` }}
                />
              </div>

              {/* Quick save */}
              {selectedComplete ? (
                <div className="mt-6 flex items-center gap-2.5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50 p-4 text-sm font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  This goal is fully funded. Well done!
                </div>
              ) : (
                <div className="mt-6 space-y-3 rounded-3xl border-2 border-ink bg-white dark:bg-zinc-900 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink/45">
                      Quick save from {currentAccount?.name}
                    </span>
                    <span className="text-base font-bold tabular-nums">
                      {formatNaira(contribution)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5_000}
                    max={maxContribution}
                    step={1_000}
                    value={Math.min(contribution, maxContribution)}
                    onChange={(e) => setContribution(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-ink/10 accent-[#1a1c1c]"
                  />
                  <div className="flex justify-between text-xs font-semibold tabular-nums text-ink/40">
                    <span>{formatNaira(5_000)}</span>
                    <span>{formatNaira(maxContribution)}</span>
                  </div>
                  <button
                    onClick={handleConfirmSave}
                    disabled={justSaved}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-sun text-sm font-bold text-zinc-900 transition-transform active:scale-[0.98] disabled:opacity-80 cursor-pointer"
                  >
                    {justSaved ? (
                      <>
                        <CheckCircle2 className="h-5 w-5" /> Transferred
                      </>
                    ) : (
                      "Confirm Quick Save"
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
