import {
	PlayerAnalysis,
	PlayerMatchAnalysis,
	RiotAccountData,
	ValorantMatch,
} from '../types';
import { analyzeMatch } from './analyze-match';
import { analyzePlayer } from './analyze-player';

export function buildPlayerStats(
	account: RiotAccountData,
	matches: ValorantMatch[],
): PlayerAnalysis | null {
	const analyses = matches
		.map(match => analyzeMatch(match, account.puuid))
		.filter((row): row is PlayerMatchAnalysis => row !== null);

	return analyzePlayer(
		{
			puuid: account.puuid,
			name: account.name,
			tag: account.tag,
			level: account.account_level,
		},
		analyses,
	);
}
