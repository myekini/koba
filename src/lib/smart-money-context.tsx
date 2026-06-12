"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useRef,
} from "react";
import {
  CoachMessage,
  INITIAL_SAVED_THIS_MONTH,
  MONTHLY_INCOME,
  MonthKey,
  SavingGoal,
  SpendCategoryKey,
  Transaction,
  UBAAccount,
  initialAccounts,
  initialBudgetLimits,
  initialGoals,
  initialMonthlySpend,
  initialTransactions,
  USER,
} from "@/lib/mock-data";
import { formatNaira } from "@/lib/utils";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export interface SmartMoneyState {
  accounts: UBAAccount[];
  goals: SavingGoal[];
  transactions: Transaction[];
  monthlySpend: Record<MonthKey, Record<SpendCategoryKey, number>>;
  budgetLimits: Record<SpendCategoryKey, number>;
  savedThisMonth: number;
  messages: CoachMessage[];
  coachTyping: boolean;
  settings: {
    alerts: boolean;
    nudges: boolean;
    darkMode: boolean;
    autoSaveRule: { goalId: string; amount: number; day: number } | null;
  };
  design: DesignVariant;
}

export type DesignVariant = "classic" | "illustrative";

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const initialState: SmartMoneyState = {
  accounts: initialAccounts,
  goals: initialGoals,
  transactions: initialTransactions,
  monthlySpend: initialMonthlySpend,
  budgetLimits: initialBudgetLimits,
  savedThisMonth: INITIAL_SAVED_THIS_MONTH,
  messages: [
    {
      id: "m-welcome",
      sender: "coach",
      text: `Good morning, ${USER.firstName} — KOBA here. I've reviewed your June activity across both UBA accounts. Total liquidity is ${formatNaira(
        initialAccounts.reduce((sum, account) => sum + account.balance, 0)
      )}. What would you like to look at?`,
      timestamp: "9:41 AM",
      quickReplies: [
        "Food spending spike",
        "Vacation goal advice",
        "Emergency fund status",
        "Sweep idle cash",
      ],
    },
  ],
  coachTyping: false,
  settings: { alerts: true, nudges: true, darkMode: false, autoSaveRule: null },
  design: "classic",
};

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type Action =
  | { type: "USER_MESSAGE"; text: string }
  | { type: "COACH_REPLY"; input: string }
  | {
      type: "CONTRIBUTE_TO_GOAL";
      goalId: string;
      amount: number;
      fromAccountId: string;
    }
  | { type: "TOGGLE_SETTING"; key: "alerts" | "nudges" | "darkMode" }
  | { type: "SET_DESIGN"; design: DesignVariant };

function moveFromAccount(
  accounts: UBAAccount[],
  accountId: string,
  amount: number
): UBAAccount[] {
  return accounts.map((account) =>
    account.id === accountId
      ? { ...account, balance: account.balance - amount }
      : account
  );
}

function creditGoal(
  goals: SavingGoal[],
  goalId: string,
  amount: number
): SavingGoal[] {
  return goals.map((goal) => {
    if (goal.id !== goalId) return goal;
    const savedAmount = Math.min(goal.savedAmount + amount, goal.targetAmount);
    const history = [...goal.history];
    const last = history[history.length - 1];
    if (last?.date === "Jun") {
      history[history.length - 1] = { ...last, amount: savedAmount };
    } else {
      history.push({ date: "Jun", amount: savedAmount });
    }
    return { ...goal, savedAmount, history };
  });
}

function withTransaction(
  state: SmartMoneyState,
  tx: Omit<Transaction, "id" | "date">
): Transaction[] {
  return [
    {
      ...tx,
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: "Just now",
    },
    ...state.transactions,
  ];
}

function contribute(
  state: SmartMoneyState,
  goalId: string,
  amount: number,
  fromAccountId: string
): SmartMoneyState {
  const goal = state.goals.find((g) => g.id === goalId);
  const account = state.accounts.find((a) => a.id === fromAccountId);
  if (!goal || !account) return state;
  const capped = Math.min(
    amount,
    goal.targetAmount - goal.savedAmount,
    account.balance
  );
  if (capped <= 0) return state;
  return {
    ...state,
    accounts: moveFromAccount(state.accounts, fromAccountId, capped),
    goals: creditGoal(state.goals, goalId, capped),
    savedThisMonth: state.savedThisMonth + capped,
    transactions: withTransaction(state, {
      title: goal.name,
      description: `From ${account.name}`,
      amount: capped,
      type: "debit",
      category: "Savings",
    }),
  };
}

