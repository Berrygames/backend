import getDB from '../utils/db';
import { errorResponse, jsonResponse } from '../utils/response';

interface RemoveBerryBody {
	toUserId?: string;
	guildId?: string;
	location?: 'cash' | 'bank';
	amount?: number;
}

export async function removeBerry(body: RemoveBerryBody, db: D1Database) {
	const { toUserId, guildId, location, amount } = body;

	if (!toUserId || !guildId || !location || !amount) {
		return errorResponse(`Missing toUserId, guildId, location, or amount`);
	}

	const prisma = getDB(db);

	const locationMap = {
		cash: 'countCash',
		bank: 'countBank',
	} as const;

	try {
		const user = await prisma.userBerries.update({
			where: {
				userId_guildId: {
					userId: toUserId,
					guildId,
				},
			},
			data: {
				[locationMap[location]]: { decrement: amount },
			},
		});

		return jsonResponse({
			success: true,
			userId: toUserId,
			newCount: user[locationMap[location]],
			location,
		});
	} catch (e) {
		return errorResponse('User not found', 400);
	}
}
