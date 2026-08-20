import { describe, expect, it } from 'vitest';
import type { PlayerAnalysis } from '../types';
import { generateRoast } from './generate-roast';

function analysis(): PlayerAnalysis {
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
			total: 2,
			wins: 1,
			losses: 1,
			draws: 0,
			winRate: 0.5,
		},
		performance: {
			kills: 16,
			deaths: 15,
			assists: 6,
			kd: 16 / 15,
			kda: 22 / 15,
			averageKills: 8,
			averageDeaths: 7.5,
			averageAssists: 3,
			averageScore: 150,
			averageScorePerRound: 8,
			headshotRate: 0.3,
			averageDamageMade: 140,
			averageDamageReceived: 150,
		},
		opening: {
			firstKills: 2,
			firstDeaths: 4,
			openingWinRate: 0.33,
		},
		behavior: {
			afkRounds: 0,
			roundsInSpawn: 1,
			friendlyFireDamage: 4,
		},
		abilities: {
			totalCasts: 20,
			averageCastsPerRound: 0.5,
		},
		economy: {
			totalSpent: 300,
			averageSpentPerRound: 8,
			averageLoadoutValue: 1500,
		},
		agents: [
			{
				name: 'Jett',
				games: 2,
				wins: 1,
				losses: 1,
				winRate: 0.5,
				kd: 1,
				pickRate: 1,
			},
		],
		maps: [
			{
				name: 'Bind',
				games: 2,
				wins: 0,
				losses: 2,
				winRate: 0,
				kd: 0.6,
			},
		],
		scores: {
			overall: 40,
			aim: 40,
			gameSense: 30,
			teamplay: 40,
			survival: 50,
			consistency: 50,
			ego: 70,
		},
	};
}

describe('generateRoast', () => {
	it('returns trimmed roast text', async () => {
		const result = await generateRoast(
			analysis(),
			async () => '  You peeked mid every round.  ',
		);

		expect(result).toEqual({
			ok: true,
			data: 'You peeked mid every round.',
		});
	});

	it('sends the roast prompt to the generator', async () => {
		let received = { system: '', prompt: '' };

		await generateRoast(analysis(), async input => {
			received = input;
			return 'ok';
		});

		expect(received.system.toLowerCase()).toContain('roast');
		expect(received.prompt).toContain('Narek#000');
		expect(received.prompt).not.toContain('secret-puuid');
	});

	it('fails when the model returns empty text', async () => {
		const result = await generateRoast(analysis(), async () => '   ');

		expect(result).toEqual({ ok: false, error: 'Roast came back empty' });
	});

	it('fails when generation throws', async () => {
		const result = await generateRoast(analysis(), async () => {
			throw new Error('boom');
		});

		expect(result).toEqual({ ok: false, error: 'Failed to generate roast' });
	});
});
