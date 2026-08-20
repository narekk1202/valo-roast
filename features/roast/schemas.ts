import z from 'zod';

export const schema = z
	.string()
	.trim()
	.max(22, 'Riot ID is too long')
	.regex(
		/^[^#]{3,16}#[A-Za-z0-9]{3,5}$/,
		'Invalid Riot ID format (expected Name#TAG)',
	);

export type RiotId = z.infer<typeof schema>;

export function splitRiotId(riotId: string): { name: string; tag: string } {
	const hashIndex = riotId.lastIndexOf('#');
	return {
		name: riotId.slice(0, hashIndex),
		tag: riotId.slice(hashIndex + 1),
	};
}

export function riotIdKey(name: string, tag: string): string {
	return `${name}#${tag}`.toLowerCase();
}

export function sharePath(name: string, tag: string): string {
	return `/roast/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`;
}
