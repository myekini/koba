import React from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Car,
  PiggyBank,
  ShoppingBag,
  UtensilsCrossed,
  Zap,
  LucideIcon,
} from "lucide-react";
import { Transaction, TransactionCategory } from "@/lib/mock-data";
import { formatNaira } from "@/lib/utils";

const categoryIcons: Record<TransactionCategory, LucideIcon> = {
  Food: UtensilsCrossed,
  Transport: Car,
  Utilities: Zap,
  Shopping: ShoppingBag,
  Income: ArrowDownLeft,
  Transfer: ArrowUpRight,
  Savings: PiggyBank,
};

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {transactions.map((tx, index) => {
        const Icon = categoryIcons[tx.category];
        const isCredit = tx.type === "credit";
        return (
          <div
            key={tx.id}
            className={`flex items-center gap-3 px-4 py-3.5 ${
              index > 0 ? "border-t border-zinc-100 dark:border-zinc-800" : ""
            }`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                isCredit
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {tx.title}
              </p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {tx.date}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-semibold tabular-nums ${
                  isCredit
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-900 dark:text-zinc-50"
                }`}
              >
                {isCredit ? "+" : "−"}
                {formatNaira(tx.amount)}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">{tx.category}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
