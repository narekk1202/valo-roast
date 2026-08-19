'use server';

import { env } from '@/app/env';
import z from 'zod';
import { RiotId, schema } from './schemas';

export type PrevState = {
	error: string | null;
	riotId: RiotId | null;
	data: unknown | null;
};

export async function getRiotAccount(
	_prevState: PrevState,
	formData: FormData,
): Promise<PrevState> {
	const riotId = formData.get('riotId')?.toString() ?? '';
	const validated = schema.safeParse(riotId);

	if (!validated.success) {
		return {
			error: z.flattenError(validated.error).formErrors.join(', '),
			riotId: null,
			data: null,
		};
	}

	const [name, tag] = validated.data.split('#');

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

		if (!response.ok) {
			return {
				error: response.statusText,
				riotId: validated.data,
				data: null,
			};
		}


		const data = await response.json();
		return { error: null, riotId: validated.data, data };
	} catch (error) {
		console.error(error);
		return {
			error: 'Failed to fetch Riot account',
			riotId: validated.data,
			data: null,
		};
	}
}
