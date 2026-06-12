// Domain types + seed data for the Smart Money MVP.
// All numbers here are the *initial* state — live values are derived in
// smart-money-context.tsx so every user action ripples through the app.

export type SpendCategoryKey = "Food" | "Transport" | "Utilities" | "Shopping";

export type TransactionCategory =
  | SpendCategoryKey
  | "Income"
  | "Transfer"
  | "Savings";

export interface UBAAccount {
  id: string;
  name: string;
  number: string;
  balance: number;
  type: "Savings" | "Current";
}

export interface SavingGoal {
  id: string;
  name: string;
  targetDate: string;
  savedAmount: number;
  targetAmount: number;
  category: "vacation" | "emergency" | "house";
  history: { date: string; amount: number }[];
}

export interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  category: TransactionCategory;
  date: string;
}

export interface CoachMessage {
  id: string;
  sender: "coach" | "user";
  text: string;
  timestamp: string;
  quickReplies?: string[];
}

export type MonthKey = "june" | "may";

export const MONTH_LABELS: Record<MonthKey, string> = {
  june: "June 2026",
  may: "May 2026",
};

export const initialAccounts: UBAAccount[] = [
  {
    id: "acc-savings",
    name: "UBA Savings",
    number: "•••• 8901",
    balance: 800_320,
    type: "Savings",
  },
  {
    id: "acc-current",
    name: "UBA Current",
    number: "•••• 4520",
    balance: 47_000,
    type: "Current",
  },
];

export const initialGoals: SavingGoal[] = [
  {
    id: "goal-vacation",
    name: "Vacation Fund",
    targetDate: "Aug 2026",
    savedAmount: 84_000,
    targetAmount: 150_000,
    category: "vacation",
    history: [
      { date: "Feb", amount: 15_000 },
      { date: "Mar", amount: 30_000 },
      { date: "Apr", amount: 48_000 },
      { date: "May", amount: 65_000 },
      { date: "Jun", amount: 84_000 },
    ],
  },
  {
    id: "goal-emergency",
    name: "Emergency Fund",
    targetDate: "Jul 2026",
    savedAmount: 264_000,
    targetAmount: 300_000,
    category: "emergency",
    history: [
      { date: "Feb", amount: 50_000 },
      { date: "Mar", amount: 110_000 },
      { date: "Apr", amount: 160_000 },
      { date: "May", amount: 210_000 },
      { date: "Jun", amount: 264_000 },
    ],
  },
  {
    id: "goal-house",
    name: "House Deposit",
    targetDate: "Dec 2028",
    savedAmount: 120_000,
    targetAmount: 2_000_000,
    category: "house",
    history: [
      { date: "Apr", amount: 40_000 },
      { date: "May", amount: 80_000 },
      { date: "Jun", amount: 120_000 },
    ],
  },
];

// Spend per category for the current and previous month.
export const initialMonthlySpend: Record<
  MonthKey,
  Record<SpendCategoryKey, number>
> = {
  june: { Food: 38_000, Transport: 26_000, Utilities: 19_000, Shopping: 14_000 },
  may: { Food: 28_300, Transport: 29_000, Utilities: 21_000, Shopping: 18_000 },
};

// Budget limits per category — editable via the coach ("set a food limit").
export const initialBudgetLimits: Record<SpendCategoryKey, number> = {
  Food: 45_000,
  Transport: 30_000,
  Utilities: 25_000,
  Shopping: 40_000,
};

export const MONTHLY_INCOME = 320_000;
export const INITIAL_SAVED_THIS_MONTH = 42_000;

export const initialTransactions: Transaction[] = [
  {
    id: "tx-1",
    title: "The Place Restaurant",
    description: "Food & Dining",
    amount: 4_500,
    type: "debit",
    category: "Food",
    date: "Today, 1:45 PM",
  },
  {
    id: "tx-2",
    title: "Salary Payment",
    description: "UBA Group Payroll",
    amount: 320_000,
    type: "credit",
    category: "Income",
    date: "Yesterday, 8:00 AM",
  },
  {
    id: "tx-3",
    title: "Uber Nigeria",
    description: "Transport ride",
    amount: 3_200,
    type: "debit",
    category: "Transport",
    date: "Jun 10, 6:30 PM",
  },
  {
    id: "tx-4",
    title: "Eko Electricity",
    description: "Prepaid token",
    amount: 15_000,
    type: "debit",
    category: "Utilities",
    date: "Jun 8, 11:20 AM",
  },
  {
    id: "tx-5",
    title: "Transfer to Mum",
    description: "Family support",
    amount: 20_000,
    type: "debit",
    category: "Transfer",
    date: "Jun 7, 3:15 PM",
  },
];

export const USER = {
  firstName: "Oluwaseun",
  fullName: "Oluwaseun Adeyemi",
  initials: "OA",
  tier: "UBA Savings Account · Tier 3",
  streak: "6mo",
};
