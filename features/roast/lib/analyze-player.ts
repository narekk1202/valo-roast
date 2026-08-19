import {
	AgentAnalysis,
	MapAnalysis,
	PlayerAnalysis,
	PlayerMatchAnalysis,
	PlayerScores,
} from '../types';

type PlayerIdentity = {
	puuid: string;
	name: string;
	tag: string;
	level: number;
};

function ratio(numerator: number, denominator: number): number {
	return denominator === 0 ? 0 : numerator / denominator;
}

function kd(kills: number, deaths: number): number {
	return deaths === 0 ? kills : kills / deaths;
}

function clampScore(value: number): number {
	return Math.max(0, Math.min(100, Math.round(value)));
}

function stdev(values: number[]): number {
	if (values.length < 2) {
		return 0;
	}

	const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
	const variance =
		values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
		values.length;
	return Math.sqrt(variance);
}

function groupAgents(matches: PlayerMatchAnalysis[]): AgentAnalysis[] {
	const byName = new Map<
		string,
		{ games: number; wins: number; losses: number; kills: number; deaths: number }
	>();

	for (const match of matches) {
		const current = byName.get(match.agent) ?? {
			games: 0,
			wins: 0,
			losses: 0,
			kills: 0,
			deaths: 0,
		};
		current.games += 1;
		if (match.result === 'win') current.wins += 1;
		if (match.result === 'loss') current.losses += 1;
		current.kills += match.kills;
		current.deaths += match.deaths;
		byName.set(match.agent, current);
	}

	return [...byName.entries()]
		.map(([name, stats]) => ({
			name,
			games: stats.games,
			wins: stats.wins,
			losses: stats.losses,
			winRate: ratio(stats.wins, stats.games),
			kd: kd(stats.kills, stats.deaths),
			pickRate: ratio(stats.games, matches.length),
		}))
		.sort((a, b) => b.games - a.games || a.name.localeCompare(b.name));
}

function groupMaps(matches: PlayerMatchAnalysis[]): MapAnalysis[] {
	const byName = new Map<
		string,
		{ games: number; wins: number; losses: number; kills: number; deaths: number }
	>();

	for (const match of matches) {
		const current = byName.get(match.map) ?? {
			games: 0,
			wins: 0,
			losses: 0,
			kills: 0,
			deaths: 0,
		};
		current.games += 1;
		if (match.result === 'win') current.wins += 1;
		if (match.result === 'loss') current.losses += 1;
		current.kills += match.kills;
		current.deaths += match.deaths;
		byName.set(match.map, current);
	}

	return [...byName.entries()]
		.map(([name, stats]) => ({
			name,
			games: stats.games,
			wins: stats.wins,
			losses: stats.losses,
			winRate: ratio(stats.wins, stats.games),
			kd: kd(stats.kills, stats.deaths),
		}))
		.sort((a, b) => b.games - a.games || a.name.localeCompare(b.name));
}

function scorePlayer(matches: PlayerMatchAnalysis[]): PlayerScores {
	const totalRounds = matches.reduce((sum, match) => sum + match.rounds, 0);
	const totalKills = matches.reduce((sum, match) => sum + match.kills, 0);
	const totalDeaths = matches.reduce((sum, match) => sum + match.deaths, 0);
	const totalAssists = matches.reduce((sum, match) => sum + match.assists, 0);
	const totalShots = matches.reduce(
		(sum, match) => sum + match.headshots + match.bodyshots + match.legshots,
		0,
	);
	const totalHeadshots = matches.reduce(
		(sum, match) => sum + match.headshots,
		0,
	);
	const firstKills = matches.reduce((sum, match) => sum + match.firstKills, 0);
	const firstDeaths = matches.reduce(
		(sum, match) => sum + match.firstDeaths,
		0,
	);

	const aim = clampScore(ratio(totalHeadshots, totalShots) * 250);
	const gameSense = clampScore(
		ratio(firstKills, firstKills + firstDeaths) * 100,
	);
	const teamplay = clampScore(ratio(totalAssists, Math.max(totalKills, 1)) * 100);
	const survival = clampScore(100 - ratio(totalDeaths, totalRounds) * 50);
	const consistency = clampScore(100 - stdev(matches.map(match => match.kd)) * 40);
	const ego = clampScore(ratio(firstDeaths, firstKills + firstDeaths) * 100);
	const overall = clampScore(
		(aim + gameSense + teamplay + survival + consistency) / 5,
	);

	return { overall, aim, gameSense, teamplay, survival, consistency, ego };
}

