import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { AppError } from "./AppError";

export async function verifySyncTodoTags(
  connection: PoolConnection,
  todoId: string | string[],
  tagIds: string[],
  userId: string | undefined,
): Promise<void> {
  if (tagIds.length > 0) {
    const placeholders = tagIds.map(() => "?").join(", ");

    const [rows] = await connection.query<RowDataPacket[]>(
      `
        SELECT id FROM tags 
        WHERE user_id = ? 
          AND id IN (${placeholders})
      `,
      [userId, ...tagIds],
    );

    if (rows.length !== tagIds.length) {
      throw new AppError(403, "One of more tags could not be found.");
    }
  }

  await connection.query(
    `
		DELETE FROM todo_tags 
		WHERE todo_id = ?`,
    [todoId],
  );

  for (const tagId of tagIds) {
    await connection.query(
      `
				INSERT INTO todo_tags (todo_id, tag_id)
				VALUES (?, ?);
			`,
      [todoId, tagId],
    );
  }
}
