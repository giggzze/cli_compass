import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware";
import { db } from "@/db";
import { commands, userCommands, processes, processSteps, tags, collections } from "@/db/schema";
import { eq } from "drizzle-orm";

interface ImportCommand {
  description: string;
  code: string;
  categoryName?: string;
  isFavorite?: boolean;
  isPrivate?: boolean;
}

interface ImportProcessStep {
  stepExplanation: string;
  code?: string;
  order: number;
}

interface ImportProcess {
  title: string;
  isPrivate?: boolean;
  steps: ImportProcessStep[];
}

interface ImportTag {
  name: string;
  color?: string;
}

interface ImportCollection {
  name: string;
  description?: string;
}

interface ImportData {
  version?: string;
  commands?: ImportCommand[];
  processes?: ImportProcess[];
  tags?: ImportTag[];
  collections?: ImportCollection[];
}

// POST /api/import - Import data
export async function POST(request: Request) {
  return withAuth(async (userId) => {
    try {
      const { data, mode = "merge" } = await request.json() as {
        data: ImportData;
        mode: "merge" | "replace";
      };

      if (!data) {
        return NextResponse.json(
          { success: false, error: "No data provided" },
          { status: 400 }
        );
      }

      const results = {
        commands: { imported: 0, skipped: 0 },
        processes: { imported: 0, skipped: 0 },
        tags: { imported: 0, skipped: 0 },
        collections: { imported: 0, skipped: 0 },
      };

      // Import tags first (they might be referenced by commands)
      if (data.tags && data.tags.length > 0) {
        for (const tag of data.tags) {
          try {
            // Check if tag already exists
            const existing = await db
              .select()
              .from(tags)
              .where(eq(tags.name, tag.name))
              .limit(1);

            if (existing.length === 0) {
              await db.insert(tags).values({
                name: tag.name,
                color: tag.color || "#6366f1",
                userId,
              });
              results.tags.imported++;
            } else {
              results.tags.skipped++;
            }
          } catch (err) {
            results.tags.skipped++;
          }
        }
      }

      // Import commands
      if (data.commands && data.commands.length > 0) {
        for (const cmd of data.commands) {
          try {
            // Create command
            const [newCommand] = await db
              .insert(commands)
              .values({
                description: cmd.description,
                code: cmd.code,
                isPrivate: cmd.isPrivate ?? true,
                userId,
                // Note: categoryId would need to be resolved from categoryName
              })
              .returning();

            // Create user association
            await db.insert(userCommands).values({
              userId,
              commandId: newCommand.id,
              isFavorite: cmd.isFavorite ?? false,
            });

            results.commands.imported++;
          } catch (err) {
            results.commands.skipped++;
          }
        }
      }

      // Import processes
      if (data.processes && data.processes.length > 0) {
        for (const proc of data.processes) {
          try {
            // Create process
            const [newProcess] = await db
              .insert(processes)
              .values({
                title: proc.title,
                userId,
                isPrivate: proc.isPrivate ?? true,
              })
              .returning();

            // Create steps
            if (proc.steps && proc.steps.length > 0) {
              await db.insert(processSteps).values(
                proc.steps.map((step, index) => ({
                  processId: newProcess.id,
                  stepExplanation: step.stepExplanation,
                  code: step.code || null,
                  order: step.order ?? index,
                }))
              );
            }

            results.processes.imported++;
          } catch (err) {
            results.processes.skipped++;
          }
        }
      }

      // Import collections
      if (data.collections && data.collections.length > 0) {
        for (const col of data.collections) {
          try {
            // Check if collection already exists
            const existing = await db
              .select()
              .from(collections)
              .where(eq(collections.name, col.name))
              .limit(1);

            if (existing.length === 0) {
              await db.insert(collections).values({
                name: col.name,
                description: col.description || null,
                userId,
              });
              results.collections.imported++;
            } else {
              results.collections.skipped++;
            }
          } catch (err) {
            results.collections.skipped++;
          }
        }
      }

      return NextResponse.json({
        success: true,
        results,
      });
    } catch (error) {
      console.error("Error importing data:", error);
      return NextResponse.json(
        { success: false, error: "Failed to import data" },
        { status: 500 }
      );
    }
  });
}
