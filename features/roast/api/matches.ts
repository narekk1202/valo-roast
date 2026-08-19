import { riotApiClient } from '@/shared/api/client';
import { ApiResult, unwrapRiotResponse } from '@/shared/api/unwrap';
import { ValorantMatch } from '../types';
import { valorantMatchesSchema } from './schemas';

export async function getMatches(
	region: string,
	puuid: string,
): Promise<ApiResult<ValorantMatch[]>> {
	const result = await riotApiClient.get(
		`/valorant/v3/by-puuid/matches/${encodeURIComponent(region)}/${encodeURIComponent(puuid)}`,
	);

	const unwrapped = unwrapRiotResponse(result, valorantMatchesSchema, {
		notFound: 'Matches not found',
		fallback: 'Failed to fetch matches',
	});

	if (!unwrapped.ok) {
		return unwrapped;
	}

	return { ok: true, data: unwrapped.data as unknown as ValorantMatch[] };
}
