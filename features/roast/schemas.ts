import z from 'zod';

export const schema = z
	.string()
	.regex(/^.+#.+$/, 'Invalid Riot ID format (expected Name#TAG)');

export type RiotId = z.infer<typeof schema>;
