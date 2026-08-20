import { sharePath } from '../schemas';
import type { PlayerAnalysis, RiotAccountData } from '../types';
import type { RoastFacts } from './roast-prompt';
import { toRoastFacts } from './roast-prompt';

export type PublicRoastView = {
	riotId: string;
	cardSmall: string | null;
	facts: RoastFacts;
	roast: string | null;
	sharePath: string;
};

export function toPublicRoast(
	account: RiotAccountData,
	analysis: PlayerAnalysis,
	roast: string | null,
): PublicRoastView {
	const facts = toRoastFacts(analysis);

	return {
		riotId: facts.riotId,
		cardSmall: account.card.small || null,
		facts,
		roast,
		sharePath: sharePath(account.name, account.tag),
	};
}
