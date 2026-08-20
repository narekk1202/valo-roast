export type RateLimitOk = { ok: true };
export type RateLimitBlocked = { ok: false; retryAfterMs: number };
export type RateLimitResult = RateLimitOk | RateLimitBlocked;

export class SlidingWindowRateLimiter {
	private readonly hits = new Map<string, number[]>();

	constructor(
		private readonly limit: number,
		private readonly windowMs: number,
		private readonly now: () => number = Date.now,
	) {}

	consume(key: string): RateLimitResult {
		const now = this.now();
		const windowStart = now - this.windowMs;
		const timestamps = (this.hits.get(key) ?? []).filter(
			timestamp => timestamp > windowStart,
		);

		if (timestamps.length >= this.limit) {
			const oldest = timestamps[0] ?? now;
			this.hits.set(key, timestamps);
			return {
				ok: false,
				retryAfterMs: Math.max(oldest + this.windowMs - now, 0),
			};
		}

		timestamps.push(now);
		this.hits.set(key, timestamps);
		return { ok: true };
	}
}
