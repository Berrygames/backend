import { handleRequest } from './router';

export interface Env {
	berrygames_db: D1Database;
	DISCORD_PUBLIC_KEY: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<any> {
		return handleRequest(request, env);
	},
};
