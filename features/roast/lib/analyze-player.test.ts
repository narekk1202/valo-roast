import { describe, expect, it } from 'vitest';
import type { PlayerMatchAnalysis } from '../types';
import { analyzePlayer } from './analyze-player';

const identity = {
	puuid: 'p-self',
	name: 'Narek',
	tag: '000',
	level: 50,
};

function match(
	overrides: Partial<PlayerMatchAnalysis> = {},
): PlayerMatchAnalysis {
	return {
		matchId: 'm1',
		map: 'Ascent',
		mode: 'Competitive',
		date: 'today',
		duration: 2000,
		rounds: 20,
		result: 'win',
		agent: 'Jett',
		kills: 10,
		deaths: 5,
		assists: 2,
		kd: 2,
		kda: 2.4,
		score: 200,
		scorePerRound: 10,
		headshots: 10,
		bodyshots: 10,
		legshots: 0,
		headshotRate: 0.5,
		damageMade: 100,
		damageReceived: 50,
		firstKills: 2,
		firstDeaths: 1,
		afkRounds: 1,
		roundsInSpawn: 2,
		friendlyFireOutgoing: 3,
		abilityCasts: 10,
		spent: 100,
		averageLoadoutValue: 1000,
		rank: 'Gold 1',
		rankId: 20,
		...overrides,
	};
}

describe('analyzePlayer', () => {
	it('returns null when there are no analyzable matches', () => {
		expect(analyzePlayer(identity, [])).toBeNull();
	});

	it('aggregates record, performance, and behavior', () => {
		const analysis = analyzePlayer(identity, [
			match(),
			match({
				matchId: 'm2',
				map: 'Bind',
				result: 'loss',
				agent: 'Jett',
				kills: 6,
				deaths: 10,
				assists: 4,
				score: 100,
				scorePerRound: 5,
				headshots: 5,
				bodyshots: 15,
				legshots: 0,
				firstKills: 0,
				firstDeaths: 3,
				afkRounds: 0,
				roundsInSpawn: 1,
				friendlyFireOutgoing: 1,
				abilityCasts: 20,
				spent: 200,
				averageLoadoutValue: 2000,
				damageMade: 200,
				damageReceived: 150,
				rank: 'Gold 2',
				rankId: 21,
			}),
		]);

		expect(analysis?.player).toEqual({
			puuid: 'p-self',
			name: 'Narek',
			tag: '000',
			level: 50,
			rank: 'Gold 1',
			rankId: 20,
		});
		expect(analysis?.matches).toEqual({
			total: 2,
			wins: 1,
			losses: 1,
			draws: 0,
			winRate: 0.5,
		});
		expect(analysis?.performance.kills).toBe(16);
		expect(analysis?.performance.deaths).toBe(15);
		expect(analysis?.performance.assists).toBe(6);
		expect(analysis?.performance.averageKills).toBe(8);
		expect(analysis?.performance.kd).toBeCloseTo(16 / 15);
		expect(analysis?.performance.headshotRate).toBeCloseTo(15 / 40);
		expect(analysis?.opening).toEqual({
			firstKills: 2,
			firstDeaths: 4,
			openingWinRate: 2 / 6,
		});
		expect(analysis?.behavior).toEqual({
			afkRounds: 1,
			roundsInSpawn: 3,
			friendlyFireDamage: 4,
		});
		expect(analysis?.abilities.totalCasts).toBe(30);
		expect(analysis?.abilities.averageCastsPerRound).toBeCloseTo(30 / 40);
		expect(analysis?.economy.totalSpent).toBe(300);
		expect(analysis?.economy.averageSpentPerRound).toBeCloseTo(300 / 40);
		expect(analysis?.economy.averageLoadoutValue).toBe(1500);
	});

	it('counts draws separately from losses', () => {
		const analysis = analyzePlayer(identity, [
			match({ result: 'win' }),
			match({ matchId: 'm2', result: 'draw' }),
		]);

		expect(analysis?.matches).toEqual({
			total: 2,
			wins: 1,
			losses: 0,
			draws: 1,
			winRate: 0.5,
		});
	});

	it('groups agents and maps', () => {
		const analysis = analyzePlayer(identity, [
			match({ agent: 'Jett', map: 'Ascent', result: 'win', kills: 10, deaths: 5 }),
			match({
				matchId: 'm2',
				agent: 'Jett',
				map: 'Bind',
				result: 'loss',
				kills: 6,
				deaths: 10,
			}),
			match({
				matchId: 'm3',
				agent: 'Sage',
				map: 'Ascent',
				result: 'win',
				kills: 4,
				deaths: 8,
			}),
		]);

		expect(analysis?.agents).toEqual([
			{
				name: 'Jett',
				games: 2,
				wins: 1,
				losses: 1,
				winRate: 0.5,
				kd: 16 / 15,
				pickRate: 2 / 3,
			},
			{
				name: 'Sage',
				games: 1,
				wins: 1,
				losses: 0,
				winRate: 1,
				kd: 0.5,
				pickRate: 1 / 3,
			},
		]);
		expect(analysis?.maps).toEqual([
			{
				name: 'Ascent',
				games: 2,
				wins: 2,
				losses: 0,
				winRate: 1,
				kd: 14 / 13,
			},
			{
				name: 'Bind',
				games: 1,
				wins: 0,
				losses: 1,
				winRate: 0,
				kd: 0.6,
			},
		]);
	});

	it('keeps scores in 0-100', () => {
		const analysis = analyzePlayer(identity, [match()]);
		const scores = analysis?.scores;

		expect(scores).toBeDefined();
		for (const value of Object.values(scores!)) {
			expect(value).toBeGreaterThanOrEqual(0);
			expect(value).toBeLessThanOrEqual(100);
		}
	});
});
