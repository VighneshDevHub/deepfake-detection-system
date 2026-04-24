"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

function getDisplayName(user: User | null): string {
  const metadata = user?.user_metadata ?? {};
  return metadata.full_name || metadata.name || user?.email?.split("@")[0] || "Investigator";
}

function getRoleLabel(user: User | null): string {
  const metadata = user?.user_metadata ?? {};
  return metadata.role || "Authenticated User";
}

function getAvatarUrl(user: User | null): string | null {
  const metadata = user?.user_metadata ?? {};
  return metadata.avatar_url || metadata.picture || null;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "U";
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!isMounted) return;
      setUser(data.user ?? null);
      setIsLoading(false);
    };

    loadUser();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const profile = useMemo(() => {
    const displayName = getDisplayName(user);
    const email = user?.email || "";

    return {
      user,
      email,
      displayName,
      roleLabel: getRoleLabel(user),
      avatarUrl: getAvatarUrl(user),
      initials: getInitials(displayName),
    };
  }, [user]);

  return {
    ...profile,
    isLoading,
  };
}
