import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



export function truncateWithEllipsis(text: string, maxLength: number = 100): string {
  // remove \n and \t
  // trim whitespace
  text = text.replace(/\n/g, " ").replace(/\t/g, " ").trim();
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}