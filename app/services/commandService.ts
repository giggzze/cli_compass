import { db } from "@/db";
import { categories, commands, profiles, userCommands } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { ICreateCommand, IGetCommand } from "@/app/models";

export class CommandService {
  /**
   * Retrieves a list of public commands from the database.
   *
   * This method fetches commands that are not marked as private, along with their associated categories.
   *
   * @returns {Promise<IGetCommand[]>} A promise that resolves to an array of public commands.
   * @throws {Error} If there is an issue fetching the public commands from the database.
   */
  static async getPublicCommands(): Promise<IGetCommand[]> {
    try {
      // Fetch public commands from the database
      return await db
        .select({
          id: commands.id,
          description: commands.description,
          code: commands.code,
          isPrivate: commands.isPrivate,
          categoryId: commands.categoryId,
          createdAt: commands.createdAt,
          category: categories,
          user: profiles,
        })
        .from(commands)
        .leftJoin(categories, eq(commands.categoryId, categories.id))
        .leftJoin(userCommands, eq(commands.id, userCommands.commandId))
        .leftJoin(profiles, eq(userCommands.userId, profiles.id))
        .where(eq(commands.isPrivate, false));
    } catch (error) {
      console.error("Error in getPublicCommands:", error);
      throw new Error("Failed to fetch public commands");
    }
  }

  /**
   * Retrieves a list of commands associated with a specific user.
   *
   * @param userId - The unique identifier of the user.
   * @returns A promise that resolves to an array of `GetCommand` objects containing the user's commands.
   * @throws An error if the user commands could not be fetched.
   */
  static async getUserCommands(userId: string): Promise<IGetCommand[]> {
    try {
      return await db
        .select({
          id: commands.id,
          description: commands.description,
          code: commands.code,
          isPrivate: commands.isPrivate,
          categoryId: commands.categoryId,
          isFavorite: userCommands.isFavorite,
          createdAt: commands.createdAt,
          category: {
            id: categories.id,
            name: categories.name,
          },
          user: {
            id: profiles.id,
            username: profiles.username,
            avatarUrl: profiles.avatarUrl,
          },
        })
        .from(commands)
        .leftJoin(categories, eq(commands.categoryId, categories.id))
        .leftJoin(userCommands, eq(commands.id, userCommands.commandId))
        .leftJoin(profiles, eq(userCommands.userId, profiles.id))
        .where(eq(userCommands.userId, userId));
    } catch (error) {
      console.error("Error in getUserCommands:", error);
      throw new Error("Failed to fetch user commands");
    }
  }

  /**
   * Creates a new command and associates it with a user.
   *
   * @param data - The command data to be inserted into the database.
   * @param userId - The ID of the user creating the command.
   * @returns A promise that resolves to a boolean indicating whether the command was successfully created.
   * @throws Will throw an error if the command creation fails.
   */
  static async createCommand(
    data: ICreateCommand,
    userId: string
  ): Promise<boolean> {
    try {
      // Insert the new command into the database
      const newCommand = await db
        .insert(commands)
        .values({
          description: data.description,
          code: data.code,
          isPrivate: data.isPrivate,
          categoryId: data.categoryId,
          createdAt: new Date().toISOString(),
        })
        .returning();

      // Insert the user command association into the database
      await db.insert(userCommands).values({
        userId,
        commandId: newCommand[0].id,
        isFavorite: false,
      });

      return true;
    } catch (error) {
      console.error("Error in createCommand:", error);
      throw new Error("Failed to create command");
    }
  }

  /**
   * Checks if a user is associated with a specific command.
   *
   * @param userId - The ID of the user to check.
   * @param command_id - The ID of the command to check.
   * @returns A promise that resolves to `true` if the user is associated with the command, otherwise `false`.
   */
  static async checkUserAssociation(userId: string, command_id: string) {
    const existingAssociation = await db
      .select()
      .from(userCommands)
      .where(
        and(
          eq(userCommands.userId, userId),
          eq(userCommands.commandId, command_id)
        )
      )
      .limit(1);

    if (existingAssociation.length === 0) return false;
    return true;
  }

  /**
   * Updates the association of a user with a command in the database.
   *
   * @param userId - The ID of the user.
   * @param command_id - The ID of the command.
   * @param is_favorite - A boolean indicating whether the command is marked as favorite by the user.
   * @returns A promise that resolves when the update operation is complete.
   */
  static async updateUserAssociation(
    userId: string,
    command_id: string,
    is_favorite: boolean
  ) {
    await db
      .update(userCommands)
      .set({
        isFavorite: is_favorite,
      })
      .where(
        and(
          eq(userCommands.userId, userId),
          eq(userCommands.commandId, command_id)
        )
      );
  }

