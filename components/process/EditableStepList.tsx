import { StepList } from "./StepList";
import {ProcessStep} from "@/types/STT";

interface EditableStepListProps {
  steps: ProcessStep[];
  onRemove: (index: number) => void;
  onUpdate: (index: number, updatedStep: ProcessStep) => void;
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
