"use client";

import { Button } from "@/app/components/ui/button";
import { Edit, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { ProcessStep } from "./types";
import { StepList } from "./StepList";

interface ProcessCardProps {
  id: string;
  title: string;
  steps: ProcessStep[];
  isExpanded: boolean;
  currentStep: number | undefined;
  onToggleExpand: (id: string) => void;
  onStepClick: (processId: string, stepOrder: number) => void;
}

export function ProcessCard({
  id,
  title,
  steps,
  isExpanded,
  currentStep,
  onToggleExpand,
  onStepClick,
}: ProcessCardProps) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex justify-between items-center">
        <div 
          className="flex-1 cursor-pointer"
          onClick={() => onToggleExpand(id)}
        >
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="flex gap-2">
          <Link href={`/process/edit/${id}`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleExpand(id)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isExpanded && steps.length > 0 && (
        <StepList
          processId={id}
          steps={steps}
          currentStep={currentStep}
          onStepClick={onStepClick}
        />
      )}
    </div>
  );
}
