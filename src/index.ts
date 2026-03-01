import { routes } from './router';
import { errorResponse } from './utils/response';

export interface Env {
	berrygames_db: D1Database;
	DISCORD_PUBLIC_KEY: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<any> {
		const url = new URL(request.url);

		try {
			for (const route of routes) {
				const pathMatches = route.path === url.pathname;

				if (route.method === request.method && pathMatches) {
					return await route.handler(request, url, env);
				}
			}
			return errorResponse('Not Found', 404);
		} catch (e) {
			console.error(e);
			return errorResponse('Internal server error', 500);
		}
	},
};
