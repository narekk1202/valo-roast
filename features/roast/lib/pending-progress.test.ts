import { describe, expect, it } from 'vitest';
import {
	pendingComment,
	pendingHoldingIndex,
	pendingStepIndex,
} from './pending-progress';

describe('pendingStepIndex', () => {
	it('stays on the last step after the sequence finishes', () => {
		expect(pendingStepIndex(0, 4)).toBe(0);
		expect(pendingStepIndex(3, 4)).toBe(3);
		expect(pendingStepIndex(9, 4)).toBe(3);
	});
});

describe('pendingHoldingIndex', () => {
	it('is 0 until the last step', () => {
		expect(pendingHoldingIndex(0, 4, 3)).toBe(0);
		expect(pendingHoldingIndex(2, 4, 3)).toBe(0);
	});

	it('rotates holding lines after the last step', () => {
		expect(pendingHoldingIndex(3, 4, 3)).toBe(0);
		expect(pendingHoldingIndex(4, 4, 3)).toBe(1);
		expect(pendingHoldingIndex(5, 4, 3)).toBe(2);
		expect(pendingHoldingIndex(6, 4, 3)).toBe(0);
	});
});

describe('pendingComment', () => {
	const step = {
		label: 'VERDICT',
		comment: 'Drafting the insult.',
		holding: ['Still cooking.', 'Henrik is judging you.'],
	};

	it('uses the main comment before the last step', () => {
		expect(pendingComment(step, 1, 4)).toBe('Drafting the insult.');
	});

	it('cycles holding copy once the last step is reached', () => {
		expect(pendingComment(step, 3, 4)).toBe('Drafting the insult.');
		expect(pendingComment(step, 4, 4)).toBe('Still cooking.');
		expect(pendingComment(step, 5, 4)).toBe('Henrik is judging you.');
		expect(pendingComment(step, 6, 4)).toBe('Drafting the insult.');
	});
});