  /**
   * Creates a new association between a user and a command.
   *
   * @param userId - The ID of the user.
   * @param command_id - The ID of the command.
   * @param is_favorite - Whether the command should be marked as favorite.
   * @returns A promise that resolves when the association is created.
   */
  static async createUserAssociation(
    userId: string,
    command_id: string,
    is_favorite: boolean
  ) {
    await db.insert(userCommands).values({
      userId,
      commandId: command_id,
      isFavorite: is_favorite,
    });
  }

  static async getUserCommand(
    userId: string,
    commandId: string
  ): Promise<IGetCommand> {
    try {
      const result = await db
        .select({
          id: commands.id,
          description: commands.description,
          code: commands.code,
          isPrivate: commands.isPrivate,
          categoryId: commands.categoryId,
          createdAt: commands.createdAt,
          isFavorite: userCommands.isFavorite,
          category: {
            id: categories.id,
            name: categories.name,
          },
          user: {
            id: profiles.id,
            username: profiles.username,
            avatarUrl: profiles.avatarUrl,
          },
        })
        .from(userCommands)
        .leftJoin(commands, eq(userCommands.commandId, commands.id))
        .leftJoin(categories, eq(commands.categoryId, categories.id))
        .leftJoin(profiles, eq(userCommands.userId, profiles.id))
        .where(
          and(
            eq(userCommands.commandId, commandId),
            eq(userCommands.userId, userId)
          )
        )
        .limit(1);

      if (!result || result.length === 0) {
        throw new Error('Command not found');
      }

      return result[0] as IGetCommand;
    } catch (error) {
      console.error("Error in getUserCommands:", error);
      throw new Error("Failed to fetch user commands");
    }
  }

  static async updateFavorite(userId: string, commandId: string) {
    const existingAssociation = await this.checkUserAssociation(
      userId,
      commandId
    );

    if (!existingAssociation) return false;

    const command = await this.getUserCommand(userId, commandId);

    await db
      .update(userCommands)
      .set({
        isFavorite: !command.isFavorite,
      })
      .where(
        and(
          eq(userCommands.userId, userId),
          eq(userCommands.commandId, commandId)
        )
      );
  }
}

// static async updateCommand(

// 	id: string,
// 	data: UpdateCommandDto
// ): Promise<CommandResponseDto> {
// 	try {
// 		const [updatedCommand] = await db
// 			.update(commands)
// 			.set({
// 				...data,
// 				updatedAt: new Date().toISOString(),
// 			})
// 			.where(eq(commands.id, id))
// 			.returning();

// 		return this.getCommandById(updatedCommand.id);
// 	} catch (error) {
// 		console.error("Error in updateCommand:", error);
// 		throw new Error("Failed to update command");
// 	}
// }

// static async getCommandById(id: string): Promise<CommandResponseDto> {
// 	try {
// 		const command = await db
// 			.select({
// 				id: commands.id,
// 				name: commands.name,
// 				description: commands.description,
// 				usage: commands.usage,
// 				notes: commands.notes,
// 				lastUsed: commands.lastUsed,
// 				isPrivate: commands.isPrivate,
// 				categoryId: commands.categoryId,
// 				tags: commands.tags,
// 				createdAt: commands.createdAt,
// 				updatedAt: commands.updatedAt,
// 				category: {
// 					id: categories.id,
// 					name: categories.name,
// 				},
// 			})
// 			.from(commands)
// 			.leftJoin(categories, eq(commands.categoryId, categories.id))
// 			.where(eq(commands.id, id))
// 			.limit(1);

// 		if (!command || command.length === 0) {
// 			throw new Error("Command not found");
// 		}

// 		return {
// 			...command[0],
// 			usage: command[0].usage || "",
// 			notes: command[0].notes || "",
// 			tags: command[0].tags || [],
// 			isFavorite: false,
// 		};
// 	} catch (error) {
// 		console.error("Error in getCommandById:", error);
// 		throw new Error("Failed to fetch command");
// 	}
// }

// static async deleteCommand(id: string): Promise<void> {
// 	try {
// 		await db.delete(commands).where(eq(commands.id, id));
// 	} catch (error) {
// 		console.error("Error in deleteCommand:", error);
// 		throw new Error("Failed to delete command");
// 	}
// }
