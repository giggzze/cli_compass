"use client";

import { Edit, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { StepList } from "./StepList";
import { IProcessStep } from "@/app/models/Process";
import { Button } from "../ui/button";

interface ProcessCardProps {
  id: string;
  title: string;
  steps: IProcessStep[];
  isExpanded: boolean;
  currentStep: number | undefined;
  createdAt: string;
  onToggleExpand: (id: string) => void;
  onStepClick: (processId: string, stepOrder: number) => void;
}

export function ProcessCard({
  id,
  title,
  steps,
  isExpanded,
  currentStep,
  createdAt,
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
          <span className="text-sm text-gray-500">
            {new Date(createdAt).toLocaleDateString()}
          </span>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="flex gap-2 ml-2">
          <Link href={`/process/edit/${id}`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => onToggleExpand(id)}>
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
