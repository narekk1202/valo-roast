import { describe, expect, it } from 'vitest';
import { SlidingWindowRateLimiter } from './rate-limit';

describe('SlidingWindowRateLimiter', () => {
	it('allows requests under the limit', () => {
		const now = 0;
		const limiter = new SlidingWindowRateLimiter(2, 1_000, () => now);

		expect(limiter.consume('ip')).toEqual({ ok: true });
		expect(limiter.consume('ip')).toEqual({ ok: true });
	});

	it('blocks the next request in the same window', () => {
		const now = 0;
		const limiter = new SlidingWindowRateLimiter(1, 1_000, () => now);

		expect(limiter.consume('ip')).toEqual({ ok: true });
		expect(limiter.consume('ip')).toEqual({
			ok: false,
			retryAfterMs: 1_000,
		});
	});

	it('allows a new request after the window slides', () => {
		let now = 0;
		const limiter = new SlidingWindowRateLimiter(1, 1_000, () => now);

		limiter.consume('ip');
		now = 1_001;

		expect(limiter.consume('ip')).toEqual({ ok: true });
	});

	it('tracks keys independently', () => {
		const limiter = new SlidingWindowRateLimiter(1, 1_000, () => 0);

		expect(limiter.consume('a')).toEqual({ ok: true });
		expect(limiter.consume('b')).toEqual({ ok: true });
		expect(limiter.consume('a').ok).toBe(false);
	});
});
