import getDB from '../utils/db';
import { errorResponse } from '../utils/response';

interface RoleIncomeBody {
	guildId?: string;
	method?: 'add' | 'remove';
	roleId?: string;
	amount?: number;
	interval?: number;
}

export default async function roleIncome(body: RoleIncomeBody, db: D1Database, httpMethod: string) {
	const { guildId, method, roleId, amount, interval } = body;
	const prisma = getDB(db);

	try {
		// GET - List all roles for a guild
		if (httpMethod === 'GET') {
			if (!guildId) {
				return errorResponse('Missing guildId');
			}

			const roles = await prisma.role.findMany({
				where: { guildId },
			});

			return new Response(JSON.stringify({ roles }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// POST - Add or remove roles
		if (!guildId || !method) {
			return errorResponse('Missing guildId or method');
		}

		if (method === 'add') {
			if (!roleId || !amount || !interval) {
				return errorResponse('Missing roleId, amount, or interval');
			}

			const role = await prisma.role.upsert({
				where: {
					roleId_guildId: { roleId, guildId },
				},
				update: { amount, interval },
				create: { guildId, roleId, amount, interval },
			});

			return new Response(JSON.stringify({ success: true, role }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		if (method === 'remove') {
			if (!roleId) {
				return errorResponse('Missing roleId');
			}

			await prisma.role.deleteMany({
				where: { roleId, guildId },
			});

			return new Response(JSON.stringify({ success: true }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return errorResponse('Invalid method. Use "add" or "remove"', 400);
	} catch (e) {
		console.error(e);
		return errorResponse('Internal server error', 500);
	}
}
