import { ApiResult } from '@/shared/api/unwrap';
import { getValorantAccount } from '../api/account';
import { getMatches } from '../api/matches';
import { PlayerAnalysis, RiotAccountData } from '../types';
import { buildPlayerStats } from './build-player-stats';

export type GetPlayerDataResult = ApiResult<{
	account: RiotAccountData;
	analysis: PlayerAnalysis;
}>;

export async function getPlayerData(
	name: string,
	tag: string,
): Promise<GetPlayerDataResult> {
	const accountResult = await getValorantAccount(name, tag);

	if (!accountResult.ok) {
		return accountResult;
	}

	const matchesResult = await getMatches(
		accountResult.data.region,
		accountResult.data.puuid,
	);

	if (!matchesResult.ok) {
		return matchesResult;
	}

	const analysis = buildPlayerStats(
		accountResult.data,
		matchesResult.data,
	);

	if (!analysis) {
		return { ok: false, error: 'No analyzable matches found' };
	}

	return {
		ok: true,
		data: {
			account: accountResult.data,
			analysis,
		},
	};
}
