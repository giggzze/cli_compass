"use client";

import { IProcessStep } from "@/app/models/Process";
import { StepList } from "./StepList";

interface EditableStepListProps {
  steps: IProcessStep[];
  onRemove: (index: number) => void;
  onUpdate: (index: number, updatedStep: IProcessStep) => void;
}

export function EditableStepList({
  steps,
  onRemove,
  onUpdate,
}: EditableStepListProps) {
  return (
    <StepList
      steps={steps}
      isEditable={true}
      onUpdate={onUpdate}
      onRemove={onRemove}
    />
  );
}
