"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export const XP_PER_LEVEL = 100;

const TITLES: Record<number, string> = {
  1: "한자 초보",
  2: "한자 입문",
  3: "한자 견습",
  4: "한자 수련",
  5: "한자 숙련",
  6: "한자 고수",
};

export function titleForLevel(level: number): string {
  return TITLES[Math.min(level, 6)] ?? "한자 달인";
}

type UserStateContextValue = {
  tickets: number;
  coins: number;
  xp: number;
  level: number;
  xpInLevel: number;
  title: string;
  addTickets: (n: number) => void;
  spendTicket: () => boolean;
  addCoins: (n: number) => void;
  addXP: (n: number) => void;
};

const UserStateContext = createContext<UserStateContextValue | null>(null);

export function UserStateProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState(3);
  const [coins, setCoins] = useState(100);
  const [xp, setXP] = useState(0);

  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpInLevel = xp % XP_PER_LEVEL;
  const title = titleForLevel(level);

  function addTickets(n: number) {
    setTickets((prev) => prev + n);
  }

  function spendTicket(): boolean {
    if (tickets <= 0) return false;
    setTickets((prev) => prev - 1);
    return true;
  }

  function addCoins(n: number) {
    setCoins((prev) => prev + n);
  }

  function addXP(n: number) {
    setXP((prev) => prev + n);
  }

  return (
    <UserStateContext.Provider
      value={{ tickets, coins, xp, level, xpInLevel, title, addTickets, spendTicket, addCoins, addXP }}
    >
      {children}
    </UserStateContext.Provider>
  );
}

export function useUserState() {
  const ctx = useContext(UserStateContext);
  if (!ctx) throw new Error("useUserState must be used inside UserStateProvider");
  return ctx;
}
