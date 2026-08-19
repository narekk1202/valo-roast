import { RiotApiResponse, ValorantMatch } from '@/features/roast/types';
import { riotApiClient } from '@/shared/api/client';
import { httpErrorMessage } from '@/shared/api/errors';

export type GetMatchesResult =
	| { ok: true; data: ValorantMatch[] }
	| { ok: false; error: string };

export async function getMatches(
	region: string,
	puuid: string,
): Promise<GetMatchesResult> {
	const result = await riotApiClient.get<RiotApiResponse<ValorantMatch[]>>(
		`/valorant/v3/by-puuid/matches/${region}/${encodeURIComponent(puuid)}`,
	);

	if (!result.ok) {
		return result;
	}

	const status = result.data.status ?? result.status;
	if (result.httpOk && result.data.data) {
		return { ok: true, data: result.data.data };
	}

	const apiErrorMessage = result.data.errors?.[0]?.message;
	const fallback =
		status === 404
			? 'Matches not found'
			: httpErrorMessage(status, 'Failed to fetch matches');

	return {
		ok: false,
		error: apiErrorMessage || fallback,
	};
}
