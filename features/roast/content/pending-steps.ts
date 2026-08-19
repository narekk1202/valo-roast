import type { PendingStep } from '../lib/pending-progress';

export const PENDING_STEP_MS = 1600;

export const pendingSteps = [
	{
		label: 'LOCATE',
		comment: 'Pinging Riot. If this ID is fake, the roast writes itself.',
	},
	{
		label: 'REPLAYS',
		comment: 'Pulling every round you peeked mid for free.',
	},
	{
		label: 'AUTOPSY',
		comment: 'Counting first deaths. The spreadsheet already looks embarrassed.',
	},
	{
		label: 'VERDICT',
		comment: 'Translating ACS into something your stack already typed in all chat.',
		holding: [
			'Still cooking. Your KDA asked to remain anonymous.',
			'Henrik is buffering. Classic bottom-frag latency.',
			'Sharpening the punchline. You gave us a lot of material.',
		],
	},
] as const satisfies readonly PendingStep[];
