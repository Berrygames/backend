import getDB from '../utils/db';
import { errorResponse, jsonResponse } from '../utils/response';

interface RemoveBerryBody {
	toUserId?: string;
	guildId?: string;
	amount?: number;
}

export async function removeBerry(body: RemoveBerryBody, db: D1Database) {
	const { toUserId, guildId, amount } = body;

	if (!toUserId || !guildId || !amount) {
		return errorResponse(`Missing toUserId, guildId, or amount $`);
	}

	const prisma = getDB(db);

	try {
		const user = await prisma.userBerries.update({
			where: {
				userId_guildId: {
					userId: toUserId,
					guildId,
				},
			},
			data: {
				count: { decrement: amount },
			},
		});

		return jsonResponse({
			success: true,
			userId: toUserId,
			newCount: user.count,
		});
	} catch (e) {
		return errorResponse('User not found', 400);
	}
}
