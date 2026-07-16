"use client";

import { StepList } from "./StepList";
import {ProcessStep} from "@/types/STT";

interface StepPreviewProps {
  steps: ProcessStep[];
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
