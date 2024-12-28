"use client";

import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ICreateProcessStep, IProcessStep } from "@/app/models/Process";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProcessStepForm } from "@/components/process/ProcessStepForm";
import { StepPreview } from "@/components/process/StepPreview";
import { EditableStepList } from "@/components/process/EditableStepList";
import { PrivacyToggle } from "@/components/shared/PrivacyToggle";

interface ProcessFormProps {
  mode: "add" | "edit";
  processId?: string;
  initialData?: {
    title: string;
    steps: IProcessStep[];
    isPrivate?: boolean;
  };
  backUrl: string;
}

export function ProcessForm({
  mode,
  processId,
  initialData,
  backUrl,
}: ProcessFormProps) {
  const router = useRouter();
  const [processTitle, setProcessTitle] = useState(initialData?.title || "");
  const [steps, setSteps] = useState<IProcessStep[]>(initialData?.steps || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrivate, setIsPrivate] = useState(initialData?.isPrivate ?? true);
  const [currentStep, setCurrentStep] = useState<ICreateProcessStep>({
    code: "",
    stepExplanation: "",
  });

  const addStep = () => {
    if (currentStep.stepExplanation) {
      setSteps([...steps, { ...currentStep, order: steps.length + 1 }]);
      setCurrentStep({ stepExplanation: "", code: "" });
    }
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, updatedStep: IProcessStep) => {
    const newSteps = [...steps];
    newSteps[index] = { ...updatedStep, order: index };
    setSteps(newSteps);
  };

  const handleSubmit = async () => {
    if (!processTitle || steps.length === 0) return;

    setIsSubmitting(true);
    try {
      const url =
        mode === "add"
          ? "/api/processes/private"
          : `/api/processes/private/${processId}`;

      const method = mode === "add" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: processTitle,
          steps: steps,
          ...(mode === "add" && { isPrivate }),
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(backUrl);
        router.refresh();
      } else {
        console.error(`Failed to ${mode} process:`, data.error);
        alert(`Failed to ${mode} process. Please try again.`);
      }
    } catch (error) {
      console.error(`Error ${mode}ing process:`, error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push(backUrl)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Processes
      </Button>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold mb-6">
          {mode === "add" ? "Create" : "Edit"} Process
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Process Title
          </label>
          <Input
            type="text"
            placeholder="Enter process title"
            value={processTitle}
            onChange={(e) => setProcessTitle(e.target.value)}
          />
        </div>

        {mode === "edit" && (
          <EditableStepList
            steps={steps}
            onRemove={removeStep}
            onUpdate={updateStep}
          />
        )}

        <ProcessStepForm
          step={currentStep}
          onChange={setCurrentStep}
          onAdd={addStep}
        />

        {mode === "add" && (
          <>
            <PrivacyToggle isPrivate={isPrivate} onChange={setIsPrivate} />
            <StepPreview steps={steps} />
          </>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!processTitle || steps.length === 0 || isSubmitting}
          className="w-full"
        >
          {isSubmitting
            ? `${mode === "add" ? "Saving" : "Updating"}...`
            : `${mode === "add" ? "Save" : "Update"} Process`}
        </Button>
      </div>
    </div>
  );
}
