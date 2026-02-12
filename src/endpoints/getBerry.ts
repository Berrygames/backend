import getDB from '../utils/db';
import { errorResponse, jsonResponse } from '../utils/response';

export async function getBerry(userId: string, guildId: string, db: D1Database) {
	if (!userId || !guildId) {
		return errorResponse('Missing userId or guildId');
	}

	const prisma = getDB(db);

	const user = await prisma.userBerries.findUnique({
		where: {
			userId_guildId: {
				userId,
				guildId,
			},
		},
	});

	return jsonResponse({
		success: true,
		userId: user?.userId,
		guildId: user?.guildId,
		berriesCash: user?.countCash || 0,
		berriesBank: user?.countBank || 0,
	});
}