function sweepToSavings(state: SmartMoneyState, amount: number): SmartMoneyState {
  const current = state.accounts.find((a) => a.type === "Current");
  if (!current || current.balance < amount) return state;
  return {
    ...state,
    accounts: state.accounts.map((account) => {
      if (account.type === "Current")
        return { ...account, balance: account.balance - amount };
      if (account.type === "Savings")
        return { ...account, balance: account.balance + amount };
      return account;
    }),
    savedThisMonth: state.savedThisMonth + amount,
    transactions: withTransaction(state, {
      title: "Idle Cash Sweep",
      description: "UBA Current → UBA Savings",
      amount,
      type: "debit",
      category: "Savings",
    }),
  };
}

// ---------------------------------------------------------------------------
// Coach engine — replies are generated from *live* state and may carry a
// side effect that the reducer applies in the same step, so balances, goals
// and budgets visibly change when the user accepts a suggestion.
// ---------------------------------------------------------------------------

interface CoachReply {
  text: string;
  quickReplies: string[];
  effect?: (state: SmartMoneyState) => SmartMoneyState;
}

function getCoachReply(state: SmartMoneyState, rawInput: string): CoachReply {
  const input = rawInput.toLowerCase().trim();
  const food = state.monthlySpend.june.Food;
  const foodPrev = state.monthlySpend.may.Food;
  const foodDelta = Math.round(((food - foodPrev) / foodPrev) * 100);
  const vacation = state.goals.find((g) => g.id === "goal-vacation");
  const emergency = state.goals.find((g) => g.id === "goal-emergency");
  const current = state.accounts.find((a) => a.type === "Current");
  const emergencyRemaining = emergency
    ? emergency.targetAmount - emergency.savedAmount
    : 0;

  // Must run before the generic "food" match — "set a food limit" contains both.
  if (input.includes("limit") || input.includes("budget")) {
    return {
      text: "Done — your Food & Dining budget is now ₦35,000 a month. You'll see the new limit reflected in Insights, and I'll nudge you at 80%.",
      quickReplies: ["Show my insights", "Vacation goal advice", "Thanks!"],
      effect: (s) => ({
        ...s,
        budgetLimits: { ...s.budgetLimits, Food: 35_000 },
      }),
    };
  }

  if (input.includes("food") || input.includes("dining")) {
    return {
      text: `You've spent ${formatNaira(food)} on food in June — ${foodDelta}% above your May total of ${formatNaira(
        foodPrev
      )}. Most of it came from weekend dining. Cutting back 25% frees up about ${formatNaira(
        Math.round(food * 0.25)
      )} for your Vacation Fund. Want me to set a food budget of ₦35,000?`,
      quickReplies: ["Yes, set food limit", "Vacation goal advice", "Maybe later"],
    };
  }

  if (input.includes("vacation") || input.includes("goal advice")) {
    if (!vacation) return defaultReply();
    const monthly = Math.ceil((vacation.targetAmount - vacation.savedAmount) / 2 / 1000) * 1000;
    return {
      text: `Your Vacation Fund is at ${formatNaira(vacation.savedAmount)} of ${formatNaira(
        vacation.targetAmount
      )} (${Math.round((vacation.savedAmount / vacation.targetAmount) * 100)}%). To land it by ${
        vacation.targetDate
      }, you need roughly ${formatNaira(monthly)}/month. I can auto-save that right after salary day.`,
      quickReplies: ["Yes, automate it", "Emergency fund status", "Keep it manual"],
    };
  }

  if (input.includes("automate")) {
    if (!vacation) return defaultReply();
    const monthly = Math.ceil((vacation.targetAmount - vacation.savedAmount) / 2 / 1000) * 1000;
    return {
      text: `Auto-save is on. Every 26th — right after salary — ${formatNaira(
        monthly
      )} moves from UBA Current into your Vacation Fund. You can manage this rule in Settings.`,
      quickReplies: ["Check my goals", "Sweep idle cash", "Perfect, thanks"],
      effect: (s) => ({
        ...s,
        settings: {
          ...s.settings,
          autoSaveRule: { goalId: "goal-vacation", amount: monthly, day: 26 },
        },
      }),
    };
  }

  if (input.includes("emergency")) {
    if (!emergency) return defaultReply();
    if (emergencyRemaining <= 0) {
      return {
        text: "Your Emergency Fund is fully funded at ₦300,000 — that's your reserve milestone hit. Well done. Want to redirect future savings to the Vacation Fund?",
        quickReplies: ["Vacation goal advice", "Sweep idle cash", "All good"],
      };
    }
    return {
      text: `Your Emergency Fund is ${Math.round(
        (emergency.savedAmount / emergency.targetAmount) * 100
      )}% complete — ${formatNaira(emergency.savedAmount)} of ${formatNaira(
        emergency.targetAmount
      )}. One transfer of ${formatNaira(
        emergencyRemaining
      )} from your Current account would fully fund it today.`,
      quickReplies: [
        `Transfer ${formatNaira(emergencyRemaining)}`,
        "Review my goals",
        "I'll do it later",
      ],
    };
  }

  if (input.startsWith("transfer")) {
    if (!emergency || emergencyRemaining <= 0 || !current) return defaultReply();
    const amount = Math.min(emergencyRemaining, current.balance);
    return {
      text: `Transfer complete — ${formatNaira(amount)} moved from UBA Current to your Emergency Fund. ${
        amount >= emergencyRemaining
          ? "That's 100% funded. Congratulations on hitting your reserve milestone! 🎉"
          : "You're nearly there."
      }`,
      quickReplies: ["Show updated balances", "Vacation goal advice", "Thank you"],
      effect: (s) => contribute(s, "goal-emergency", amount, current.id),
    };
  }

  if (input.includes("sweep ₦") || input === "yes, sweep") {
    if (!current || current.balance < 25_000) {
      return {
        text: `Your Current account holds ${formatNaira(
          current?.balance ?? 0
        )} — not enough to sweep ₦25,000 right now. I'll flag it when idle cash builds up again.`,
        quickReplies: ["Check my goals", "Show updated balances", "Okay"],
      };
    }
    return {
      text: "Sweep complete — ₦25,000 moved from UBA Current into UBA Savings. Your idle cash is now earning interest.",
      quickReplies: ["Show updated balances", "Check my goals", "Excellent"],
      effect: (s) => sweepToSavings(s, 25_000),
    };
  }

  if (input.includes("sweep") || input.includes("idle")) {
    if (!current || current.balance < 25_000) {
      return {
        text: `Your Current account holds ${formatNaira(
          current?.balance ?? 0
        )} right now — below the level where a sweep makes sense. I'll flag it when idle cash builds up again.`,
        quickReplies: ["Check my goals", "Food spending spike", "Okay"],
      };
    }
    return {
      text: `${formatNaira(
        current.balance
      )} in your Current account hasn't moved in 12 days, and Current accounts earn no interest. Sweeping ₦25,000 into UBA Savings puts it to work immediately. Shall I?`,
      quickReplies: ["Sweep ₦25,000", "Explain sweeps", "Keep it in Current"],
    };
  }

  if (input.includes("explain")) {
    return {
      text: "A sweep is a one-tap transfer of idle cash from your zero-interest Current account into your interest-earning UBA Savings. Your money stays accessible — it just stops sitting still.",
      quickReplies: ["Sweep ₦25,000", "Keep it in Current"],
    };
  }

  if (input.includes("balance")) {
    const lines = state.accounts
      .map((a) => `${a.name}: ${formatNaira(a.balance)}`)
      .join(" · ");
    return {
      text: `Here's where you stand — ${lines}. Total: ${formatNaira(
        state.accounts.reduce((sum, a) => sum + a.balance, 0)
      )}.`,
      quickReplies: ["Check my goals", "Sweep idle cash", "Thanks"],
    };
  }

  if (input.includes("goal")) {
    const summary = state.goals
      .map(
        (g) =>
          `${g.name} ${Math.round((g.savedAmount / g.targetAmount) * 100)}%`
      )
      .join(" · ");
    return {
      text: `Your goals: ${summary}. The House Deposit needs the most attention — at the current pace it lands well after Dec 2028.`,
      quickReplies: ["Vacation goal advice", "Emergency fund status", "Okay"],
    };
  }

  if (/^(thanks|thank you|perfect|awesome|okay|ok|all good|wow)/.test(input)) {
    return {
      text: "Anytime. I'll keep watching your spending and flag anything worth acting on.",
      quickReplies: ["Food spending spike", "Sweep idle cash", "Check my goals"],
    };
  }

  return defaultReply();
}

