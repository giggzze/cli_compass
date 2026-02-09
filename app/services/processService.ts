import { supabase } from "@/supabase";
import type {
  IGetProcessWithStep,
  IProcessStep,
  ProcessStepInsert,
} from "@/types/STT";

export class ProcessService {
  private static mapProcessWithSteps(
    row: {
      id: string;
      title: string;
      user_id: string;
      is_private: boolean;
      created_at: string;
      updated_at?: string;
      process_steps?: unknown[] | null;
      profiles?: unknown;
    }[]
  ): IGetProcessWithStep[] {
    return row.map((p) => ({
      id: p.id,
      title: p.title,
      user_id: p.user_id,
      is_private: p.is_private,
      created_at: p.created_at,
      updated_at: p.updated_at,
      steps: Array.isArray(p.process_steps) ? p.process_steps : [],
      user: p.profiles ?? null,
    })) as IGetProcessWithStep[];
  }

  static async getPublicProcesses(): Promise<IGetProcessWithStep[]> {
    const { data, error } = await supabase
      .from("processes")
      .select("*, process_steps(*), profiles(*)")
      .eq("is_private", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error in getPublicProcesses:", error);
      return [];
    }
    return this.mapProcessWithSteps(data ?? []);
  }

  static async getPrivateProcesses(userId: string): Promise<IGetProcessWithStep[]> {
    const { data, error } = await supabase
      .from("processes")
      .select("*, process_steps(*), profiles(id, username, avatar_url)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error in getPrivateProcesses:", error);
      return [];
    }
    return this.mapProcessWithSteps(data ?? []);
  }

  static async getPrivateProcessesForUpdate(
    userId: string,
    processId: string
  ): Promise<IGetProcessWithStep[]> {
    const { data, error } = await supabase
      .from("processes")
      .select("*, process_steps(*)")
      .eq("id", processId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error in getPrivateProcessesForUpdate:", error);
      return [];
    }
    return this.mapProcessWithSteps(data ?? []);
  }

  static async createProcess(
    userId: string,
    title: string,
    steps: IProcessStep[],
    isPrivate = true
  ): Promise<void> {
    const { data: newProcess, error: processError } = await supabase
      .from("processes")
      .insert({
        user_id: userId,
        title,
        is_private: isPrivate,
      })
      .select("id")
      .single();

    if (processError || !newProcess) {
      console.error("Error in createProcess:", processError);
      throw new Error("Failed to create process");
    }

    if (steps.length === 0) return;

    const stepsToInsert: ProcessStepInsert[] = steps.map((step, index) => ({
      process_id: newProcess.id,
      stepExplanation: step.stepExplanation,
      code: step.code ?? null,
      image: step.image ?? null,
      order: index,
    }));

    const { error: stepsError } = await supabase
      .from("process_steps")
      .insert(stepsToInsert);

    if (stepsError) {
      console.error("Error in createProcess (steps):", stepsError);
      throw new Error("Failed to create process steps");
    }
  }

  /**
   * Checks if a user is associated with a specific process.
   */
  static async checkUserAssociation(
    userId: string,
    processId: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from("processes")
      .select("id")
      .eq("id", processId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) return false;
    return !!data;
  }

  static async updateProcess(
    userId: string,
    processId: string,
    title: string,
    steps: IProcessStep[]
  ): Promise<void | false> {
    const isOwner = await this.checkUserAssociation(userId, processId);
    if (!isOwner) return false;

    const { error: deleteError } = await supabase
      .from("process_steps")
      .delete()
      .eq("process_id", processId);

    if (deleteError) {
      console.error("Error in updateProcess (delete steps):", deleteError);
      throw new Error("Failed to update process");
    }

    const { error: updateError } = await supabase
      .from("processes")
      .update({ title })
      .eq("id", processId)
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error in updateProcess:", updateError);
      throw new Error("Failed to update process");
    }

    if (steps.length > 0) {
      const stepsToInsert: ProcessStepInsert[] = steps.map((step, index) => ({
        process_id: processId,
        stepExplanation: step.stepExplanation,
        code: step.code ?? null,
        image: step.image ?? null,
        order: index,
      }));

      const { error: insertError } = await supabase
        .from("process_steps")
        .insert(stepsToInsert);

      if (insertError) {
        console.error("Error in updateProcess (insert steps):", insertError);
        throw new Error("Failed to update process steps");
      }
    }
  }
}
