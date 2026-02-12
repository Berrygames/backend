import { getBerry } from './endpoints/getBerry';
import { getLeaderboard } from './endpoints/getLeaderboard';
import { addBerry } from './endpoints/addBerry';
import { removeBerry } from './endpoints/removeBerry';
import { errorResponse } from './utils/response';
import roleIncome from './endpoints/roleIncome';
import collect from './endpoints/collect';

export async function handleRequest(request: Request, env: { berrygames_db: D1Database }) {
	const url = new URL(request.url);
	const path = url.pathname;
	const method = request.method;

	try {
		// POST /berry/collect
		if (method === 'POST' && path === '/berry/collect') {
			const body = (await request.json()) as any;
			return await collect(body, env.berrygames_db);
		}

		// GET /role/income?guildId=xxx
		if (method === 'GET' && path.startsWith('/role/income')) {
			const guildId = url.searchParams.get('guildId');
			if (!guildId) {
				return errorResponse('Missing guildId');
			}
			const response = await roleIncome({ guildId }, env.berrygames_db, 'GET');
			return response;
		}

		// POST /role/income
		if (method === 'POST' && path === '/role/income') {
			const body = (await request.json()) as any;
			return await roleIncome(body, env.berrygames_db, 'POST');
		}

		// POST /berry/add
		if (method === 'POST' && path === '/berry/add') {
			const body = (await request.json()) as any;
			return await addBerry(body, env.berrygames_db);
		}

		// POST /berry/remove
		if (method === 'POST' && path === '/berry/remove') {
			const body = (await request.json()) as any;
			return await removeBerry(body, env.berrygames_db);
		}

		// GET /berry/leaderboard?guildId=xxx&limit=10
		if (method === 'GET' && path === '/berry/leaderboard') {
			const guildId = url.searchParams.get('guildId');
			const limit = parseInt(url.searchParams.get('limit') || '10', 10);
			const response = await getLeaderboard(guildId!, limit, env.berrygames_db);
			return response;
		}

		// GET /berry/:userId?guildId=xxx
		if (method === 'GET' && path.startsWith('/berry/')) {
			const userId = path.split('/')[2];
			const guildId = url.searchParams.get('guildId');
			return await getBerry(userId, guildId!, env.berrygames_db);
		}
		return errorResponse('Not found', 404);
	} catch (e) {
		console.error(e);
		return errorResponse('Internal server error', 500);
	}
}
