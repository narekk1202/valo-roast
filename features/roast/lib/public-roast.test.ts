import { describe, expect, it } from 'vitest';
import type { PlayerAnalysis, RiotAccountData } from '../types';
import { toPublicRoast } from './public-roast';

function account(): RiotAccountData {
	return {
		puuid: 'secret-puuid',
		region: 'eu',
		account_level: 50,
		name: 'Narek',
		tag: '000',
		card: {
			small: 'https://media.valorant-api.com/small.png',
			large: '',
			wide: '',
			id: 'card',
		},
		last_update: '',
		last_update_raw: 0,
	};
}

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
		agents: [],
		maps: [],
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

describe('toPublicRoast', () => {
	it('exposes facts and share path without puuid', () => {
		const view = toPublicRoast(account(), analysis(), 'You peeked mid every round.');

		expect(view.riotId).toBe('Narek#000');
		expect(view.sharePath).toBe('/roast/Narek/000');
		expect(view.cardSmall).toContain('small.png');
		expect(view.facts.matchCount).toBe(2);
		expect(JSON.stringify(view)).not.toContain('secret-puuid');
	});
});
