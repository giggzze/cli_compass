"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProcessCard } from "./ProcessCard";
import { IProcess } from "@/app/models/Process";
import { Button } from "../ui/button";
interface ProcessPageContentProps {
  privacy: "public" | "private";
}

export default function ProcessPageContent({
  privacy,
}: ProcessPageContentProps) {
  const [processes, setProcesses] = useState<IProcess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProcessId, setExpandedProcessId] = useState<string | null>(
    null
  );
  const [currentSteps, setCurrentSteps] = useState<Record<string, number>>({});

  const handleStepClick = (processId: string, stepOrder: number) => {
    setCurrentSteps((prev) => ({
      ...prev,
      [processId]: stepOrder,
    }));
  };

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const endpoint =
          privacy === "private" ? "/api/processes/private" : "/api/processes";
        const response = await fetch(endpoint);
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
  }, [privacy]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading processes...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-4">
        {processes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No processes found</p>
            <Link href="/private/process/add">
              <Button>Create Your First Process</Button>
            </Link>
          </div>
        ) : (
          processes.map((process) => (
            <ProcessCard
              key={process.id}
              id={process.id}
              isPrivate={process.isPrivate}
              user={process.user}
              createdAt={process.createdAt}
              title={process.title}
              steps={process.steps}
              isExpanded={expandedProcessId === process.id}
              currentStep={currentSteps[process.id]}
              onToggleExpand={(id) =>
                setExpandedProcessId(expandedProcessId === id ? null : id)
              }
              onStepClick={handleStepClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
