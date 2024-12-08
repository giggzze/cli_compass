export interface ProcessStep {
  id?: string;
  title: string;
  description: string;
  code_block?: string;
  order?: number;
}

export interface Process {
  id: string;
  title: string;
  steps: ProcessStep[];
  created_at: string;
  updated_at: string;
}
