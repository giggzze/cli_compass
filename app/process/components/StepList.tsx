"use client";

import { useState } from "react";
import { ProcessStep } from "./types";

interface StepListProps {
  processId: string;
  steps: ProcessStep[];
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
        .sort((a, b) => a.order! - b.order!)
        .map((step) => (
          <div
            key={step.id}
            className={`border-l-4 pl-4 p-3 cursor-pointer transition-all duration-200 rounded-r hover:shadow-sm ${
              currentStep === step.order
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onStepClick(processId, step.order!);
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{step.title}</h3>
              <span className="text-sm text-gray-500 min-w-[50px] flex items-center justify-center">
                Step {step.order! + 1}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{step.description}</p>
            {step.code_block && (
              <div className="mt-3 relative group">
                <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-gray-100 text-sm">
                  <code>{step.code_block}</code>
                </pre>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(step.code_block!);
                  }}
                  className={`absolute top-3 right-3 px-3 py-1.5 text-xs rounded transition-all duration-200 ${
                    copiedCode === step.code_block
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-gray-600"
                  }`}
                >
                  {copiedCode === step.code_block ? "Copied!" : "Copy"}
                </button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
