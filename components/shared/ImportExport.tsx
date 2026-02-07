"use client";

import { useState, useRef } from "react";
import {
  Download,
  Upload,
  FileJson,
  FileText,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface ImportExportProps {
  className?: string;
}

interface ImportResults {
  commands: { imported: number; skipped: number };
  processes: { imported: number; skipped: number };
  tags: { imported: number; skipped: number };
  collections: { imported: number; skipped: number };
}

export function ImportExport({ className }: ImportExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<"json" | "markdown">("json");
  const [importResults, setImportResults] = useState<ImportResults | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      const response = await fetch(`/api/export?format=${exportFormat}`);

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cli-compass-export-${Date.now()}.${exportFormat === "json" ? "json" : "md"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setError(null);
    setImportResults(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const response = await fetch("/api/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Import failed");
      }

      setImportResults(result.results);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid file format. Please select a valid JSON file.");
      } else {
        setError("Failed to import data. Please try again.");
      }
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const totalImported = importResults
    ? importResults.commands.imported +
      importResults.processes.imported +
      importResults.tags.imported +
      importResults.collections.imported
    : 0;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Export Section */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Download className="h-5 w-5 text-blue-500" />
          Export Data
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          Export your commands, processes, tags, and collections. Choose JSON
          for re-importing later, or Markdown for documentation.
        </p>

        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setExportFormat("json")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                exportFormat === "json"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <FileJson className="h-4 w-4" />
              JSON
            </button>
            <button
              onClick={() => setExportFormat("markdown")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                exportFormat === "markdown"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <FileText className="h-4 w-4" />
              Markdown
            </button>
          </div>

          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload className="h-5 w-5 text-green-500" />
          Import Data
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          Import commands, processes, tags, and collections from a JSON file.
          Existing items will not be duplicated.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Button
          variant="outline"
          onClick={handleImportClick}
          disabled={isImporting}
        >
          {isImporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Select File
            </>
          )}
        </Button>

        {/* Import Results */}
        {importResults && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
              <Check className="h-4 w-4" />
              Import Complete
            </div>
            <div className="text-sm text-green-600 space-y-1">
              <p>
                Commands: {importResults.commands.imported} imported,{" "}
                {importResults.commands.skipped} skipped
              </p>
              <p>
                Processes: {importResults.processes.imported} imported,{" "}
                {importResults.processes.skipped} skipped
              </p>
              <p>
                Tags: {importResults.tags.imported} imported,{" "}
                {importResults.tags.skipped} skipped
              </p>
              <p>
                Collections: {importResults.collections.imported} imported,{" "}
                {importResults.collections.skipped} skipped
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
