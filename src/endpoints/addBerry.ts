import getDB from '../utils/db';
import { errorResponse, jsonResponse } from '../utils/response';

interface GiveBerryBody {
	toUserId?: string;
	guildId?: string;
	location?: 'cash' | 'bank';
	amount?: number;
}

export async function addBerry(body: GiveBerryBody, db: D1Database) {
	const { toUserId, guildId, location, amount } = body;

	if (!toUserId || !guildId || !location || !amount) {
		return errorResponse('Missing toUserId, guildId, location, or amount');
	}

	const locationMap = {
		cash: 'countCash',
		bank: 'countBank',
	} as const;

	const prisma = getDB(db);

	const user = await prisma.userBerries.upsert({
		where: {
			userId_guildId: {
				userId: toUserId,
				guildId,
			},
		},
		update: {
			[locationMap[location]]: { increment: amount },
		},
		create: {
			userId: toUserId,
			guildId,
			countCash: amount,
		},
	});

	return jsonResponse({
		success: true,
		userId: toUserId,
		newCount: user[locationMap[location]],
		location,
	});
}
