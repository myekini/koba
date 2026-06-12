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

const categoryTiles: Record<TransactionCategory, string> = {
  Food: "bg-blush text-zinc-900 dark:text-ink",
  Transport: "bg-sun text-zinc-900",
  Utilities: "bg-mint text-zinc-900 dark:text-ink",
  Shopping: "bg-ink/10 text-ink",
  Income: "bg-mint text-zinc-900 dark:text-ink",
  Transfer: "bg-sun text-zinc-900",
  Savings: "bg-blush text-zinc-900 dark:text-ink",
};

export function InkTransactionList({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="divide-y-2 divide-ink/5 overflow-hidden rounded-3xl border-2 border-ink bg-white dark:bg-zinc-900">
      {transactions.map((tx) => {
        const Icon = categoryIcons[tx.category];
        const isCredit = tx.type === "credit";
        return (
          <div key={tx.id} className="flex items-center gap-3 px-4 py-3.5">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${categoryTiles[tx.category]}`}
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{tx.title}</p>
              <p className="truncate text-xs font-medium text-ink/45">{tx.date}</p>
            </div>
            <p
              className={`text-sm font-bold tabular-nums ${
                isCredit ? "text-emerald-600 dark:text-emerald-400" : "text-ink"
              }`}
            >
              {isCredit ? "+" : "−"}
              {formatNaira(tx.amount)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
