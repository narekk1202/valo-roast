import { describe, expect, it } from 'vitest';
import type { PlayerAnalysis } from '../types';
import { buildRoastPrompt, toRoastFacts } from './roast-prompt';

function analysis(
	overrides: Partial<PlayerAnalysis> = {},
): PlayerAnalysis {
	return {
		player: {
			puuid: 'secret-puuid',
			name: 'Narek',
			tag: '000',
			level: 50,
			rank: 'Gold 1',
			rankId: 20,
		},
		matches: {
			total: 5,
			wins: 2,
			losses: 3,
			draws: 0,
			winRate: 0.4,
		},
		performance: {
			kills: 40,
			deaths: 50,
			assists: 10,
			kd: 0.8,
			kda: 1,
			averageKills: 8,
			averageDeaths: 10,
			averageAssists: 2,
			averageScore: 180,
			averageScorePerRound: 9.4,
			headshotRate: 0.125,
			averageDamageMade: 120,
			averageDamageReceived: 160,
		},
		opening: {
			firstKills: 3,
			firstDeaths: 12,
			openingWinRate: 0.2,
		},
		behavior: {
			afkRounds: 2,
			roundsInSpawn: 4,
			friendlyFireDamage: 80,
		},
		abilities: {
			totalCasts: 40,
			averageCastsPerRound: 0.4,
		},
		economy: {
			totalSpent: 20000,
			averageSpentPerRound: 200,
			averageLoadoutValue: 2400,
		},
		agents: [
			{
				name: 'Jett',
				games: 4,
				wins: 1,
				losses: 3,
				winRate: 0.25,
				kd: 0.7,
				pickRate: 0.8,
			},
			{
				name: 'Sage',
				games: 1,
				wins: 1,
				losses: 0,
				winRate: 1,
				kd: 1.2,
				pickRate: 0.2,
			},
		],
		maps: [
			{
				name: 'Ascent',
				games: 3,
				wins: 2,
				losses: 1,
				winRate: 2 / 3,
				kd: 1,
			},
			{
				name: 'Bind',
				games: 2,
				wins: 0,
				losses: 2,
				winRate: 0,
				kd: 0.4,
			},
		],
		scores: {
			overall: 41,
			aim: 31,
			gameSense: 20,
			teamplay: 25,
			survival: 40,
			consistency: 55,
			ego: 80,
		},
		...overrides,
	};
}

describe('toRoastFacts', () => {
	it('formats identity and rates without leaking puuid', () => {
		const facts = toRoastFacts(analysis());

		expect(facts.riotId).toBe('Narek#000');
		expect(facts.rank).toBe('Gold 1');
		expect(facts.level).toBe(50);
		expect(facts.record).toBe('2-3-0');
		expect(facts.winRate).toBe('40%');
		expect(facts.kd).toBe('0.80');
		expect(facts.acs).toBe('9');
		expect(facts.headshotRate).toBe('13%');
		expect(JSON.stringify(facts)).not.toContain('secret-puuid');
	});

	it('picks the main agent and worst map', () => {
		const facts = toRoastFacts(analysis());

		expect(facts.mainAgent).toBe('Jett');
		expect(facts.worstMap).toBe('Bind');
	});
});

describe('buildRoastPrompt', () => {
	it('asks for a Valorant roast and cites the player stats', () => {
		const { system, prompt } = buildRoastPrompt(analysis());

		expect(system.toLowerCase()).toContain('roast');
		expect(system.toLowerCase()).toContain('plain text');
		expect(prompt).toContain('Narek#000');
		expect(prompt).toContain('Gold 1');
		expect(prompt).toContain('40%');
		expect(prompt).toContain('Jett');
		expect(prompt).toContain('Bind');
		expect(prompt).not.toContain('secret-puuid');
	});
});
