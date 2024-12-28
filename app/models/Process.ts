import { processes, processSteps } from "@/db/schema";
import { IProfile } from "./Profile";

export type IProcess = typeof processes.$inferSelect;
export type IProcessStep = typeof processSteps.$inferSelect;

// interfaces for processes
export interface IGetProcessWithStep extends IProcess {
	steps: IProcessStep[] | [];
	user: IProfile | null;
}

export interface ICreateProcessStep {
	processId?: string | null;
	stepExplanation: string | null;
	code: string | null;
	order?: number | null;
}

export interface IProcessStepFormProps {
	step: ICreateProcessStep;
	onChange: (step: ICreateProcessStep) => void;
	onAdd: () => void;
}
