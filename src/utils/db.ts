import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@prisma/client';

export default function getDB(db: D1Database) {
	const adapter = new PrismaD1(db);
	return new PrismaClient({
		adapter,
	});
}
