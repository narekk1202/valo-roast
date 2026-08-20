import { describe, expect, it } from 'vitest';
import { clientIp } from './client-ip';

describe('clientIp', () => {
	it('uses the first x-forwarded-for hop', () => {
		const headers = new Headers({
			'x-forwarded-for': ' 1.1.1.1, 2.2.2.2',
		});

		expect(clientIp(headers)).toBe('1.1.1.1');
	});

	it('falls back to x-real-ip', () => {
		const headers = new Headers({ 'x-real-ip': ' 9.9.9.9 ' });

		expect(clientIp(headers)).toBe('9.9.9.9');
	});

	it('returns unknown when no ip headers exist', () => {
		expect(clientIp(new Headers())).toBe('unknown');
	});
});
