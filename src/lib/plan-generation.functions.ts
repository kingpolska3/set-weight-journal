import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const generatePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ planId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    setResponseHeader("Cache-Control", "no-store");
    const { data: row, error } = await context.supabase.from("trainer_plans").select("data,owner_id").eq("id", data.planId).single();
    if (error || !row || row.owner_id !== context.userId) return { error: "Tylko właściciel może generować plan." };
    const { data: intake, error: privateError } = await context.supabase.from("trainer_client_private").select("data").eq("plan_id", data.planId).maybeSingle();
    if (privateError) return { error: "Nie udało się odczytać danych podopiecznego." };
    const client = { ...(row.data as object), ...(intake?.data as object ?? {}) } as import("./trainer-plans").Client;
    if (!client.trainingDays?.length || !client.goal?.trim()) return { error: "Wybierz dni treningowe i podaj główny cel." };
    const { generateTrainingPlan } = await import("./plan-generation.server");
    const result = await generateTrainingPlan(client, getRequest());
    if ("runId" in result && result.runId) setResponseHeader("X-Lovable-AIG-Run-ID", result.runId);
    return result;
  });