"use client";

import { IProcessStep } from "@/app/models/Process";
import { useState } from "react";
import { Code2, ClipboardCopy, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepListProps {
  processId: string;
  steps: IProcessStep[];
  currentStep?: number;
  onStepClick: (processId: string, stepOrder: number) => void;
}

export function StepList({
  processId,
  steps,
  currentStep,
  onStepClick,
}: StepListProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="divide-y divide-gray-100">
      {steps
        .sort((a, b) => a.order! - b.order!)
        .map((step) => (
          <div
            key={step.id}
            className={cn(
              "p-4 transition-colors",
              currentStep === step.order
                ? "bg-blue-50/50"
                : "hover:bg-gray-50/50",
              "cursor-pointer"
            )}
            onClick={() => onStepClick(processId, step.order!)}
          >
            {/* Step Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                  {step.order! + 1}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                    step.code
                      ? "bg-gray-100 text-gray-600"
                      : "bg-red-100 text-red-600"
                  )}
                >
                  <Code2 className="h-3 w-3" />
                  {step.code ? "Code Included" : "No Code"}
                </span>
              </div>
            </div>

            {/* Step Content */}
            <div className="space-y-3">
              <p className="text-gray-700 text-sm leading-relaxed">
                {step.stepExplanation}
              </p>

              {/* Code Block */}
              {step.code && (
                <div className="relative group mt-2">
                  <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <code className="text-gray-100 text-sm font-mono whitespace-pre-wrap break-words">
                      {step.code}
                    </code>
                  </pre>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(step.code!);
                    }}
                    className={cn(
                      "absolute top-2 right-2 p-2 rounded-md transition-all duration-200",
                      copiedCode === step.code
                        ? "bg-green-500 text-white"
                        : "bg-gray-800 text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-gray-700"
                    )}
                  >
                    {copiedCode === step.code ? (
                      <CheckCheck className="h-4 w-4" />
                    ) : (
                      <ClipboardCopy className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {copiedCode === step.code ? "Copied!" : "Copy code"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
