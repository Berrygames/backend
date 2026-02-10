import getDB from '../utils/db';
import { errorResponse, jsonResponse } from '../utils/response';

interface GiveBerryBody {
	toUserId?: string;
	guildId?: string;
	amount?: number;
}

export async function giveBerry(body: GiveBerryBody, db: D1Database) {
	const { toUserId, guildId, amount } = body;

	if (!toUserId || !guildId || !amount) {
		return errorResponse('Missing toUserId, guildId, or amount');
	}

	const prisma = getDB(db);

	const user = await prisma.userBerries.upsert({
		where: {
			userId_guildId: {
				userId: toUserId,
				guildId,
			},
		},
		update: {
			count: { increment: amount },
		},
		create: {
			userId: toUserId,
			guildId,
			count: amount,
		},
	});

	return jsonResponse({
		success: true,
		userId: toUserId,
		newCount: user.count,
	});
}
