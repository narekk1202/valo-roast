import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

export const env = createEnv({
	server: {
		RIOT_API_KEY: z.string().min(1),
		GROQ_API_KEY: z.string().min(1),
		RIOT_API_URL: z.string().min(1),
	},
	client: {},
	runtimeEnv: {
		RIOT_API_KEY: process.env.RIOT_API_KEY,
		GROQ_API_KEY: process.env.GROQ_API_KEY,
		RIOT_API_URL: process.env.RIOT_API_URL,
	},
});
