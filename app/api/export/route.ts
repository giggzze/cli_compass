import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { CommandService } from "@/app/services/commandService";
import { ProcessService } from "@/app/services/processService";
import { TagService } from "@/app/services/tagService";
import { CollectionService } from "@/app/services/collectionService";

interface ExportData {
  version: string;
  exportedAt: string;
  commands: any[];
  processes: any[];
  tags: any[];
  collections: any[];
}

// GET /api/export - Export all user data
export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
      const { searchParams } = new URL(request.url);
      const format = searchParams.get("format") || "json";
      const includeCommands = searchParams.get("commands") !== "false";
      const includeProcesses = searchParams.get("processes") !== "false";
      const includeTags = searchParams.get("tags") !== "false";
      const includeCollections = searchParams.get("collections") !== "false";

      const exportData: ExportData = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        commands: [],
        processes: [],
        tags: [],
        collections: [],
      };

      // Fetch commands
      if (includeCommands) {
        const commands = await CommandService.getUserCommands(userId);
        exportData.commands = commands.map((cmd) => ({
          description: cmd.description,
          code: cmd.code,
          categoryName: cmd.category?.name,
          isFavorite: cmd.isFavorite,
          isPrivate: cmd.isPrivate,
        }));
      }

      // Fetch processes
      if (includeProcesses) {
        const processes = await ProcessService.getPrivateProcesses(userId);
        exportData.processes = processes.map((proc) => ({
          title: proc.title,
          isPrivate: proc.isPrivate,
          steps: proc.steps.map((step) => ({
            stepExplanation: step.stepExplanation,
            code: step.code,
            order: step.order,
          })),
        }));
      }

      // Fetch tags
      if (includeTags) {
        const tags = await TagService.getUserTags(userId);
        exportData.tags = tags.map((tag) => ({
          name: tag.name,
          color: tag.color,
        }));
      }

      // Fetch collections
      if (includeCollections) {
        const collections = await CollectionService.getUserCollections(userId);
        exportData.collections = collections.map((col) => ({
          name: col.name,
          description: col.description,
        }));
      }

      // Return based on format
      if (format === "markdown") {
        const markdown = generateMarkdown(exportData);
        return new NextResponse(markdown, {
          headers: {
            "Content-Type": "text/markdown",
            "Content-Disposition": `attachment; filename="cli-compass-export-${Date.now()}.md"`,
          },
        });
      }

      // Default: JSON
      return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="cli-compass-export-${Date.now()}.json"`,
        },
      });
  } catch (error) {
    console.error("Error exporting data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to export data" },
      { status: 500 }
    );
  }
}

function generateMarkdown(data: ExportData): string {
  let md = "# CLI Compass Export\n\n";
  md += `Exported: ${new Date(data.exportedAt).toLocaleString()}\n\n`;

  if (data.commands.length > 0) {
    md += "## Commands\n\n";
    data.commands.forEach((cmd) => {
      md += `### ${cmd.description || "Untitled"}\n\n`;
      if (cmd.categoryName) {
        md += `**Category:** ${cmd.categoryName}\n\n`;
      }
      if (cmd.code) {
        md += "```bash\n" + cmd.code + "\n```\n\n";
      }
    });
  }

  if (data.processes.length > 0) {
    md += "## Processes\n\n";
    data.processes.forEach((proc) => {
      md += `### ${proc.title || "Untitled"}\n\n`;
      proc.steps?.forEach((step: any, idx: number) => {
        md += `**Step ${idx + 1}:** ${step.stepExplanation || ""}\n\n`;
        if (step.code) {
          md += "```bash\n" + step.code + "\n```\n\n";
        }
      });
    });
  }

  if (data.tags.length > 0) {
    md += "## Tags\n\n";
    data.tags.forEach((tag) => {
      md += `- ${tag.name}`;
      if (tag.color) md += ` (${tag.color})`;
      md += "\n";
    });
    md += "\n";
  }

  if (data.collections.length > 0) {
    md += "## Collections\n\n";
    data.collections.forEach((col) => {
      md += `### ${col.name}\n`;
      if (col.description) {
        md += `${col.description}\n`;
      }
      md += "\n";
    });
  }

  return md;
}
