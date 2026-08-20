import { describe, expect, it } from 'vitest';
import { riotIdKey, schema, sharePath, splitRiotId } from './schemas';

describe('riot id schema', () => {
	it('accepts a normal Name#TAG', () => {
		expect(schema.parse('Narek#000')).toBe('Narek#000');
	});

	it('rejects a missing tag', () => {
		expect(schema.safeParse('Narek').success).toBe(false);
	});

	it('rejects an oversized id', () => {
		const name = 'N'.repeat(17);
		expect(schema.safeParse(`${name}#ABC`).success).toBe(false);
	});

	it('rejects a tag that is not alphanumeric', () => {
		expect(schema.safeParse('Narek#ab-').success).toBe(false);
	});
});

describe('riot id helpers', () => {
	it('splits name and tag', () => {
		expect(splitRiotId('Narek#000')).toEqual({ name: 'Narek', tag: '000' });
	});

	it('normalizes cache keys', () => {
		expect(riotIdKey('Narek', '000')).toBe('narek#000');
	});

	it('builds an encoded share path', () => {
		expect(sharePath('Foo Bar', 'NA1')).toBe(
			'/roast/Foo%20Bar/NA1',
		);
	});
});
