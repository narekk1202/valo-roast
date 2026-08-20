import { describe, expect, it } from 'vitest';
import { globalRef } from './global-ref';

describe('globalRef', () => {
	it('returns the same instance for the same key', () => {
		const first = globalRef('test:global-ref', () => ({ n: 1 }));
		const second = globalRef('test:global-ref', () => ({ n: 2 }));

		expect(second).toBe(first);
		expect(first.n).toBe(1);
	});
});
