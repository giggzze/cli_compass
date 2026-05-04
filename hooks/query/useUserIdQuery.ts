"use client";

import { useQuery } from "@tanstack/react-query";
import { commandQueryKeys } from "@/app/services/commandService";

async function fetchUserId(): Promise<string | null> {
  const res = await fetch("/api/user-id");
  const data = await res.json();
  if (data.success) return data.data as string;
  return null;
}

export function useUserIdQuery(enabled: boolean) {
  return useQuery({
    queryKey: commandQueryKeys.userId(),
    queryFn: fetchUserId,
    enabled,
  });
}
