import { beforeEach, describe, expect, mock, test } from "bun:test";

type Write = { operation: string; payload: Record<string, unknown> };
let existing = true;
let rejected = false;
let writes: Write[] = [];
const savedAt = "2026-11-22T10:00:00Z";
const booking = {
  id: "booking-test", trainerId: "trainer-test", trainerName: "Trener",
  clientId: "client-test", clientName: "Klient", date: "2026-11-23",
  startMin: 600, endMin: 660, status: "confirmed" as const,
  createdAt: "2026-11-22T09:00:00Z", updatedAt: "2026-11-22T09:30:00Z",
};

mock.module("@/integrations/supabase/client", () => ({
  supabase: { from: () => {
    const query = {
      select: (_columns: string) => query,
      eq: (_column: string, _value: string) => query,
      maybeSingle: async () => ({ data: existing ? { id: booking.id } : null, error: null }),
      update: (payload: Record<string, unknown>) => { writes.push({ operation: "update", payload }); return query; },
      insert: (payload: Record<string, unknown>) => { writes.push({ operation: "insert", payload }); return query; },
      single: async () => ({
        data: rejected ? null : { id: booking.id, data: writes.at(-1)?.payload["data"], updated_at: savedAt },
        error: rejected ? new Error("trainer approval required") : null,
      }),
    };
    return query;
  } },
}));

const { pushBookingToCloud } = await import("../src/lib/booking");
const values = new Map<string, string>();
Object.defineProperty(globalThis, "window", { configurable: true, value: {
  localStorage: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) },
} });
Object.defineProperty(globalThis, "localStorage", { configurable: true, value: window.localStorage });

beforeEach(() => { existing = true; rejected = false; writes = []; values.clear(); });

describe("booking persistence", () => {
  test("trainer confirmation updates an existing booking without changing its owner", async () => {
    await pushBookingToCloud(booking, "trainer-test");
    expect(writes).toEqual([{ operation: "update", payload: { data: booking } }]);
    const stored = JSON.parse(values.get("trainer-bookings-v1") ?? "[]");
    expect(stored[0].status).toBe("confirmed");
    expect(stored[0].updatedAt).toBe(savedAt);
  });

  test("a new pending request records the client's ownership", async () => {
    existing = false;
    const request = { ...booking, status: "pending" as const };
    await pushBookingToCloud(request, "client-test");
    expect(writes).toEqual([{ operation: "insert", payload: { id: booking.id, owner_id: "client-test", data: request } }]);
  });

  test("a rejected approval cannot become a successful local confirmation", async () => {
    rejected = true;
    await expect(pushBookingToCloud(booking, "client-test")).rejects.toThrow("trainer approval required");
    expect(values.get("trainer-bookings-v1")).toBeUndefined();
  });
});