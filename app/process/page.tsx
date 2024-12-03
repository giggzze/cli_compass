"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  code_block?: string;
  order: number;
}

interface Process {
  id: string;
  title: string;
  steps: ProcessStep[];
  created_at: string;
  updated_at: string;
}

export default function ProcessPage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProcessId, setExpandedProcessId] = useState<string | null>(
    null
  );
  const [currentSteps, setCurrentSteps] = useState<Record<string, number>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleStepClick = (processId: string, stepOrder: number) => {
    setCurrentSteps((prev) => ({
      ...prev,
      [processId]: stepOrder,
    }));
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await fetch("/api/processes");
        const data = await response.json();

        if (data.success) {
          setProcesses(data.data);
        } else {
          console.error("Failed to fetch processes:", data.error);
        }
      } catch (error) {
        console.error("Error fetching processes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcesses();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading processes...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold ">Processes</h1>
        
      </div> */}

      <div className="space-y-4">
        {processes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No processes found</p>
            <Link href="/process/add">
              <Button>Create Your First Process</Button>
            </Link>
          </div>
        ) : (
          processes.map((process) => (
            <div
              key={process.id}
              className="bg-white rounded-lg border p-4 cursor-pointer"
              onClick={() =>
                setExpandedProcessId(
                  expandedProcessId === process.id ? null : process.id
                )
              }
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{process.title}</h2>
                <span className="text-sm text-gray-500">
                  {new Date(process.created_at).toLocaleDateString()}
                </span>
              </div>

              {expandedProcessId === process.id && process.steps.length > 0 && (
                <div className="mt-4 space-y-4">
                  {process.steps
                    .sort((a, b) => a.order - b.order)
                    .map((step) => (
                      <div
                        key={step.id}
                        className={`border-l-4 pl-4 cursor-pointer transition-colors ${
                          currentSteps[process.id] === step.order
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStepClick(process.id, step.order);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{step.title}</h3>
                          <span className="text-sm text-gray-500">
                            Step {step.order}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-600">{step.description}</p>
                        {step.code_block && (
                          <div
                            className="relative mt-2 group"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(step.code_block!);
                            }}
                          >
                            <pre className="bg-gray-50 p-3 rounded font-mono text-sm cursor-pointer hover:bg-gray-100">
                              {step.code_block}
                            </pre>
                            <span
                              className={`absolute top-2 right-2 text-xs px-2 py-1 rounded ${
                                copiedCode === step.code_block
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-200 text-gray-700 opacity-0 group-hover:opacity-100"
                              } transition-opacity`}
                            >
                              {copiedCode === step.code_block
                                ? "Copied!"
                                : "Click to copy"}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
