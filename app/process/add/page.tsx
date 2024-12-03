"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { useRouter } from "next/navigation";

interface ProcessStep {
  title: string;
  description: string;
  code_block?: string;
}

export default function ProcessPage() {
  const router = useRouter();
  const [processTitle, setProcessTitle] = useState("");
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [currentStep, setCurrentStep] = useState<ProcessStep>({
    title: "",
    description: "",
    code_block: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addStep = () => {
    if (currentStep.title && currentStep.description) {
      setSteps([...steps, currentStep]);
      setCurrentStep({ title: "", description: "", code_block: "" });
    }
  };

  const saveProcess = async () => {
    if (!processTitle || steps.length === 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/processes", {
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
        router.push("/process");
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

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Step</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Step Title
              </label>
              <Input
                type="text"
                value={currentStep.title}
                onChange={(e) =>
                  setCurrentStep({ ...currentStep, title: e.target.value })
                }
                placeholder="Enter step title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                value={currentStep.description}
                onChange={(e) =>
                  setCurrentStep({
                    ...currentStep,
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
                value={currentStep.code_block || ""}
                onChange={(e) =>
                  setCurrentStep({ ...currentStep, code_block: e.target.value })
                }
                placeholder="Enter code if applicable"
                rows={5}
                className="font-mono"
              />
            </div>

            <Button onClick={addStep}>Add Step</Button>
          </div>
        </div>

        {steps.length > 0 && (
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
        )}

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
