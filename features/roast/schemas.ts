import z from 'zod';

export const schema = z
	.string()
	.regex(/^.+#.+$/, 'Invalid Riot ID, must be <name>#<tag>');

export type RiotId = z.infer<typeof schema>;
