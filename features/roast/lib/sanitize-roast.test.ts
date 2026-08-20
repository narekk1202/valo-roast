import { describe, expect, it } from 'vitest';
import { sanitizeRoast } from './sanitize-roast';

describe('sanitizeRoast', () => {
	it('returns trimmed plain text', () => {
		expect(sanitizeRoast('  You peeked mid every round.  ')).toEqual({
			ok: true,
			data: 'You peeked mid every round.',
		});
	});

	it('strips markdown fences and emphasis', () => {
		const result = sanitizeRoast(
			'**Wow.** You still `peeked` mid every round.\n```js\nalert(1)\n```',
		);

		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.data).not.toContain('```');
			expect(result.data).not.toContain('**');
			expect(result.data).toContain('Wow.');
		}
	});

	it('rejects empty or tiny output', () => {
		expect(sanitizeRoast('   ')).toEqual({
			ok: false,
			error: 'Roast came back empty',
		});
		expect(sanitizeRoast('nope').ok).toBe(false);
	});
});
