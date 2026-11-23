import { beforeEach, expect, mock, test } from "bun:test";
let owner = "trainer";
let privateFailed = false;
let calls: Array<{ table: string; payload: Record<string, unknown> }> = [];
mock.module("@/integrations/supabase/client", () => ({ supabase: {
  auth: { getUser: async () => ({ data: { user: { id: "trainer" } }, error: null }) },
  from: (table: string) => {
    const q = {
      update: (payload: Record<string, unknown>) => { calls.push({ table, payload }); return q; },
      eq: () => q, select: () => q,
      single: async () => ({ data: { id: "plan", owner_id: owner }, error: null }),
      upsert: async (payload: Record<string, unknown>) => {
        calls.push({ table, payload });
        return { error: privateFailed ? new Error("private write failed") : null };
      },
    };
    return q;
  },
} }));
const { savePlanData } = await import("../src/lib/trainer-plans");
const client = { id: "plan", name: "Test", goal: "Strength", days: [], intake: { coachNotes: "Private" } };
beforeEach(() => { owner = "trainer"; privateFailed = false; calls = []; });
test("owner private data writes use only existing fields", async () => {
  await savePlanData("plan", client);
  expect(calls[1]?.payload).toEqual({ plan_id: "plan", data: { intake: client.intake, goal: "Strength", trainingDays: [] } });
});
test("private write failures propagate instead of reporting a saved plan", async () => {
  privateFailed = true;
  await expect(savePlanData("plan", client)).rejects.toThrow("private write failed");
});
test("shared editors save only the prescription, not owner-only intake", async () => {
  owner = "another-trainer";
  await savePlanData("plan", client);
  expect(calls.map((c) => c.table)).toEqual(["trainer_plans"]);
});