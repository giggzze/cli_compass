import { processes, processSteps } from "@/db/schema";

export type IProcess = typeof processes.$inferSelect;
export type IProcessStep = typeof processSteps.$inferSelect;

// interfaces for processes
export interface GetProcessWithStep extends IProcess {
	steps: IProcessStep[] | [];
	user: {
		id: string | null;
		username: string | null;
		avatarUrl: string | null;
	};
}

export interface ICreateProcessStep {
	processId: string;
	stepExplanation: string;
	code: string;
	order: number;
}
