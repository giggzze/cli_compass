"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { ProcessStep } from "./types";

interface StepListProps {
  processId: string;
  steps: ProcessStep[];
  currentStep?: number;
  onStepClick: (processId: string, stepOrder: number) => void;
}

export function StepList({ processId, steps, currentStep, onStepClick }: StepListProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {steps
        .sort((a, b) => a.order - b.order)
        .map((step) => (
          <div
            key={step.id}
            className={`border-l-4 pl-4 cursor-pointer transition-colors ${
              currentStep === step.order
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onStepClick(processId, step.order);
            }}
          >
            <h3 className="font-medium">{step.title}</h3>
            <p className="text-gray-600 mt-1">{step.description}</p>
            {step.code_block && (
              <div className="mt-2 relative">
                <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto">
                  <code>{step.code_block}</code>
                </pre>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(step.code_block!);
                  }}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded"
                >
                  {copiedCode === step.code_block ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
