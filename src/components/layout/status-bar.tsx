import React, { useEffect, useState } from "react";

export function StatusBar() {
  const [time, setTime] = useState("9:41");

  useEffect(() => {
    // Make the time live so it updates, adding a premium feel
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between px-6 py-3 text-xs font-semibold tracking-tight text-zinc-800 dark:text-zinc-200 z-50 select-none bg-transparent">
      <span>{time}</span>
      <div className="flex items-center gap-1.5">
        {/* Signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" className="fill-zinc-800 dark:fill-zinc-200">
          <rect x="0" y="8" width="3" height="3" rx="0.5" />
          <rect x="4.5" y="6" width="3" height="5" rx="0.5" />
          <rect x="9" y="3" width="3" height="8" rx="0.5" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" />
        </svg>
        {/* Wifi */}
        <svg
          width="16"
          height="11"
          viewBox="0 0 16 11"
          className="stroke-zinc-800 dark:stroke-zinc-200 fill-none"
          strokeWidth="1.4"
          strokeLinecap="round"
        >
          <path d="M8 9.5a0.75 0.75 0 1 1 0-1.5 0.75 0.75 0 0 1 0 1.5ZM5.2 6.8a4 4 0 0 1 5.6 0M2.4 4a8 8 0 0 1 11.2 0" />
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" className="stroke-zinc-800 dark:stroke-zinc-200 fill-none">
          <rect x="0.5" y="0.5" width="20.5" height="11" rx="3" strokeWidth="1" />
          <rect x="2.5" y="2.5" width="16.5" height="7" rx="1.5" className="fill-zinc-800 dark:fill-zinc-200 stroke-none" />
          <path d="M22.5 4v4" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
