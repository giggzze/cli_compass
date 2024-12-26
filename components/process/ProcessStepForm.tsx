"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ProcessStep } from "./types";

interface ProcessStepFormProps {
  step: ProcessStep;
  onChange: (step: ProcessStep) => void;
  onAdd: () => void;
}

export function ProcessStepForm({ step, onChange, onAdd }: ProcessStepFormProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Add Step</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Step Title
          </label>
          <Input
            type="text"
            value={step.title}
            onChange={(e) =>
              onChange({ ...step, title: e.target.value })
            }
            placeholder="Enter step title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description
          </label>
          <Textarea
            value={step.description}
            onChange={(e) =>
              onChange({
                ...step,
                description: e.target.value,
              })
            }
            placeholder="Enter step description"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Code Block (Optional)
          </label>
          <Textarea
            value={step.code_block || ""}
            onChange={(e) =>
              onChange({ ...step, code_block: e.target.value })
            }
            placeholder="Enter code if applicable"
            rows={5}
            className="font-mono"
          />
        </div>

        <Button onClick={onAdd}>Add Step</Button>
      </div>
    </div>
  );
}
