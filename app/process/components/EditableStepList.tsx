"use client";

import { Button } from "@/app/components/ui/button";
import { ProcessStep } from "./types";

interface EditableStepListProps {
  steps: ProcessStep[];
  onRemove: (index: number) => void;
}

export function EditableStepList({ steps, onRemove }: EditableStepListProps) {
  if (steps.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Current Steps</h2>
      {steps.map((step, index) => (
        <div
          key={index}
          className="bg-gray-50 p-4 rounded-lg mb-4 relative"
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => onRemove(index)}
          >
            Remove
          </Button>
          <h3 className="font-medium">{step.title}</h3>
          <p className="text-gray-600 mt-1">{step.description}</p>
          {step.code_block && (
            <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">
              {step.code_block}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}
