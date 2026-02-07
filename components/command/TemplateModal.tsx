"use client";

import { useState, useEffect } from "react";
import { X, Variable, ClipboardCopy, Check, Clock } from "lucide-react";
import { Button } from "../ui/button";
import {
  parseTemplate,
  applyTemplate,
  getRecentValues,
  saveRecentValue,
  TemplateVariable,
} from "@/lib/templateParser";
import { cn } from "@/lib/utils";

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: string;
  onCopy?: (resolvedCommand: string) => void;
}

export function TemplateModal({
  isOpen,
  onClose,
  template,
  onCopy,
}: TemplateModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [variables, setVariables] = useState<TemplateVariable[]>([]);

  // Parse template when it changes
  useEffect(() => {
    const parsed = parseTemplate(template);
    setVariables(parsed.variables);

    // Initialize with default values
    const initialValues: Record<string, string> = {};
    parsed.variables.forEach((v) => {
      initialValues[v.name] = v.defaultValue || "";
    });
    setValues(initialValues);
  }, [template]);

  const handleValueChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const resolvedCommand = applyTemplate(template, values);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resolvedCommand);

      // Save recent values
      Object.entries(values).forEach(([name, value]) => {
        if (value) {
          saveRecentValue(name, value);
        }
      });

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      onCopy?.(resolvedCommand);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <Variable className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Fill in Variables</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Variables */}
          <div className="space-y-4">
            {variables.map((variable) => {
              const recentValues = getRecentValues(variable.name);
              return (
                <div key={variable.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {variable.name}
                    {variable.defaultValue && (
                      <span className="ml-2 text-xs text-gray-400">
                        (default: {variable.defaultValue})
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={values[variable.name] || ""}
                    onChange={(e) =>
                      handleValueChange(variable.name, e.target.value)
                    }
                    placeholder={variable.defaultValue || `Enter ${variable.name}`}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Recent values */}
                  {recentValues.length > 0 && (
                    <div className="mt-1 flex items-center gap-1 flex-wrap">
                      <Clock className="h-3 w-3 text-gray-400" />
                      {recentValues.map((recent, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            handleValueChange(variable.name, recent)
                          }
                          className="text-xs px-2 py-0.5 bg-gray-100 rounded hover:bg-gray-200 transition-colors truncate max-w-[150px]"
                        >
                          {recent}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preview
            </label>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap break-all">
                <code>{resolvedCommand}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCopy}
            className={cn(
              "transition-colors",
              copied && "bg-green-500 hover:bg-green-600"
            )}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied!
              </>
            ) : (
              <>
                <ClipboardCopy className="h-4 w-4 mr-1" />
                Copy Command
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
