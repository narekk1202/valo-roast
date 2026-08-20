import {
	LOOKUP_RATE_LIMIT,
	RATE_LIMIT_WINDOW_MS,
	ROAST_RATE_LIMIT,
	SHARE_CACHE_TTL_MS,
} from '@/shared/lib/limits';
import { globalRef } from '@/shared/lib/global-ref';
import { SlidingWindowRateLimiter } from '@/shared/lib/rate-limit';
import { TtlCache } from '@/shared/lib/ttl-cache';
import type { PublicRoastView } from './public-roast';

export const shareCache = globalRef(
	'valo-roast:share-cache',
	() => new TtlCache<PublicRoastView>(SHARE_CACHE_TTL_MS),
);

export const lookupLimiter = globalRef(
	'valo-roast:lookup-limiter',
	() => new SlidingWindowRateLimiter(LOOKUP_RATE_LIMIT, RATE_LIMIT_WINDOW_MS),
);

export const roastLimiter = globalRef(
	'valo-roast:roast-limiter',
	() => new SlidingWindowRateLimiter(ROAST_RATE_LIMIT, RATE_LIMIT_WINDOW_MS),
);
