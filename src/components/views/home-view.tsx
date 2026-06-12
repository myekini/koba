import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRightLeft,
  Bell,
  ChevronRight,
  Eye,
  EyeOff,
  MoreHorizontal,
  ReceiptText,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useSmartMoney } from "@/lib/smart-money-context";
import { formatNaira } from "@/lib/utils";
import { USER } from "@/lib/mock-data";
import { TransactionList } from "@/components/views/transaction-list";

interface HomeViewProps {
  onNavigate: () => void;
}

const quickActions = [
  { icon: ArrowRightLeft, label: "Transfer" },
  { icon: ReceiptText, label: "Pay bills" },
  { icon: Smartphone, label: "Airtime" },
  { icon: MoreHorizontal, label: "More" },
];

export function HomeView({ onNavigate }: HomeViewProps) {
  const { state, derived } = useSmartMoney();
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute inset-0 flex flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950"
    >
      <div className="no-scrollbar flex-1 space-y-6 overflow-y-auto px-5 pb-8 pt-5">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
              {USER.initials}
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Good morning</p>
              <h1 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {USER.firstName}
              </h1>
            </div>
          </div>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white dark:ring-zinc-900" />
          </button>
        </header>

        {/* Balance card */}
        <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white">
          <img
            src="/UBA_Group/UBA_Group_Symbol_15.svg"
            alt=""
            className="pointer-events-none absolute -right-10 -top-12 h-48 brightness-0 invert opacity-[0.08]"
          />
          <div className="relative space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-white/70">Total balance</p>
                  <button
                    onClick={() => setBalanceVisible((v) => !v)}
                    className="rounded-full p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                    aria-label={balanceVisible ? "Hide balance" : "Show balance"}
                  >
                    {balanceVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <p className="mt-1 text-[32px] font-semibold leading-none tracking-tight tabular-nums">
                  {balanceVisible
                    ? formatNaira(derived.totalBalance, { decimals: true })
                    : "₦ ••••••"}
                </p>
              </div>
              <img
                src="/UBA_Group/UBA_Group_Logo_3.svg"
                alt="UBA"
                className="h-5 brightness-0 invert"
              />
            </div>

            <div className="space-y-2">
              {state.accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{account.name}</p>
                    <p className="text-xs text-white/60">{account.number}</p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">
                    {balanceVisible ? formatNaira(account.balance) : "₦ ••••"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <span className="flex h-13 w-13 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700 transition-colors group-hover:border-zinc-300 group-active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:group-hover:border-zinc-700">
                <action.icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                {action.label}
              </span>
            </button>
          ))}
        </section>

        {/* Smart Money entry */}
        <motion.button
          onClick={onNavigate}
          whileTap={{ scale: 0.99 }}
          className="w-full cursor-pointer rounded-3xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  KOBA
                </h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  {derived.wellnessScore}/100
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                You&apos;ve saved {formatNaira(derived.savedThisMonth)} this month
              </p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-zinc-400" />
          </div>
        </motion.button>

        {/* Recent transactions */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Recent transactions
            </h3>
            <button className="text-xs font-semibold text-primary cursor-pointer">
              View all
            </button>
          </div>
          <TransactionList transactions={state.transactions.slice(0, 5)} />
        </section>
      </div>
    </motion.div>
  );
}
