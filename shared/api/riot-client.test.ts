import { describe, expect, it } from 'vitest';
import { RiotApiClient } from './riot-client';

describe('RiotApiClient', () => {
	it('returns parsed json on success', async () => {
		const client = new RiotApiClient('https://api.test', 'secret', {
			fetch: async (input, init) => {
				expect(String(input)).toBe('https://api.test/v1/x');
				expect(new Headers(init?.headers).get('Authorization')).toBe(
					'secret',
				);
				return new Response(JSON.stringify({ status: 200, data: 'ok' }), {
					status: 200,
				});
			},
		});

		await expect(client.get('/v1/x')).resolves.toEqual({
			ok: true,
			status: 200,
			httpOk: true,
			data: { status: 200, data: 'ok' },
		});
	});

	it('times out when the abort signal fires', async () => {
		const client = new RiotApiClient('https://api.test', 'secret', {
			timeoutMs: 20,
			fetch: (_input, init) =>
				new Promise((_, reject) => {
					init?.signal?.addEventListener('abort', () => {
						reject(
							Object.assign(new Error('This operation was aborted'), {
								name: 'AbortError',
							}),
						);
					});
				}),
		});

		await expect(client.get('/slow')).resolves.toEqual({
			ok: false,
			error: 'Request timed out',
		});
	});
});
