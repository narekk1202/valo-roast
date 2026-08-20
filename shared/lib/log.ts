export function logEvent(
	event: string,
	fields: Record<string, unknown> = {},
): void {
	console.info(JSON.stringify({ event, ts: Date.now(), ...fields }));
}
