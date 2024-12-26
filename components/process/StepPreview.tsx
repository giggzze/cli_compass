"use client";

import { ProcessStep } from "./types";

interface StepPreviewProps {
  steps: ProcessStep[];
}

export function StepPreview({ steps }: StepPreviewProps) {
  if (steps.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Steps</h2>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold">{step.title}</h3>
            <p className="mt-2 text-gray-600">{step.description}</p>
            {step.code_block && (
              <pre className="mt-2 bg-gray-50 p-3 rounded font-mono text-sm">
                {step.code_block}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
