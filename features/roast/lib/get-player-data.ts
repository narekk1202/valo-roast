import { getValorantAccount } from '../api/account';
import { getMatches } from '../api/matches';
import { RiotAccountData, ValorantMatch } from '../types';

export type GetPlayerDataResult =
	| {
			ok: true;
			data: {
				account: RiotAccountData;
				matches: ValorantMatch[];
			};
	  }
	| {
			ok: false;
			error: string;
	  };

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

	return {
		ok: true,
		data: {
			account: accountResult.data,
			matches: matchesResult.data,
		},
	};
}