import getDB from '../utils/db';
import { jsonResponse } from '../utils/response';

interface CollectBody {
	userId?: string;
	guildId?: string;
	roleDbId?: string;
}

export default async function collect(body: CollectBody, db: D1Database) {
	const { userId, guildId, roleDbId } = body;

	if (!userId || !guildId || !roleDbId) {
		return jsonResponse({ error: 'Missing userId, guildId, or roleDbId' }, 400);
	}

	const prisma = getDB(db);

	try {
		// Get the role config (amount, interval)
		const role = await prisma.role.findUnique({
			where: { id: roleDbId },
		});

		if (!role) {
			return jsonResponse({ error: 'Role not found' }, 404);
		}

		// Check if user can collect (based on last collected time and role interval)
		const lastCollected = await prisma.userRoleIncome.findUnique({
			where: {
				userId_guildId_roleDbId: {
					userId,
					guildId,
					roleDbId,
				},
			},
		});

		const now = new Date();
		const cooldownMs = role.interval * 60 * 60 * 1000; // Convert minutes to milliseconds

		// Check cooldown
		if (lastCollected) {
			const timeSinceLast = now.getTime() - lastCollected.lastClaimed.getTime();
			const nextCollectionUnix = Math.floor((lastCollected.lastClaimed.getTime() + cooldownMs) / 1000);

			if (timeSinceLast < cooldownMs) {
				return jsonResponse(
					{
						error: `on cooldown`,
						nextCollectionTimestamp: `<t:${nextCollectionUnix}:R>`,
						canCollectAt: new Date(lastCollected.lastClaimed.getTime() + cooldownMs).toISOString(),
					},
					429,
				);
			}
		}

		// Give berries to user
		const user = await prisma.userBerries.upsert({
			where: {
				userId_guildId: {
					userId,
					guildId,
				},
			},
			update: {
				countCash: { increment: role.amount },
			},
			create: {
				userId,
				guildId,
				countCash: role.amount,
			},
		});

		// Update or create collection record
		await prisma.userRoleIncome.upsert({
			where: {
				userId_guildId_roleDbId: {
					userId,
					guildId,
					roleDbId,
				},
			},
			update: {
				lastClaimed: now,
			},
			create: {
				userId,
				guildId,
				roleDbId,
				lastClaimed: now,
			},
		});

		console.log(`User ${userId} collected ${role.amount} berries from role ${roleDbId} in guild ${guildId}`);

		return jsonResponse({
			success: true,
			amount: role.amount,
			newCount: user.countCash,
			nextCollectionAt: new Date(now.getTime() + cooldownMs).toISOString(),
			nextCollectionTimestamp: `<t:${Math.floor((now.getTime() + cooldownMs) / 1000)}:R>`,
		});
	} catch (error) {
		return jsonResponse({ error: 'Failed to collect berries' }, 500);
	}
}
