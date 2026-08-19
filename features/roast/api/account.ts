import { riotApiClient } from '@/shared/api/client';
import { ApiResult, unwrapRiotResponse } from '@/shared/api/unwrap';
import { RiotAccountData } from '../types';
import { riotAccountSchema } from './schemas';

export async function getValorantAccount(
	name: string,
	tag: string,
): Promise<ApiResult<RiotAccountData>> {
	const result = await riotApiClient.get(
		`/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
	);

	return unwrapRiotResponse(result, riotAccountSchema, {
		notFound: 'Account not found',
		fallback: 'Failed to fetch account',
	});
}