function defaultReply(): CoachReply {
  return {
    text: `Good question, ${USER.firstName}. My standing advice: keep three months of expenses in Savings before investing aggressively, and hold your debt ratio under 40%. Is there a goal you'd like to dig into?`,
    quickReplies: ["Check my goals", "Sweep idle cash", "Food spending spike"],
  };
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function reducer(state: SmartMoneyState, action: Action): SmartMoneyState {
  switch (action.type) {
    case "USER_MESSAGE":
      return {
        ...state,
        coachTyping: true,
        messages: [
          ...state.messages,
          {
            id: `m-user-${Date.now()}`,
            sender: "user",
            text: action.text,
            timestamp: now(),
          },
        ],
      };

    case "COACH_REPLY": {
      const reply = getCoachReply(state, action.input);
      const next = reply.effect ? reply.effect(state) : state;
      return {
        ...next,
        coachTyping: false,
        messages: [
          ...next.messages,
          {
            id: `m-coach-${Date.now()}`,
            sender: "coach",
            text: reply.text,
            timestamp: now(),
            quickReplies: reply.quickReplies,
          },
        ],
      };
    }

    case "CONTRIBUTE_TO_GOAL":
      return contribute(state, action.goalId, action.amount, action.fromAccountId);

    case "SET_DESIGN":
      return { ...state, design: action.design };

    case "TOGGLE_SETTING":
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.key]: !state.settings[action.key],
        },
      };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Derived values
