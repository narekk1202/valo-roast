'use server';

import { env } from '@/app/env';
import z from 'zod';
import { RiotId, schema } from './schemas';
import { RiotAccountData, RiotApiResponse } from './types';

export type PrevState = {
	error: string | null;
	riotId: RiotId | null;
	data: RiotAccountData | null;
};

export async function getRiotAccount(
	_prevState: PrevState,
	formData: FormData,
): Promise<PrevState> {
	const riotId = formData.get('riotId')?.toString().trim() ?? '';
	const validated = schema.safeParse(riotId);

	if (!validated.success) {
		const errorMessage =
			z.flattenError(validated.error).formErrors.join(', ') ||
			'Invalid Riot ID format (expected Name#TAG)';

		return {
			error: errorMessage,
			riotId: null,
			data: null,
		};
	}

	const hashIndex = validated.data.lastIndexOf('#');
	const name = validated.data.slice(0, hashIndex);
	const tag = validated.data.slice(hashIndex + 1);

	try {
		const response = await fetch(
			`${env.RIOT_API_URL}/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
			{
				headers: {
					Authorization: env.RIOT_API_KEY,
				},
				cache: 'no-store',
			},
		);

		const result: RiotApiResponse = await response.json();

		if (!response.ok || !result.data) {
			const apiErrorMessage = result.errors?.[0]?.message;

			let fallbackError = 'Failed to fetch account';
			if (response.status === 404) fallbackError = 'Account not found';
			if (response.status === 429)
				fallbackError = 'Rate limit exceeded. Please wait a moment.';
			if (response.status === 401 || response.status === 403)
				fallbackError = 'API key issue';

			return {
				error: apiErrorMessage || fallbackError,
				riotId: validated.data,
				data: null,
			};
		}

		return {
			error: null,
			riotId: validated.data,
			data: result.data,
		};
	} catch (error) {
		console.error('Riot API fetch error:', error);
		return {
			error: 'Network error or service unavailable',
			riotId: validated.data,
			data: null,
		};
	}
}
