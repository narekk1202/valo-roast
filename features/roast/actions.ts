'use server';

import { headers } from 'next/headers';
import z from 'zod';
import { clientIp } from '@/shared/lib/client-ip';
import { logEvent } from '@/shared/lib/log';
import { getPlayerData, playerDataCache } from './lib/get-player-data';
import { lookupLimiter, shareCache } from './lib/limiters';
import { toPublicRoast, type PublicRoastView } from './lib/public-roast';
import { riotIdKey, schema, splitRiotId, type RiotId } from './schemas';

export type PrevState = {
	error: string | null;
	riotId: RiotId | null;
	view: PublicRoastView | null;
};

function state(
	error: string | null,
	riotId: RiotId | null,
	view: PublicRoastView | null,
): PrevState {
	return { error, riotId, view };
}

export async function getPlayerStats(
	_prevState: PrevState,
	formData: FormData,
): Promise<PrevState> {
	const riotId = formData.get('riotId')?.toString() ?? '';
	const validated = schema.safeParse(riotId);

	if (!validated.success) {
		const errorMessage =
			z.flattenError(validated.error).formErrors.join(', ') ||
			'Invalid Riot ID format (expected Name#TAG)';

		return state(errorMessage, null, null);
	}

	const { name, tag } = splitRiotId(validated.data);
	const key = riotIdKey(name, tag);
	const cachedShare = shareCache.get(key);

	if (cachedShare?.roast) {
		logEvent('roast.lookup', { cache: 'share', key });
		return state(null, validated.data, cachedShare);
	}

	const cachedPlayer = playerDataCache.get(key);

	if (!cachedPlayer) {
		const ip = clientIp(await headers());
		const limited = lookupLimiter.consume(ip);

		if (!limited.ok) {
			return state(
				'Too many lookups. Please wait a moment.',
				validated.data,
				null,
			);
		}
	}

	const result = await getPlayerData(name, tag);

	if (!result.ok) {
		return state(result.error, validated.data, null);
	}

	logEvent('roast.lookup', {
		cache: cachedPlayer ? 'hit' : 'miss',
		key,
	});

	return state(
		null,
		validated.data,
		toPublicRoast(result.data.account, result.data.analysis, null),
	);
}
