import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		environment: 'node',
		env: {
			RIOT_API_KEY: 'test',
			GROQ_API_KEY: 'test',
			RIOT_API_URL: 'https://example.test',
		},
	},
});
