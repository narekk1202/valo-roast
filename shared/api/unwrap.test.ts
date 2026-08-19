import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { unwrapRiotResponse } from './unwrap'

const nameSchema = z.string();

describe('unwrapRiotResponse', () => {
	it('passes through transport failures', () => {
		expect(
			unwrapRiotResponse(
				{ ok: false, error: 'Network error or service unavailable' },
				nameSchema,
				{ notFound: 'Account not found', fallback: 'Failed to fetch account' },
			),
		).toEqual({ ok: false, error: 'Network error or service unavailable' });
	});

	it('returns parsed data on HTTP success', () => {
		expect(
			unwrapRiotResponse(
				{
					ok: true,
					status: 200,
					httpOk: true,
					data: { status: 200, data: 'ok' },
				},
				nameSchema,
				{ notFound: 'Account not found', fallback: 'Failed to fetch account' },
			),
		).toEqual({ ok: true, data: 'ok' });
	});

	it('uses the API error message when present', () => {
		expect(
			unwrapRiotResponse(
				{
					ok: true,
					status: 200,
					httpOk: false,
					data: {
						status: 404,
						errors: [{ message: 'Riot ID does not exist', code: 404 }],
					},
				},
				nameSchema,
				{ notFound: 'Account not found', fallback: 'Failed to fetch account' },
			),
		).toEqual({ ok: false, error: 'Riot ID does not exist' });
	});

	it('falls back to not-found copy for 404 bodies without errors', () => {
		expect(
			unwrapRiotResponse(
				{
					ok: true,
					status: 404,
					httpOk: false,
					data: { status: 404 },
				},
				nameSchema,
				{ notFound: 'Account not found', fallback: 'Failed to fetch account' },
			),
		).toEqual({ ok: false, error: 'Account not found' });
	});

	it('rejects payloads that do not match the data schema', () => {
		expect(
			unwrapRiotResponse(
				{
					ok: true,
					status: 200,
					httpOk: true,
					data: { status: 200, data: 12 },
				},
				nameSchema,
				{ notFound: 'Account not found', fallback: 'Failed to fetch account' },
			),
		).toEqual({ ok: false, error: 'Invalid response from API' });
	});
});
