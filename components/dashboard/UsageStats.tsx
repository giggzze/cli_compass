"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  ClipboardCopy,
  Eye,
  Clock,
  TrendingUp,
  Terminal,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandStats {
  commandId: string;
  description: string | null;
  code: string | null;
  categoryName: string | null;
  totalCount: number;
  lastUsed: string | null;
}

interface UsageData {
  mostUsed: CommandStats[];
  recentlyUsed: CommandStats[];
  totalCopies: number;
  totalViews: number;
}

interface UsageStatsProps {
  className?: string;
  onCommandClick?: (commandId: string) => void;
}

export function UsageStats({ className, onCommandClick }: UsageStatsProps) {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/usage");
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Failed to load usage statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={cn("text-center p-8 text-gray-500", className)}>
        {error || "No usage data available"}
      </div>
    );
  }

  const totalActions = data.totalCopies + data.totalViews;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Actions</p>
              <p className="text-2xl font-bold">{totalActions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ClipboardCopy className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Commands Copied</p>
              <p className="text-2xl font-bold">{data.totalCopies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Commands Viewed</p>
              <p className="text-2xl font-bold">{data.totalViews}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Used Commands */}
        <div className="bg-white rounded-lg border">
          <div className="flex items-center gap-2 p-4 border-b">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Most Used Commands</h3>
          </div>
          <div className="divide-y">
            {data.mostUsed.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No usage data yet. Start using commands!
              </div>
            ) : (
              data.mostUsed.slice(0, 5).map((cmd, index) => (
                <div
                  key={cmd.commandId}
                  onClick={() => onCommandClick?.(cmd.commandId)}
                  className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 line-clamp-1">
                        {cmd.description || "Untitled"}
                      </p>
                      {cmd.code && (
                        <code className="text-xs text-gray-500 truncate block">
                          {cmd.code}
                        </code>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {cmd.totalCount} uses
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recently Used Commands */}
        <div className="bg-white rounded-lg border">
          <div className="flex items-center gap-2 p-4 border-b">
            <Clock className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Recently Used</h3>
          </div>
          <div className="divide-y">
            {data.recentlyUsed.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No recent activity
              </div>
            ) : (
              data.recentlyUsed.slice(0, 5).map((cmd) => (
                <div
                  key={`${cmd.commandId}-${cmd.lastUsed}`}
                  onClick={() => onCommandClick?.(cmd.commandId)}
                  className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-gray-100 rounded">
                      <Terminal className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 line-clamp-1">
                        {cmd.description || "Untitled"}
                      </p>
                      {cmd.lastUsed && (
                        <p className="text-xs text-gray-400">
                          {formatRelativeTime(new Date(cmd.lastUsed))}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
}
