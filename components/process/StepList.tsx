"use client";

import { IProcessStep } from "@/app/models/Process";
import { useState } from "react";
import { Code2, ClipboardCopy, CheckCheck, Pencil, Save, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface BaseStepListProps {
  steps: IProcessStep[];
  isEditable?: boolean;
  currentStep?: number;
  processId?: string;
  onStepClick?: (processId: string, stepOrder: number) => void;
  onUpdate?: (index: number, updatedStep: IProcessStep) => void;
  onRemove?: (index: number) => void;
}

export function StepList({
  steps,
  isEditable = false,
  currentStep,
  processId,
  onStepClick,
  onUpdate,
  onRemove,
}: BaseStepListProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingStep, setEditingStep] = useState<IProcessStep | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleEdit = (index: number, step: IProcessStep) => {
    setEditingIndex(index);
    setEditingStep({ ...step });
  };

  const handleSave = () => {
    if (editingStep && editingIndex !== null && onUpdate) {
      onUpdate(editingIndex, editingStep);
      setEditingIndex(null);
      setEditingStep(null);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditingStep(null);
  };

  const handleStepClick = (step: IProcessStep) => {
    if (!isEditable && onStepClick && processId) {
      onStepClick(processId, step.order!);
    }
  };

  return (
    <div className="space-y-4">
      {isEditable && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Process Steps</h2>
          <span className="text-sm text-gray-500">{steps.length} steps</span>
        </div>
      )}

      <div className={cn("divide-y divide-gray-100", isEditable && "rounded-lg border border-gray-200")}>
        {steps
          .sort((a, b) => a.order! - b.order!)
          .map((step, index) => (
            <div
              key={step.id || index}
              className={cn(
                "p-4 transition-colors",
                editingIndex === index 
                  ? "bg-blue-50/50" 
                  : currentStep === step.order
                    ? "bg-blue-50/50"
                    : "hover:bg-gray-50/50",
                !isEditable && "cursor-pointer"
              )}
              onClick={() => handleStepClick(step)}
            >
              {editingIndex === index ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                        className="h-8 px-2"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Cancel editing</span>
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleSave}
                        className="h-8 px-3"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Step Explanation
                      </label>
                      <Textarea
                        value={editingStep?.stepExplanation || ""}
                        onChange={(e) =>
                          setEditingStep({
                            ...editingStep!,
                            stepExplanation: e.target.value,
                          })
                        }
                        placeholder="Explain what this step does..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code (Optional)
                      </label>
                      <Textarea
                        value={editingStep?.code || ""}
                        onChange={(e) =>
                          setEditingStep({
                            ...editingStep!,
                            code: e.target.value,
                          })
                        }
                        placeholder="Add code for this step..."
                        className="font-mono min-h-[120px]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
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
                    {isEditable && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(index, step);
                          }}
                          className="h-8 px-2 text-gray-500 hover:text-gray-700"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit step</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove?.(index);
                          }}
                          className="h-8 px-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove step</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {step.stepExplanation}
                    </p>

                    {step.code && (
                      <div className="relative group">
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
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
