'use client';

import { useEffect, useState } from 'react';
import { PENDING_STEP_MS, pendingSteps } from '../content/pending-steps';
import { pendingComment, pendingStepIndex } from '../lib/pending-progress';

export function usePendingSteps() {
	const [tick, setTick] = useState(0);

	useEffect(() => {
		const id = window.setInterval(() => {
			setTick(current => current + 1);
		}, PENDING_STEP_MS);

		return () => window.clearInterval(id);
	}, []);

	const index = pendingStepIndex(tick, pendingSteps.length);
	const step = pendingSteps[index] ?? pendingSteps[0];
	const comment = pendingComment(step, tick, pendingSteps.length);

	return { index, step, comment, steps: pendingSteps };
}
