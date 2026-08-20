import { ApiResult } from '@/shared/api/unwrap';
import { globalRef } from '@/shared/lib/global-ref';
import { HENRIK_CACHE_TTL_MS } from '@/shared/lib/limits';
import { TtlCache } from '@/shared/lib/ttl-cache';
import { getValorantAccount } from '../api/account';
import { getMatches } from '../api/matches';
import { riotIdKey } from '../schemas';
import { PlayerAnalysis, RiotAccountData } from '../types';
import { buildPlayerStats } from './build-player-stats';

export type GetPlayerDataSuccess = {
	account: RiotAccountData;
	analysis: PlayerAnalysis;
};

export type GetPlayerDataResult = ApiResult<GetPlayerDataSuccess>;

export type PlayerDataDeps = {
	cache?: TtlCache<GetPlayerDataSuccess>;
	getAccount?: typeof getValorantAccount;
	getMatchList?: typeof getMatches;
};

export const playerDataCache = globalRef(
	'valo-roast:player-data-cache',
	() => new TtlCache<GetPlayerDataSuccess>(HENRIK_CACHE_TTL_MS),
);

export async function getPlayerData(
	name: string,
	tag: string,
	deps: PlayerDataDeps = {},
): Promise<GetPlayerDataResult> {
	const cache = deps.cache ?? playerDataCache;
	const getAccount = deps.getAccount ?? getValorantAccount;
	const getMatchList = deps.getMatchList ?? getMatches;
	const key = riotIdKey(name, tag);
	const cached = cache.get(key);

	if (cached) {
		return { ok: true, data: cached };
	}

	const accountResult = await getAccount(name, tag);

	if (!accountResult.ok) {
		return accountResult;
	}

	const matchesResult = await getMatchList(
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
		return { ok: false, error: 'No competitive matches found' };
	}

	const data = {
		account: accountResult.data,
		analysis,
	};

	cache.set(key, data);

	return {
		ok: true,
		data,
	};
}
