import { v4 as uuidv4, v5 as uuidv5 } from "uuid";

export * from "./remix";
export * from "./user";
export * from "./votes";
export * from "./react";

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function generateId(seed?: string): string {
  return seed ? uuidv5(seed, uuidv5.URL) : uuidv4();
}

export function shortenString(
  original: string,
  maxLength?: number,
  indicator: string = "..."
) {
  const shortened =
    maxLength && original.length > maxLength
      ? original.substring(0, maxLength - indicator.length) + indicator
      : original;
  return { shortened, isShortened: shortened !== original };
}
