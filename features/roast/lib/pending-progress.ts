export type PendingStep = {
	label: string;
	comment: string;
	holding?: readonly string[];
};

export function pendingStepIndex(tick: number, stepCount: number): number {
	if (stepCount <= 0) {
		return 0;
	}

	return Math.min(Math.max(tick, 0), stepCount - 1);
}

export function pendingHoldingIndex(
	tick: number,
	stepCount: number,
	holdingCount: number,
): number {
	if (holdingCount <= 0 || tick < stepCount - 1) {
		return 0;
	}

	return (tick - (stepCount - 1)) % holdingCount;
}

export function pendingComment(
	step: PendingStep,
	tick: number,
	stepCount: number,
): string {
	const holding = [step.comment, ...(step.holding ?? [])];
	const index = pendingHoldingIndex(tick, stepCount, holding.length);
	return holding[index] ?? step.comment;
}