// ---------------------------------------------------------------------------

export interface SmartMoneyDerived {
  totalBalance: number;
  income: number;
  totalSpent: number;
  savedThisMonth: number;
  wellnessScore: number;
  savingsRate: number;
  budgetUtilization: number;
  goalsOnTrack: number;
  goalsAtRisk: number;
  goalPct: (goal: SavingGoal) => number;
  goalStatus: (goal: SavingGoal) => "on track" | "at risk";
}

function buildDerived(state: SmartMoneyState): SmartMoneyDerived {
  const totalBalance = state.accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalSpent = Object.values(state.monthlySpend.june).reduce(
    (sum, v) => sum + v,
    0
  );
  const savingsRate = state.savedThisMonth / MONTHLY_INCOME;
  const categories = Object.keys(
    state.budgetLimits
  ) as SpendCategoryKey[];
  const budgetUtilization =
    categories.reduce(
      (sum, key) => sum + state.monthlySpend.june[key] / state.budgetLimits[key],
      0
    ) / categories.length;

  const goalPct = (goal: SavingGoal) =>
    Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
  const goalStatus = (goal: SavingGoal): "on track" | "at risk" =>
    goalPct(goal) >= 10 ? "on track" : "at risk";

  const avgGoalProgress =
    state.goals.reduce((sum, g) => sum + goalPct(g), 0) /
    Math.max(1, state.goals.length) /
    100;

  const wellnessScore = Math.round(
    100 *
      (0.35 * Math.min(1, savingsRate / 0.15) +
        0.35 * Math.max(0, 1 - Math.max(0, budgetUtilization - 0.5)) +
        0.3 * avgGoalProgress)
  );

  return {
    totalBalance,
    income: MONTHLY_INCOME,
    totalSpent,
    savedThisMonth: state.savedThisMonth,
    wellnessScore,
    savingsRate,
    budgetUtilization,
    goalsOnTrack: state.goals.filter((g) => goalStatus(g) === "on track").length,
    goalsAtRisk: state.goals.filter((g) => goalStatus(g) === "at risk").length,
    goalPct,
    goalStatus,
  };
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface SmartMoneyContextValue {
  state: SmartMoneyState;
  derived: SmartMoneyDerived;
  sendToCoach: (text: string) => void;
  contributeToGoal: (goalId: string, amount: number, fromAccountId: string) => void;
  toggleSetting: (key: "alerts" | "nudges" | "darkMode") => void;
  setDesign: (design: DesignVariant) => void;
}

const SmartMoneyContext = createContext<SmartMoneyContextValue | null>(null);

export function SmartMoneyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const value = useMemo<SmartMoneyContextValue>(
    () => ({
      state,
      derived: buildDerived(state),
      sendToCoach: (text: string) => {
        if (!text.trim()) return;
        dispatch({ type: "USER_MESSAGE", text });
        if (replyTimer.current) clearTimeout(replyTimer.current);
        replyTimer.current = setTimeout(
          () => dispatch({ type: "COACH_REPLY", input: text }),
          1100
        );
      },
      contributeToGoal: (goalId, amount, fromAccountId) =>
        dispatch({ type: "CONTRIBUTE_TO_GOAL", goalId, amount, fromAccountId }),
      toggleSetting: (key) => dispatch({ type: "TOGGLE_SETTING", key }),
      setDesign: (design) => {
        dispatch({ type: "SET_DESIGN", design });
        try {
          localStorage.setItem("koba-design", design);
        } catch {}
      },
    }),
    [state]
  );

  // Restore design preference after mount (URL param wins over localStorage)
  // so the prerendered HTML always matches the first client render.
  React.useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("design");
    const stored = localStorage.getItem("koba-design");
    const wanted =
      fromUrl === "stitch" || fromUrl === "illustrative"
        ? "illustrative"
        : fromUrl === "classic"
          ? "classic"
          : stored === "illustrative"
            ? "illustrative"
            : null;
    if (wanted) dispatch({ type: "SET_DESIGN", design: wanted });
  }, []);

  return (
    <SmartMoneyContext.Provider value={value}>
      {children}
    </SmartMoneyContext.Provider>
  );
}

export function useSmartMoney() {
  const ctx = useContext(SmartMoneyContext);
  if (!ctx)
    throw new Error("useSmartMoney must be used within SmartMoneyProvider");
  return ctx;
}
