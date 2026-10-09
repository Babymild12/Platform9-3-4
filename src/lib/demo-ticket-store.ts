import type { DemoTicket } from "@/types/booking";

const emptyTickets: DemoTicket[] = [];
const listeners = new Set<() => void>();
let cachedValue: string | null = null;
let cachedTickets = emptyTickets;

export function getDemoTicketsSnapshot() {
  if (typeof window === "undefined") return emptyTickets;

  let serialized: string | null;
  try {
    serialized = window.sessionStorage.getItem("platform9-3-4-demo-tickets");
  } catch {
    return emptyTickets;
  }
  if (serialized === cachedValue) return cachedTickets;

  try {
    const parsed: unknown = serialized ? JSON.parse(serialized) : [];
    cachedTickets = Array.isArray(parsed) ? parsed as DemoTicket[] : emptyTickets;
  } catch {
    cachedTickets = emptyTickets;
    window.sessionStorage.removeItem("platform9-3-4-demo-tickets");
  }

  cachedValue = serialized;
  return cachedTickets;
}

export function subscribeToDemoTickets(listener: () => void) {
  listeners.add(listener);
  const handleStorage = () => listener();
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function saveDemoTickets(tickets: DemoTicket[]) {
  const serialized = JSON.stringify(tickets);
  try {
    window.sessionStorage.setItem("platform9-3-4-demo-tickets", serialized);
  } catch {
    // Keep the current tab's ticket state usable when browser storage is unavailable.
  }
  cachedTickets = tickets;
  cachedValue = serialized;
  listeners.forEach((listener) => listener());
}

export function getServerDemoTicketsSnapshot() {
  return emptyTickets;
}