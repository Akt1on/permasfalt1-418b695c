import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const applySession = async (sess: Session | null) => {
      if (!alive) return;
      setLoading(true);
      setSession(sess);
      setUser(sess?.user ?? null);

      if (!sess?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", sess.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!alive) return;
      setIsAdmin(!error && !!data);
      setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess) => {
      setTimeout(() => { void applySession(sess); }, 0);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      void applySession(session);
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  return { session, user, isAdmin, loading };
}
