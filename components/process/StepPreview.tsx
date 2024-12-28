"use client";

import { IProcessStep } from "@/app/models/Process";
import { StepList } from "./StepList";

interface StepPreviewProps {
  steps: IProcessStep[];
}

export function StepPreview({ steps }: StepPreviewProps) {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <StepList 
        steps={steps}
        isEditable={false}
      />
    </div>
  );
}
