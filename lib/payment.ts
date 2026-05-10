export type PaidSpreadType = "yes-no" | "relationship";

export const SPREAD_PRICES: Record<PaidSpreadType, number> = {
  "yes-no": 49,
  relationship: 199,
};

const KEY = "mystic_paid";

function getStore(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function markPaid(type: PaidSpreadType) {
  const store = getStore();
  store[type] = Date.now() + 30 * 60 * 1000; // 30 мин
  sessionStorage.setItem(KEY, JSON.stringify(store));
}

export function isPaid(type: PaidSpreadType): boolean {
  const store = getStore();
  return Boolean(store[type] && store[type] > Date.now());
}

export function consumePaid(type: PaidSpreadType) {
  const store = getStore();
  delete store[type];
  sessionStorage.setItem(KEY, JSON.stringify(store));
}
