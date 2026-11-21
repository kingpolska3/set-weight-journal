import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** This only controls presentation; database policies enforce every write. */
export function useTrainerAccess(userId: string | undefined) {
  const [result, setResult] = useState<{ userId: string; allowed: boolean } | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!userId) return;
    void supabase.rpc("has_role", { _user_id: userId, _role: "trainer" }).then(({ data, error }) => {
      if (!cancelled) setResult({ userId, allowed: !error && data === true });
    });
    return () => { cancelled = true; };
  }, [userId]);
  return {
    isTrainer: !!userId && result?.userId === userId && result.allowed,
    checking: !!userId && result?.userId !== userId,
  };
}
