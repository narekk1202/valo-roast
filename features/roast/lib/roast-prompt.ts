import type { MapAnalysis, PlayerAnalysis, PlayerScores } from '../types';

export type RoastFacts = {
	riotId: string;
	rank: string;
	level: number;
	record: string;
	winRate: string;
	kd: string;
	acs: string;
	headshotRate: string;
	firstKills: number;
	firstDeaths: number;
	afkRounds: number;
	roundsInSpawn: number;
	friendlyFireDamage: number;
	mainAgent: string | null;
	worstMap: string | null;
	scores: PlayerScores;
};

function percent(value: number): string {
	return `${Math.round(value * 100)}%`;
}

function worstMapName(maps: MapAnalysis[]): string | null {
	if (maps.length === 0) {
		return null;
	}

	return [...maps].sort((a, b) => {
		if (a.winRate !== b.winRate) {
			return a.winRate - b.winRate;
		}
		if (a.games !== b.games) {
			return b.games - a.games;
		}
		return a.name.localeCompare(b.name);
	})[0]?.name ?? null;
}

export function toRoastFacts(analysis: PlayerAnalysis): RoastFacts {
	return {
		riotId: `${analysis.player.name}#${analysis.player.tag}`,
		rank: analysis.player.rank,
		level: analysis.player.level,
		record: `${analysis.matches.wins}-${analysis.matches.losses}-${analysis.matches.draws}`,
		winRate: percent(analysis.matches.winRate),
		kd: analysis.performance.kd.toFixed(2),
		acs: String(Math.round(analysis.performance.averageScorePerRound)),
		headshotRate: percent(analysis.performance.headshotRate),
		firstKills: analysis.opening.firstKills,
		firstDeaths: analysis.opening.firstDeaths,
		afkRounds: analysis.behavior.afkRounds,
		roundsInSpawn: analysis.behavior.roundsInSpawn,
		friendlyFireDamage: analysis.behavior.friendlyFireDamage,
		mainAgent: analysis.agents[0]?.name ?? null,
		worstMap: worstMapName(analysis.maps),
		scores: analysis.scores,
	};
}

const ROAST_SYSTEM = `You roast Valorant players. Voice: salty teammate in all-chat. Funny, specific, mean — never hateful. No slurs, bigotry, or threats. 2-4 short paragraphs. Cite the actual numbers. Plain text only — no markdown. Do not mention AI, prompts, or that you were given stats.`;

export function buildRoastPrompt(analysis: PlayerAnalysis): {
	system: string;
	prompt: string;
} {
	const facts = toRoastFacts(analysis);
	const lines = [
		`Player: ${facts.riotId}`,
		`Rank: ${facts.rank} (level ${facts.level})`,
		`Record: ${facts.record} (${facts.winRate}) over ${analysis.matches.total} games`,
		`Combat: ${facts.kd} KD, ${facts.acs} ACS, ${facts.headshotRate} HS`,
		`Openings: ${facts.firstKills} first kills / ${facts.firstDeaths} first deaths`,
		`Behavior: ${facts.afkRounds} AFK rounds, ${facts.roundsInSpawn} rounds in spawn, ${facts.friendlyFireDamage} friendly fire damage`,
		facts.mainAgent ? `Main: ${facts.mainAgent}` : null,
		facts.worstMap ? `Worst map: ${facts.worstMap}` : null,
		`Scores: overall ${facts.scores.overall}, aim ${facts.scores.aim}, game sense ${facts.scores.gameSense}, teamplay ${facts.scores.teamplay}, survival ${facts.scores.survival}, consistency ${facts.scores.consistency}, ego ${facts.scores.ego}`,
	].filter((line): line is string => line !== null);

	return {
		system: ROAST_SYSTEM,
		prompt: lines.join('\n'),
	};
}
