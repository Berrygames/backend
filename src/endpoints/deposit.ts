import getDB from '../utils/db';
import { errorResponse, jsonResponse } from '../utils/response';

interface WithdrawBody {
	guildId?: string;
	userId?: string;
	amount?: number;
}

export default async function deposit(body: WithdrawBody, db: D1Database) {
	const { guildId, userId, amount } = body;
	const prisma = getDB(db);

	if (!guildId || !userId || !amount) {
		return errorResponse('Missing guildId, userId, or amount');
	}

	try {
		const existingUser = await prisma.userBerries.findUnique({
			where: { userId_guildId: { userId, guildId } },
		});

		if (!existingUser) {
			return errorResponse('User not found');
		}

		if (existingUser.countCash < amount) {
			return errorResponse('Insufficient berries in cash');
		}

		const user = await prisma.userBerries.update({
			where: { userId_guildId: { userId, guildId } },
			data: {
				countCash: { decrement: amount },
				countBank: { increment: amount },
			},
		});

		return jsonResponse({
			success: true,
			userId,
			newCashCount: user.countCash,
			newBankCount: user.countBank,
		});
	} catch (error) {
		console.error('Error in withdraw endpoint:', error);
		return errorResponse('An error occurred while processing the withdrawal');
	}
}
