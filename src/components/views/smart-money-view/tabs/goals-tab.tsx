import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Home,
  Palmtree,
  Plus,
  ShieldCheck,
  X,
  LucideIcon,
} from "lucide-react";
import { SavingGoal } from "@/lib/mock-data";
import { useSmartMoney } from "@/lib/smart-money-context";
import { formatNaira } from "@/lib/utils";

const goalIcons: Record<SavingGoal["category"], LucideIcon> = {
  vacation: Palmtree,
  emergency: ShieldCheck,
  house: Home,
};

export function GoalsTab() {
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
      <div className="no-scrollbar h-full space-y-4 overflow-y-auto p-4 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Savings goals
            </h3>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {derived.goalsOnTrack} on track · {derived.goalsAtRisk} at risk
            </p>
          </div>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
            aria-label="Add goal"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Goal cards */}
        <div className="space-y-3">
          {state.goals.map((goal) => {
            const Icon = goalIcons[goal.category];
            const pct = derived.goalPct(goal);
            const atRisk = derived.goalStatus(goal) === "at risk";
            const complete = goal.savedAmount >= goal.targetAmount;
            return (
              <button
                key={goal.id}
                onClick={() => openGoal(goal)}
                className="w-full rounded-3xl border border-zinc-200 bg-white p-4.5 text-left transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        {goal.name}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Target {goal.targetDate}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      complete
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : atRisk
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {complete ? "Funded" : `${pct}%`}
                  </span>
                </div>

                <div className="mt-3.5 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                      {formatNaira(goal.savedAmount)} saved
                    </span>
                    <span className="tabular-nums text-zinc-400 dark:text-zinc-500">
                      of {formatNaira(goal.targetAmount)}
                    </span>
                  </div>
                  <ProgressBar pct={pct} atRisk={atRisk} />
                </div>
              </button>
            );
          })}
        </div>
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
              className="absolute inset-0 z-40 bg-black"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
              className="absolute inset-x-0 bottom-0 z-50 max-h-[85%] overflow-y-auto no-scrollbar rounded-t-[28px] border-t border-zinc-200 bg-white p-5 pb-7 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                    {React.createElement(goalIcons[selectedGoal.category], {
                      className: "h-5 w-5",
                    })}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      {selectedGoal.name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Target {selectedGoal.targetDate}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGoalId(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* History sparkline */}
              <div className="mt-5">
                <Sparkline goal={selectedGoal} />
              </div>

              {/* Progress */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                    {formatNaira(selectedGoal.savedAmount)}
                  </span>
                  <span className="tabular-nums text-zinc-400 dark:text-zinc-500">
                    of {formatNaira(selectedGoal.targetAmount)}
                  </span>
                </div>
                <ProgressBar
                  pct={derived.goalPct(selectedGoal)}
                  atRisk={derived.goalStatus(selectedGoal) === "at risk"}
                />
              </div>

              {/* Quick save */}
              {selectedComplete ? (
                <div className="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  This goal is fully funded. Well done!
                </div>
              ) : (
                <div className="mt-5 space-y-3 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-950">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Quick save from {currentAccount?.name}
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-primary">
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
                    className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-primary dark:bg-zinc-800"
                  />
                  <div className="flex justify-between text-[11px] tabular-nums text-zinc-400 dark:text-zinc-500">
                    <span>{formatNaira(5_000)}</span>
                    <span>{formatNaira(maxContribution)}</span>
                  </div>
                  <button
                    onClick={handleConfirmSave}
                    disabled={justSaved}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-80 cursor-pointer"
                  >
                    {justSaved ? (
                      <>
                        <CheckCircle2 className="h-4.5 w-4.5" /> Transferred
                      </>
                    ) : (
                      "Confirm quick save"
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

function ProgressBar({ pct, atRisk }: { pct: number; atRisk: boolean }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
      <motion.div
        className={`h-full rounded-full ${atRisk ? "bg-amber-500" : "bg-primary"}`}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  );
}

// Path is generated from however many history points the goal has.
function Sparkline({ goal }: { goal: SavingGoal }) {
  const points = goal.history;
  if (points.length < 2) return null;

  const max = Math.max(...points.map((p) => p.amount));
  const coords = points.map((p, i) => ({
    x: (i / (points.length - 1)) * 100,
    y: 30 - (p.amount / max) * 26,
  }));
  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const area = `${line} L 100 30 L 0 30 Z`;

  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        Contribution history
      </span>
      <div className="relative h-20 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-950">
        <svg className="h-full w-full" viewBox="0 0 100 30" preserveAspectRatio="none">
          <defs>
            <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E60026" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#E60026" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#spark-fill)" />
          <path
            d={line}
            fill="none"
            stroke="#E60026"
            strokeWidth="1.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="absolute inset-x-3 bottom-1.5 flex justify-between text-[10px] font-medium text-zinc-400">
          <span>{points[0].date}</span>
          <span>{points[points.length - 1].date}</span>
        </div>
      </div>
    </div>
  );
}
