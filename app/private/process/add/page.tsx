"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ICreateProcessStep, IProcessStep } from "@/app/models/Process";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProcessStepForm } from "@/components/process/ProcessStepForm";
import { StepPreview } from "@/components/process/StepPreview";

export default function ProcessPage() {
  const router = useRouter();
  const [processTitle, setProcessTitle] = useState("");
  const [steps, setSteps] = useState<ICreateProcessStep[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<ICreateProcessStep>({
    code: "",
    stepExplanation: "",
  });

  // add a new step to the process that is being created
  const addStep = () => {
    if (currentStep.stepExplanation) {
      setSteps([...steps, { ...currentStep, order: steps.length + 1 }]);
      setCurrentStep({ stepExplanation: "", code: "" });
    }
  };

  // save the process
  const saveProcess = async () => {
    if (!processTitle || steps.length === 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/processes/private", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: processTitle,
          steps: steps,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/private/process");
        router.refresh();
      } else {
        console.error("Failed to save process:", data.error);
        alert("Failed to save process. Please try again.");
      }
    } catch (error) {
      console.error("Error saving process:", error);
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
        onClick={() => router.push("/process")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Processes
      </Button>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold mb-6">Create Process</h1>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Process Title
          </label>
          <Input
            type="text"
            value={processTitle}
            onChange={(e) => setProcessTitle(e.target.value)}
            placeholder="Enter process title"
            className="mb-4"
          />
        </div>

        <ProcessStepForm
          step={currentStep}
          onChange={setCurrentStep}
          onAdd={addStep}
        />

        <StepPreview steps={steps} />

        <Button
          onClick={saveProcess}
          disabled={!processTitle || steps.length === 0 || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Saving..." : "Save Process"}
        </Button>
      </div>
    </div>
  );
}
