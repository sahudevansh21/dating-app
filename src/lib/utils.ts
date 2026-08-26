import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isYesOutcome(outcomeId: string): boolean {
  return outcomeId === "yes" || outcomeId === "home" || outcomeId === "a";
}
