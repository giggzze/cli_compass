"use client";

import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useRouter } from "next/navigation";
import { ProcessStepForm } from "../../components/ProcessStepForm";
import { EditableStepList } from "../../components/EditableStepList";
import { Process, ProcessStep } from "../../components/types";

export default function EditProcessPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [processTitle, setProcessTitle] = useState("");
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [currentStep, setCurrentStep] = useState<ProcessStep>({
    title: "",
    description: "",
    code_block: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProcess = async () => {
      try {
        const response = await fetch(`/api/processes/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setProcessTitle(data.data.title);
          setSteps(data.data.steps);
        } else {
          console.error("Failed to fetch process:", data.error);
          alert("Failed to fetch process. Please try again.");
          router.push("/process");
        }
      } catch (error) {
        console.error("Error fetching process:", error);
        alert("An error occurred. Please try again.");
        router.push("/process");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcess();
  }, [params.id, router]);

  const addStep = () => {
    if (currentStep.title && currentStep.description) {
      setSteps([...steps, { ...currentStep, order: steps.length }]);
      setCurrentStep({ title: "", description: "", code_block: "" });
    }
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateProcess = async () => {
    if (!processTitle || steps.length === 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/processes/${params.id}`, {
        method: "PUT",
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
        router.push("/process");
        router.refresh();
      } else {
        console.error("Failed to update process:", data.error);
        alert("Failed to update process. Please try again.");
      }
    } catch (error) {
      console.error("Error updating process:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="text-center">Loading process...</div>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold mb-6">Edit Process</h1>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Process Title</label>
          <Input
            type="text"
            value={processTitle}
            onChange={(e) => setProcessTitle(e.target.value)}
            placeholder="Enter process title"
            className="mb-4"
          />
        </div>

        <EditableStepList steps={steps} onRemove={removeStep} />

        <ProcessStepForm
          step={currentStep}
          onChange={setCurrentStep}
          onAdd={addStep}
        />

        <Button
          onClick={updateProcess}
          disabled={!processTitle || steps.length === 0 || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Updating..." : "Update Process"}
        </Button>
      </div>
    </div>
  );
}
