import { riotApiClient } from '@/shared/api/client';
import { httpErrorMessage } from '@/shared/api/errors';
import { RiotAccountData, RiotApiResponse } from '../types';

export type GetValorantAccountResult =
	| { ok: true; data: RiotAccountData }
	| { ok: false; error: string };

export async function getValorantAccount(
	name: string,
	tag: string,
): Promise<GetValorantAccountResult> {
	const result = await riotApiClient.get<RiotApiResponse>(
		`/valorant/v1/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
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
			? 'Account not found'
			: httpErrorMessage(status, 'Failed to fetch account');

	return {
		ok: false,
		error: apiErrorMessage || fallback,
	};
}
