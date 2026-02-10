"use client";

import { useQuery } from "@tanstack/react-query";
import { commandQueryKeys } from "@/app/services/commandService";
import type { Category, Command } from "@/types/STT";

/** API response shape for command list (with optional category, user, isFavorite) */
export type CommandListItem = Command & {
  category?: Category | null;
  user?: { id: string } | null;
  isFavorite?: boolean;
};

async function fetchCommands(endpoint: string): Promise<CommandListItem[]> {
  const res = await fetch(endpoint);
  const data = await res.json();
  if (!data.success) return [];
  return data.data as CommandListItem[];
}

export function useCommandsQuery(commandsEndpoint: string) {
  return useQuery({
    queryKey: commandQueryKeys.list(commandsEndpoint),
    queryFn: () => fetchCommands(commandsEndpoint),
  });
}
