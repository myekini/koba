import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  ChevronDown,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { useSmartMoney } from "@/lib/smart-money-context";
import { formatNaira } from "@/lib/utils";
import { USER } from "@/lib/mock-data";
import { InkTransactionList } from "./transaction-list";

interface HomeViewProps {
  onNavigate: () => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const { state, derived } = useSmartMoney();
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute inset-0 flex flex-col overflow-hidden bg-graph font-ink text-ink"
    >
      <div className="no-scrollbar flex-1 space-y-7 overflow-y-auto px-5 pb-8 pt-5">
        {/* Header */}
        <header className="flex items-center justify-between">
          <button className="flex items-center gap-1 rounded-full bg-ink px-3.5 py-2 text-xs font-bold text-paper cursor-pointer">
            NG <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {/* Solid-red brand original: legible on paper and dark surfaces */}
          <img
            src="/UBA_Group/UBA_Group_Logo_Alternative_6.svg"
            alt="UBA"
            className="h-5.5"
          />
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper cursor-pointer">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-sun ring-2 ring-ink" />
          </button>
        </header>

        {/* Greeting */}
        <div>
          <h1 className="text-[30px] font-bold leading-[1.1] tracking-tight">
            Good morning,
            <br />
            {USER.firstName}
          </h1>
          <p className="mt-2 text-sm font-medium text-ink/50">Fri, 12 Jun 2026</p>
        </div>

        {/* New action */}
        <button className="flex w-full items-center justify-between rounded-full bg-sun py-2 pl-6 pr-2 cursor-pointer transition-transform active:scale-[0.99]">
          <span className="text-base font-bold text-zinc-900">New Action</span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper">
            <ArrowRight className="h-5 w-5" />
          </span>
        </button>

        {/* Balance card */}
        <section className="rounded-3xl bg-ink p-6 text-paper">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-paper/60">
              Total balance
            </p>
            <button
              onClick={() => setBalanceVisible((v) => !v)}
              className="rounded-full p-1 text-paper/60 transition-colors hover:text-paper cursor-pointer"
              aria-label={balanceVisible ? "Hide balance" : "Show balance"}
            >
              {balanceVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>
          </div>
          <p className="mt-2 text-[34px] font-bold leading-none tracking-tight tabular-nums">
            {balanceVisible
              ? formatNaira(derived.totalBalance, { decimals: true })
              : "₦ ••••••"}
          </p>
          <p className="mt-3 text-sm font-medium text-paper/60">
            {state.accounts.map((a) => a.name).join(" · ")}
          </p>
        </section>

        {/* Quick actions */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold">Quick Actions</h3>
          <div className="flex flex-wrap gap-2.5">
            {["Transfer", "Pay Bills", "Airtime", "More"].map((label) => (
              <button
                key={label}
                className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-paper transition-transform active:scale-95 cursor-pointer"
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* For you */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">For You</h3>
            <button className="text-sm font-semibold text-ink/50 cursor-pointer">
              See All
            </button>
          </div>
          <div className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 pb-1">
            {/* KOBA card */}
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={onNavigate}
              className="flex w-44 shrink-0 cursor-pointer flex-col justify-between rounded-3xl bg-blush p-4"
            >
              <div className="flex items-start justify-between">
                <h4 className="text-xl font-bold leading-tight">KOBA</h4>
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-medium leading-snug">
                Score improved to{" "}
                <strong className="font-bold">{derived.wellnessScore}/100</strong>
              </p>
              <span className="mt-4 block rounded-full bg-white px-4 py-2.5 text-center text-sm font-bold text-zinc-900">
                View Insights
              </span>
            </motion.div>

            {/* Goals card */}
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={onNavigate}
              className="flex w-44 shrink-0 cursor-pointer flex-col justify-between rounded-3xl bg-mint p-4"
            >
              <h4 className="text-xl font-bold leading-tight">
                Save
                <br />
                Goals
              </h4>
              <p className="mt-3 text-sm font-medium leading-snug">
                {derived.goalsOnTrack} of {state.goals.length} goals{" "}
                <strong className="font-bold">on track</strong>
              </p>
              <span className="mt-4 block rounded-full bg-white px-4 py-2.5 text-center text-sm font-bold text-zinc-900">
                View Details
              </span>
            </motion.div>
          </div>
        </section>

        {/* Recent transactions */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Recent Transactions</h3>
            <button className="text-sm font-semibold text-ink/50 cursor-pointer">
              See All
            </button>
          </div>
          <InkTransactionList transactions={state.transactions.slice(0, 5)} />
        </section>
      </div>
    </motion.div>
  );
}
