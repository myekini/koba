import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNaira(amount: number, options?: { decimals?: boolean }) {
  const formatted = amount.toLocaleString("en-NG", {
    minimumFractionDigits: options?.decimals ? 2 : 0,
    maximumFractionDigits: options?.decimals ? 2 : 0,
  })
  return `₦${formatted}`
}
