export function jsonResponse(data: any, status: number = 200) {
	return Response.json(data, { status });
}

export function errorResponse(message: string, status: number = 400) {
	return Response.json({ error: message }, { status });
}
