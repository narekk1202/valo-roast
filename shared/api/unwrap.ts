import { z } from 'zod';
import type { JsonGetResult } from './client';
import { httpErrorMessage } from './errors';

export type ApiResult<T> =
	| { ok: true; data: T }
	| { ok: false; error: string };

const riotEnvelopeSchema = z.object({
	status: z.number().optional(),
	data: z.unknown().optional(),
	errors: z
		.array(
			z.object({
				message: z.string(),
				code: z.number().optional(),
				details: z.unknown().optional(),
			}),
		)
		.optional(),
});

export function unwrapRiotResponse<T>(
	result: JsonGetResult<unknown>,
	dataSchema: z.ZodType<T>,
	messages: { notFound: string; fallback: string },
): ApiResult<T> {
	if (!result.ok) {
		return result;
	}

	const envelope = riotEnvelopeSchema.safeParse(result.data);
	if (!envelope.success) {
		return { ok: false, error: 'Invalid response from API' };
	}

	const status = envelope.data.status ?? result.status;
	const payload = envelope.data.data;
	const hasData = payload !== undefined && payload !== null;

	if (result.httpOk && hasData) {
		const parsed = dataSchema.safeParse(payload);
		if (!parsed.success) {
			return { ok: false, error: 'Invalid response from API' };
		}
		return { ok: true, data: parsed.data };
	}

	const apiErrorMessage = envelope.data.errors?.[0]?.message;
	const fallback =
		status === 404
			? messages.notFound
			: httpErrorMessage(status, messages.fallback);

	return { ok: false, error: apiErrorMessage || fallback };
}
