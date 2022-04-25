import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import { v4 as uuidv4, v5 as uuidv5 } from "uuid";

import type { User } from "~/models/user.server";

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

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
