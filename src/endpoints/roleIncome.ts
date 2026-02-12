import getDB from '../utils/db';
import { errorResponse } from '../utils/response';

interface RoleIncomeBody {
	guildId?: string;
	method: 'add' | 'remove' | 'list';
	roleId?: string;
	amount?: number;
	interval?: number; // in hours
}

export default async function roleIncome(body: RoleIncomeBody, db: D1Database) {
	const { guildId, method, roleId, amount, interval } = body;

	if (!guildId || !method) {
		return errorResponse('Missing guildId or method');
	}

	const prisma = getDB(db);

	try {
		if (method === 'add') {
			if (!roleId || !amount || !interval) {
				return errorResponse('Missing roleId, amount, or interval for add method');
			}

			const role = await prisma.role.upsert({
				where: {
					roleId_guildId: {
						roleId,
						guildId,
					},
				},
				update: {
					amount,
					interval,
				},
				create: {
					guildId,
					roleId,
					amount,
					interval,
				},
			});

			return new Response(JSON.stringify({ success: true, role }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} else if (method === 'remove') {
			if (!roleId) {
				return errorResponse('Missing roleId for remove method');
			}

			await prisma.role.deleteMany({
				where: {
					roleId,
					guildId,
				},
			});

			return new Response(JSON.stringify({ success: true }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} else if (method === 'list') {
			const roles = await prisma.role.findMany({
				where: {
					guildId,
				},
			});
			return new Response(JSON.stringify({ roles }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}
	} catch (e) {
		console.error(e);
		return errorResponse('Internal server error', 500);
	}
}
