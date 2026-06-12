import React from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Building,
  ChevronRight,
  FileText,
  Moon,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { USER } from "@/lib/mock-data";
import { useSmartMoney } from "@/lib/smart-money-context";
import { formatNaira } from "@/lib/utils";

export function SettingsTab() {
  const { state, derived, toggleSetting } = useSmartMoney();
  const rule = state.settings.autoSaveRule;
  const ruleGoal = rule ? state.goals.find((g) => g.id === rule.goalId) : null;

  return (
    <div className="no-scrollbar h-full space-y-5 overflow-y-auto p-4 pb-8">
      {/* Profile */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-5 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-white">
          {USER.initials}
        </div>
        <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {USER.fullName}
        </h3>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{USER.tier}</p>

        <div className="mt-4 grid grid-cols-3 divide-x divide-zinc-200 border-t border-zinc-200 pt-4 dark:divide-zinc-800 dark:border-zinc-800">
          {[
            { label: "Score", value: String(derived.wellnessScore) },
            { label: "Goals", value: String(state.goals.length) },
            { label: "Streak", value: USER.streak },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-base font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Auto-save rule (appears once the coach sets it up) */}
      {rule && ruleGoal && (
        <SettingsGroup title="Automation">
          <SettingsRow
            icon={<RefreshCw className="h-4.5 w-4.5" />}
            title={`Auto-save ${formatNaira(rule.amount)}`}
            subtitle={`To ${ruleGoal.name} · every ${rule.day}th, after salary`}
            trailing={
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                Active
              </span>
            }
          />
        </SettingsGroup>
      )}

      {/* Preferences */}
      <SettingsGroup title="Preferences">
        <SettingsRow
          icon={<Bell className="h-4.5 w-4.5" />}
          title="KOBA alerts"
          subtitle="Weekly budget summaries"
          trailing={
            <Toggle
              on={state.settings.alerts}
              onToggle={() => toggleSetting("alerts")}
              label="Smart Money alerts"
            />
          }
        />
        <SettingsRow
          icon={<Sparkles className="h-4.5 w-4.5" />}
          title="KOBA nudges"
          subtitle="Proactive savings recommendations"
          trailing={
            <Toggle
              on={state.settings.nudges}
              onToggle={() => toggleSetting("nudges")}
              label="Coach nudges"
            />
          }
        />
        <SettingsRow
          icon={<Moon className="h-4.5 w-4.5" />}
          title="Dark mode"
          subtitle="Easier on the eyes at night"
          trailing={
            <Toggle
              on={state.settings.darkMode}
              onToggle={() => toggleSetting("darkMode")}
              label="Dark mode"
            />
          }
        />
      </SettingsGroup>

      {/* Accounts */}
      <SettingsGroup title="Accounts & reports">
        <SettingsRow
          icon={<Building className="h-4.5 w-4.5" />}
          title="Linked UBA accounts"
          subtitle={`${state.accounts.length} accounts linked`}
          trailing={<ChevronRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />}
          asButton
        />
        <SettingsRow
          icon={<FileText className="h-4.5 w-4.5" />}
          title="Monthly PDF report"
          subtitle="AI-generated finance statement"
          trailing={<ChevronRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />}
          asButton
        />
      </SettingsGroup>
    </div>
  );
}

function SettingsGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h4 className="px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        {title}
      </h4>
      <div className="divide-y divide-zinc-100 overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
        {children}
      </div>
    </section>
  );
}

function SettingsRow({
  icon,
  title,
  subtitle,
  trailing,
  asButton,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  trailing: React.ReactNode;
  asButton?: boolean;
}) {
  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
        {icon}
      </span>
      <div className="min-w-0 flex-1 text-left">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{title}</p>
        <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </p>
      </div>
      {trailing}
    </>
  );

  if (asButton) {
    return (
      <button className="flex w-full items-center gap-3 p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-950/50 cursor-pointer">
        {content}
      </button>
    );
  }
  return <div className="flex items-center gap-3 p-4">{content}</div>;
}

function Toggle({
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
      className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors cursor-pointer ${
        on ? "bg-primary" : "bg-zinc-200 dark:bg-zinc-700"
      }`}
    >
      <motion.span
        className="h-5 w-5 rounded-full bg-white shadow-sm"
        initial={false}
        animate={{ x: on ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />
    </button>
  );
}
