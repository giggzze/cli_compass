"use client";

import { IProcessStep } from "@/app/models/Process";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { IProcessStepFormProps } from "@/app/models/Process";

export function ProcessStepForm({
  step,
  onChange,
  onAdd,
}: IProcessStepFormProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Add Step</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Explanation</label>
          <Textarea
            value={step.stepExplanation || ""}
            onChange={(e) =>
              onChange({
                ...step,
                stepExplanation: e.target.value,
              })
            }
            placeholder="Enter a explanation for this step"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Code Block (Optional)
          </label>
          <Textarea
            value={step.code || ""}
            onChange={(e) => onChange({ ...step, code: e.target.value })}
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
