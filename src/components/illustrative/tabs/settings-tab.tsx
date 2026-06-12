import React from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Building,
  ChevronRight,
  FileText,
  Palette,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { USER } from "@/lib/mock-data";
import { useSmartMoney } from "@/lib/smart-money-context";
import { formatNaira } from "@/lib/utils";

export function InkSettingsTab() {
  const { state, derived, toggleSetting, setDesign } = useSmartMoney();
  const rule = state.settings.autoSaveRule;
  const ruleGoal = rule ? state.goals.find((g) => g.id === rule.goalId) : null;

  return (
    <div className="no-scrollbar h-full space-y-5 overflow-y-auto px-5 pb-8 pt-1">
      {/* Profile */}
      <section className="rounded-3xl border-2 border-ink bg-white dark:bg-zinc-900 p-5 text-center shadow-[4px_4px_0_0_var(--color-ink)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-ink bg-sun text-xl font-bold text-zinc-900">
          {USER.initials}
        </div>
        <h3 className="mt-3 text-lg font-bold">{USER.fullName}</h3>
        <p className="mt-0.5 text-sm font-medium text-ink/50">{USER.tier}</p>

        <div className="mt-4 grid grid-cols-3 border-t-2 border-ink/5 pt-4">
          {[
            { label: "Score", value: String(derived.wellnessScore) },
            { label: "Goals", value: String(state.goals.length) },
            { label: "Streak", value: USER.streak },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-lg font-bold tabular-nums">{stat.value}</p>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-ink/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Design style */}
      <InkGroup title="Appearance">
        <div className="flex items-center gap-3 p-4">
          <InkIconTile>
            <Palette className="h-4.5 w-4.5" />
          </InkIconTile>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">Design style</p>
            <p className="mt-0.5 text-xs font-medium text-ink/45">
              Switch between app designs
            </p>
          </div>
          <div className="flex rounded-full border-2 border-ink/15 bg-paper p-0.5">
            {(["classic", "illustrative"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDesign(d)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize transition-colors cursor-pointer ${
                  state.design === d ? "bg-ink text-paper" : "text-ink/50"
                }`}
              >
                {d === "illustrative" ? "Stitch" : "Classic"}
              </button>
            ))}
          </div>
        </div>
      </InkGroup>

      {/* Auto-save rule */}
      {rule && ruleGoal && (
        <InkGroup title="Automation">
          <div className="flex items-center gap-3 p-4">
            <InkIconTile>
              <RefreshCw className="h-4.5 w-4.5" />
            </InkIconTile>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">Auto-save {formatNaira(rule.amount)}</p>
              <p className="mt-0.5 text-xs font-medium text-ink/45">
                To {ruleGoal.name} · every {rule.day}th, after salary
              </p>
            </div>
            <span className="rounded-full border-2 border-emerald-500/40 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              Active
            </span>
          </div>
        </InkGroup>
      )}

      {/* Preferences */}
      <InkGroup title="Preferences">
        <div className="flex items-center gap-3 p-4">
          <InkIconTile>
            <Bell className="h-4.5 w-4.5" />
          </InkIconTile>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">KOBA alerts</p>
            <p className="mt-0.5 text-xs font-medium text-ink/45">
              Weekly budget summaries
            </p>
          </div>
          <InkToggle
            on={state.settings.alerts}
            onToggle={() => toggleSetting("alerts")}
            label="KOBA alerts"
          />
        </div>
        <div className="flex items-center gap-3 p-4">
          <InkIconTile>
            <Sparkles className="h-4.5 w-4.5" />
          </InkIconTile>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">KOBA nudges</p>
            <p className="mt-0.5 text-xs font-medium text-ink/45">
              Proactive savings recommendations
            </p>
          </div>
          <InkToggle
            on={state.settings.nudges}
            onToggle={() => toggleSetting("nudges")}
            label="KOBA nudges"
          />
        </div>
      </InkGroup>

      {/* Accounts */}
      <InkGroup title="Accounts & Reports">
        <button className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-ink/3 cursor-pointer">
          <InkIconTile>
            <Building className="h-4.5 w-4.5" />
          </InkIconTile>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">Linked UBA accounts</p>
            <p className="mt-0.5 text-xs font-medium text-ink/45">
              {state.accounts.length} accounts linked
            </p>
          </div>
          <ChevronRight className="h-4.5 w-4.5 text-ink/30" />
        </button>
        <button className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-ink/3 cursor-pointer">
          <InkIconTile>
            <FileText className="h-4.5 w-4.5" />
          </InkIconTile>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">Monthly PDF report</p>
            <p className="mt-0.5 text-xs font-medium text-ink/45">
              AI-generated finance statement
            </p>
          </div>
          <ChevronRight className="h-4.5 w-4.5 text-ink/30" />
        </button>
      </InkGroup>
    </div>
  );
}

function InkGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h4 className="px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ink/40">
        {title}
      </h4>
      <div className="divide-y-2 divide-ink/5 overflow-hidden rounded-3xl border-2 border-ink bg-white dark:bg-zinc-900">
        {children}
      </div>
    </section>
  );
}

function InkIconTile({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink/5 text-ink">
      {children}
    </span>
  );
}

function InkToggle({
  on,
  onToggle,
  label,
}: {
  on: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={`flex h-6.5 w-12 shrink-0 items-center rounded-full border-2 p-0.5 transition-colors cursor-pointer ${
        on ? "border-ink bg-sun" : "border-ink/20 bg-ink/5"
      }`}
    >
      <motion.span
        className={`h-4.5 w-4.5 rounded-full ${on ? "bg-zinc-900" : "bg-ink/30"}`}
        initial={false}
        animate={{ x: on ? 21 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />
    </button>
  );
}
