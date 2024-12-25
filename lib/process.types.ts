import { Process, ProcessStep } from "./db.types";

// interfaces for processes
export interface GetProcessWithStepDto extends Process {
	steps: ProcessStep[] | [];
	user: {
		id: string | null;
		username: string | null;
		avatarUrl: string | null;
	};
}

export interface CreateProcessStepDto {
	processId: string;
	stepExplanation: string;
	code: string;
	order: number;
}
