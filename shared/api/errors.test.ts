import { describe, expect, it } from 'vitest';
import { httpErrorMessage } from './errors';

describe('httpErrorMessage', () => {
	it('does not mention api keys on 401 or 403', () => {
		expect(httpErrorMessage(401)).toBe('Service unavailable');
		expect(httpErrorMessage(403)).toBe('Service unavailable');
		expect(httpErrorMessage(401).toLowerCase()).not.toContain('key');
	});

	it('keeps rate-limit and not-found copy', () => {
		expect(httpErrorMessage(429)).toBe(
			'Rate limit exceeded. Please wait a moment.',
		);
		expect(httpErrorMessage(404, 'Account not found')).toBe(
			'Account not found',
		);
	});
});
