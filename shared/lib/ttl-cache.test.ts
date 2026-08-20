import { describe, expect, it } from 'vitest';
import { TtlCache } from './ttl-cache';

describe('TtlCache', () => {
	it('returns a stored value before expiry', () => {
		const now = 1_000;
		const cache = new TtlCache<string>(500, () => now);

		cache.set('a', 'hit');

		expect(cache.get('a')).toBe('hit');
	});

	it('misses after ttl elapses', () => {
		let now = 1_000;
		const cache = new TtlCache<string>(500, () => now);

		cache.set('a', 'stale');
		now = 1_501;

		expect(cache.get('a')).toBeUndefined();
	});

	it('overwrites an existing key', () => {
		const cache = new TtlCache<number>(1_000, () => 0);

		cache.set('n', 1);
		cache.set('n', 2);

		expect(cache.get('n')).toBe(2);
	});
});
