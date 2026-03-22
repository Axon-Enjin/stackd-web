import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



export function toTeamSlug(firstName: string, lastName: string): string {
  return `${firstName}-${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function truncateWithEllipsis(text: string | null | undefined, maxLength: number = 100): string {
  if (!text) return "";
  // remove \n and \t
  // trim whitespace
  text = text.replace(/\n/g, " ").replace(/\t/g, " ").trim();
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}