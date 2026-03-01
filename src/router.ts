import { getBerry } from './endpoints/getBerry';
import { getLeaderboard } from './endpoints/getLeaderboard';
import { addBerry } from './endpoints/addBerry';
import { removeBerry } from './endpoints/removeBerry';
import { errorResponse } from './utils/response';
import roleIncome from './endpoints/roleIncome';
import collect from './endpoints/collect';
import withdraw from './endpoints/withdraw';
import deposit from './endpoints/deposit';

type Env = { berrygames_db: D1Database };
type Handler = (request: Request, url: URL, env: Env) => Promise<Response>;

const json = (req: Request) => req.json() as Promise<any>;

export const routes: { method: string; path: string; handler: Handler }[] = [
	{
		method: 'POST',
		path: '/berry/withdraw',
		handler: async (req: Request, _, env: Env) => withdraw(await json(req), env.berrygames_db),
	},
	{
		method: 'POST',
		path: '/berry/deposit',
		handler: async (req: Request, _, env: Env) => deposit(await json(req), env.berrygames_db),
	},
	{
		method: 'POST',
		path: '/berry/collect',
		handler: async (req: Request, _, env: Env) => collect(await json(req), env.berrygames_db),
	},
	{
		method: 'POST',
		path: '/berry/add',
		handler: async (req: Request, _, env: Env) => addBerry(await json(req), env.berrygames_db),
	},
	{
		method: 'POST',
		path: '/berry/remove',
		handler: async (req: Request, _, env: Env) => removeBerry(await json(req), env.berrygames_db),
	},
	{
		method: 'POST',
		path: '/role/income',
		handler: async (req: Request, _, env: Env) => roleIncome(await json(req), env.berrygames_db, 'POST'),
	},
	{
		method: 'GET',
		path: '/role/income',
		handler: async (req: Request, url: URL, env: Env) => {
			const guildId = url.searchParams.get('guildId');
			if (!guildId) {
				return errorResponse('Missing guildId');
			}
			return await roleIncome({ guildId }, env.berrygames_db, 'GET');
		},
	},
	{
		method: 'GET',
		path: '/berry/leaderboard',
		handler: async (_, url, env: Env) => {
			const guildId = url.searchParams.get('guildId');
			const limit = parseInt(url.searchParams.get('limit') || '10', 10);
			return getLeaderboard(guildId!, limit, env.berrygames_db);
		},
	},
	{
		method: 'GET',
		path: '/berry',
		handler: async (_, url: URL, env: Env) => {
			const userId = url.searchParams.get('userId');
			const guildId = url.searchParams.get('guildId');
			if (!userId) return errorResponse('Missing userId');
			return getBerry(userId, guildId!, env.berrygames_db);
		},
	},
];
