"use client";

import { Button } from "@/app/components/ui/button";
import { ProcessStep } from "./types";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { useState } from "react";

interface EditableStepListProps {
  steps: ProcessStep[];
  onRemove: (index: number) => void;
  onUpdate: (index: number, updatedStep: ProcessStep) => void;
}

export function EditableStepList({ steps, onRemove, onUpdate }: EditableStepListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingStep, setEditingStep] = useState<ProcessStep | null>(null);

  if (steps.length === 0) return null;

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingStep({ ...steps[index] });
  };

  const saveEdit = (index: number) => {
    if (editingStep) {
      onUpdate(index, editingStep);
      setEditingIndex(null);
      setEditingStep(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingStep(null);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Current Steps</h2>
      {steps.map((step, index) => (
        <div
          key={index}
          className="bg-gray-50 p-4 rounded-lg mb-4 relative"
        >
          {editingIndex === index ? (
            <div className="space-y-4">
              <Input
                value={editingStep?.title || ""}
                onChange={(e) => setEditingStep({ ...editingStep!, title: e.target.value })}
                placeholder="Step title"
                className="w-full"
              />
              <Textarea
                value={editingStep?.description || ""}
                onChange={(e) => setEditingStep({ ...editingStep!, description: e.target.value })}
                placeholder="Step description"
                className="w-full"
              />
              {step.code_block && (
                <Textarea
                  value={editingStep?.code_block || ""}
                  onChange={(e) => setEditingStep({ ...editingStep!, code_block: e.target.value })}
                  placeholder="Code block (optional)"
                  className="w-full font-mono"
                />
              )}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={cancelEdit}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => saveEdit(index)}>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-end gap-2 absolute top-2 right-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEditing(index)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                >
                  Remove
                </Button>
              </div>
              <h3 className="font-medium pr-32">{step.title}</h3>
              <p className="text-gray-600 mt-1">{step.description}</p>
              {step.code_block && (
                <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">
                  {step.code_block}
                </pre>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
