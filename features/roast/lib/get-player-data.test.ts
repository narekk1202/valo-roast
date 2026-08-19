import { describe, expect, it } from 'vitest';
import type { MatchPlayer, RiotAccountData, ValorantMatch } from '../types';
import { buildPlayerStats } from './build-player-stats';

const account: RiotAccountData = {
	puuid: 'p-self',
	region: 'eu',
	account_level: 50,
	name: 'Narek',
	tag: '000',
	card: { small: '', large: '', wide: '', id: '' },
	last_update: '',
	last_update_raw: 0,
};

function player(overrides: Partial<MatchPlayer> = {}): MatchPlayer {
	return {
		puuid: 'p-self',
		name: 'Narek',
		tag: '000',
		team: 'Blue',
		level: 50,
		character: 'Jett',
		currenttier: 20,
		currenttier_patched: 'Gold 1',
		player_card: '',
		player_title: '',
		party_id: '',
		behavior: {
			afk_rounds: 0,
			friendly_fire: { incoming: 0, outgoing: 0 },
			rounds_in_spawn: 0,
		},
		ability_casts: { x_cast: 1, e_cast: 1, q_cast: 1, c_cast: 1 },
		stats: {
			score: 200,
			kills: 10,
			deaths: 5,
			assists: 3,
			bodyshots: 20,
			headshots: 10,
			legshots: 5,
		},
		economy: {
			spent: { overall: 20000, average: 2000 },
			loadout_value: { overall: 25000, average: 2500 },
		},
		damage_made: 1500,
		damage_received: 1200,
		...overrides,
	};
}

function competitiveMatch(): ValorantMatch {
	const self = player();
	return {
		is_available: true,
		metadata: {
			map: 'Ascent',
			game_version: '',
			game_length: 2000,
			game_start: 0,
			game_start_patched: 'today',
			rounds_played: 13,
			mode: 'Competitive',
			mode_id: 'competitive',
			queue: 'competitive',
			season_id: '',
			platform: 'pc',
			matchid: 'm1',
			region: 'eu',
			cluster: '',
		},
		players: { all_players: [self], red: [], blue: [self] },
		teams: {
			red: { has_won: false, rounds_won: 5, rounds_lost: 13 },
			blue: { has_won: true, rounds_won: 13, rounds_lost: 5 },
		},
		rounds: [],
		kills: [],
	};
}

describe('buildPlayerStats', () => {
	it('returns aggregated analysis for spike-mode matches', () => {
		const analysis = buildPlayerStats(account, [competitiveMatch()]);

		expect(analysis?.player.rank).toBe('Gold 1');
		expect(analysis?.matches).toEqual({
			total: 1,
			wins: 1,
			losses: 0,
			draws: 0,
			winRate: 1,
		});
	});

	it('returns null when every match is skipped', () => {
		const deathmatch = {
			...competitiveMatch(),
			metadata: {
				...competitiveMatch().metadata!,
				mode: 'Deathmatch',
				mode_id: 'deathmatch',
			},
		};

		expect(buildPlayerStats(account, [deathmatch])).toBeNull();
	});
});
