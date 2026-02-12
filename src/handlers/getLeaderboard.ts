import getDB from '../utils/db';
import { errorResponse, jsonResponse } from '../utils/response';

export async function getLeaderboard(guildId: string, limit: number, db: D1Database) {
	if (!guildId) {
		return errorResponse('Missing guildId');
	}

	const prisma = getDB(db);

	const leaderboard = await prisma.userBerries.findMany({
		where: { guildId },
		orderBy: { count: 'desc' },
		take: limit,
	});

	console.log('Fetched leaderboard:', leaderboard); // Log the fetched leaderboard for debugging

	return jsonResponse({ leaderboard });
}
