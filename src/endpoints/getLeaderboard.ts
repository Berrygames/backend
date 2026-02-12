import getDB from '../utils/db';
import { errorResponse, jsonResponse } from '../utils/response';

export async function getLeaderboard(guildId: string, limit: number, db: D1Database) {
	if (!guildId) {
		return errorResponse('Missing guildId');
	}

	const prisma = getDB(db);

	const leaderboard = await prisma.$queryRaw`
		SELECT *,
				(countCash + countBank) AS total
		FROM UserBerries
		WHERE guildId = ${guildId}
		ORDER BY total DESC
		LIMIT ${limit}
	`;

	return jsonResponse({ leaderboard });
}