export function analyzePlayer(
	identity: PlayerIdentity,
	matches: PlayerMatchAnalysis[],
): PlayerAnalysis | null {
	if (matches.length === 0) {
		return null;
	}

	const latest = matches[0];
	const total = matches.length;
	const wins = matches.filter(match => match.result === 'win').length;
	const losses = matches.filter(match => match.result === 'loss').length;
	const draws = matches.filter(match => match.result === 'draw').length;
	const totalKills = matches.reduce((sum, match) => sum + match.kills, 0);
	const totalDeaths = matches.reduce((sum, match) => sum + match.deaths, 0);
	const totalAssists = matches.reduce((sum, match) => sum + match.assists, 0);
	const totalRounds = matches.reduce((sum, match) => sum + match.rounds, 0);
	const totalScore = matches.reduce((sum, match) => sum + match.score, 0);
	const totalHeadshots = matches.reduce(
		(sum, match) => sum + match.headshots,
		0,
	);
	const totalShots = matches.reduce(
		(sum, match) => sum + match.headshots + match.bodyshots + match.legshots,
		0,
	);
	const firstKills = matches.reduce((sum, match) => sum + match.firstKills, 0);
	const firstDeaths = matches.reduce(
		(sum, match) => sum + match.firstDeaths,
		0,
	);
	const totalCasts = matches.reduce(
		(sum, match) => sum + match.abilityCasts,
		0,
	);
	const totalSpent = matches.reduce((sum, match) => sum + match.spent, 0);

	return {
		player: {
			...identity,
			rank: latest.rank,
			rankId: latest.rankId,
		},
		matches: {
			total,
			wins,
			losses,
			draws,
			winRate: ratio(wins, total),
		},
		performance: {
			kills: totalKills,
			deaths: totalDeaths,
			assists: totalAssists,
			kd: kd(totalKills, totalDeaths),
			kda: kd(totalKills + totalAssists, totalDeaths),
			averageKills: ratio(totalKills, total),
			averageDeaths: ratio(totalDeaths, total),
			averageAssists: ratio(totalAssists, total),
			averageScore: ratio(totalScore, total),
			averageScorePerRound: ratio(totalScore, totalRounds),
			headshotRate: ratio(totalHeadshots, totalShots),
			averageDamageMade: ratio(
				matches.reduce((sum, match) => sum + match.damageMade, 0),
				total,
			),
			averageDamageReceived: ratio(
				matches.reduce((sum, match) => sum + match.damageReceived, 0),
				total,
			),
		},
		opening: {
			firstKills,
			firstDeaths,
			openingWinRate: ratio(firstKills, firstKills + firstDeaths),
		},
		behavior: {
			afkRounds: matches.reduce((sum, match) => sum + match.afkRounds, 0),
			roundsInSpawn: matches.reduce(
				(sum, match) => sum + match.roundsInSpawn,
				0,
			),
			friendlyFireDamage: matches.reduce(
				(sum, match) => sum + match.friendlyFireOutgoing,
				0,
			),
		},
		abilities: {
			totalCasts,
			averageCastsPerRound: ratio(totalCasts, totalRounds),
		},
		economy: {
			totalSpent,
			averageSpentPerRound: ratio(totalSpent, totalRounds),
			averageLoadoutValue: ratio(
				matches.reduce((sum, match) => sum + match.averageLoadoutValue, 0),
				total,
			),
		},
		agents: groupAgents(matches),
		maps: groupMaps(matches),
		scores: scorePlayer(matches),
	};
}
