'use server';

import z from 'zod';
import { getPlayerData } from './lib/get-player-data';
import { RiotId, schema } from './schemas';
import { PlayerAnalysis, RiotAccountData } from './types';

export type PrevState = {
	error: string | null;
	riotId: RiotId | null;
	data: {
		account: RiotAccountData;
		analysis: PlayerAnalysis;
	} | null;
};

export async function getPlayerStats(
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

	const result = await getPlayerData(name, tag);

	if (!result.ok) {
		return {
			error: result.error,
			riotId: validated.data,
			data: null,
		};
	}

	return {
		error: null,
		riotId: validated.data,
		data: result.data,
	};
}
