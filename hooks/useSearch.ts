"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Fuse, { IFuseOptions } from "fuse.js";

interface SearchableItem {
  id: string;
  [key: string]: any;
}

interface UseSearchOptions<T> {
  items: T[];
  keys: string[];
  threshold?: number;
  limit?: number;
  sortFn?: (a: T, b: T) => number;
}

interface SearchResult<T> {
  item: T;
  score: number;
  matches?: Array<{
    key: string;
    value: string;
    indices: [number, number][];
  }>;
}

interface UseSearchReturn<T> {
  query: string;
  setQuery: (query: string) => void;
  results: T[];
  isSearching: boolean;
  recentSearches: string[];
  addToRecentSearches: (query: string) => void;
  clearRecentSearches: () => void;
}

const RECENT_SEARCHES_KEY = "cli-compass-recent-searches";
const MAX_RECENT_SEARCHES = 5;

export function useSearch<T extends SearchableItem>({
  items,
  keys,
  threshold = 0.3,
  limit = 50,
  sortFn,
}: UseSearchOptions<T>): UseSearchReturn<T> {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch {
          // Ignore parsing errors
        }
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearches = useCallback((searches: string[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    }
  }, []);

  const addToRecentSearches = useCallback(
    (searchQuery: string) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) return;

      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s !== trimmed);
        const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
        saveRecentSearches(updated);
        return updated;
      });
    },
    [saveRecentSearches]
  );

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    }
  }, []);

  // Create Fuse instance
  const fuse = useMemo(() => {
    const options: IFuseOptions<T> = {
      keys,
      threshold,
      includeScore: true,
      includeMatches: true,
      ignoreLocation: true,
      useExtendedSearch: true,
    };
    return new Fuse(items, options);
  }, [items, keys, threshold]);

  // Perform search
  const results = useMemo(() => {
    if (!query.trim()) {
      // Return all items if no query, optionally sorted
      let allItems = [...items];
      if (sortFn) {
        allItems.sort(sortFn);
      }
      return allItems.slice(0, limit);
    }

    const searchResults = fuse.search(query, { limit });

    return searchResults.map((result) => result.item);
  }, [query, fuse, items, limit, sortFn]);

  const isSearching = query.trim().length > 0;

  return {
    query,
    setQuery,
    results,
    isSearching,
    recentSearches,
    addToRecentSearches,
    clearRecentSearches,
  };
}

// Filter helpers
export interface SearchFilters {
  categoryId?: string;
  tagIds?: string[];
  favorites?: boolean;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
}

export function applyFilters<T extends SearchableItem>(
  items: T[],
  filters: SearchFilters,
  getItemProps: {
    getCategoryId?: (item: T) => string | null | undefined;
    getTagIds?: (item: T) => string[];
    getIsFavorite?: (item: T) => boolean;
    getCreatedAt?: (item: T) => Date | string | null | undefined;
  }
): T[] {
  return items.filter((item) => {
    // Category filter
    if (
      filters.categoryId &&
      getItemProps.getCategoryId &&
      getItemProps.getCategoryId(item) !== filters.categoryId
    ) {
      return false;
    }

    // Tags filter (any match)
    if (
      filters.tagIds &&
      filters.tagIds.length > 0 &&
      getItemProps.getTagIds
    ) {
      const itemTags = getItemProps.getTagIds(item);
      if (!filters.tagIds.some((tagId) => itemTags.includes(tagId))) {
        return false;
      }
    }

    // Favorites filter
    if (
      filters.favorites &&
      getItemProps.getIsFavorite &&
      !getItemProps.getIsFavorite(item)
    ) {
      return false;
    }

    // Date range filter
    if (filters.dateRange && getItemProps.getCreatedAt) {
      const createdAt = getItemProps.getCreatedAt(item);
      if (createdAt) {
        const date = new Date(createdAt);
        if (filters.dateRange.start && date < filters.dateRange.start) {
          return false;
        }
        if (filters.dateRange.end && date > filters.dateRange.end) {
          return false;
        }
      }
    }

    return true;
  });
}
