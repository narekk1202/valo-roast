import { describe, expect, it } from 'vitest';
import type { MatchKill, MatchPlayer, ValorantMatch } from '../types';
import { analyzeMatch } from './analyze-match';

const PUUID = 'p-self';
const OTHER = 'p-other';

function kill(overrides: Partial<MatchKill>): MatchKill {
	return {
		kill_time_in_round: 1000,
		kill_time_in_match: 1000,
		round: 1,
		killer_puuid: OTHER,
		killer_display_name: 'x',
		killer_team: 'Red',
		victim_puuid: PUUID,
		victim_display_name: 'y',
		victim_team: 'Blue',
		damage_weapon_id: 'x',
		secondary_fire_mode: false,
		assistants: [],
		...overrides,
	};
}

function player(overrides: Partial<MatchPlayer> = {}): MatchPlayer {
	return {
		puuid: PUUID,
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
			friendly_fire: { incoming: 0, outgoing: 12 },
			rounds_in_spawn: 0,
		},
		ability_casts: { x_cast: 1, e_cast: 2, q_cast: 3, c_cast: 4 },
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

function makeMatch(overrides: Partial<ValorantMatch> = {}): ValorantMatch {
	const self = player();
	return {
		is_available: true,
		metadata: {
			map: 'Ascent',
			game_version: '',
			game_length: 2000,
			game_start: 0,
			game_start_patched: 'today',
			rounds_played: 2,
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
			red: { has_won: false, rounds_won: 11, rounds_lost: 13 },
			blue: { has_won: true, rounds_won: 13, rounds_lost: 11 },
		},
		rounds: [],
		kills: [],
		...overrides,
	};
}

describe('analyzeMatch', () => {
	it('uses earliest kill_time_in_round as the opening kill, not array order', () => {
		const analysis = analyzeMatch(
			makeMatch({
				kills: [
					kill({
						round: 1,
						kill_time_in_round: 5000,
						killer_puuid: OTHER,
						victim_puuid: PUUID,
					}),
					kill({
						round: 1,
						kill_time_in_round: 800,
						killer_puuid: PUUID,
						victim_puuid: OTHER,
					}),
				],
			}),
			PUUID,
		);

		expect(analysis?.firstKills).toBe(1);
		expect(analysis?.firstDeaths).toBe(0);
	});

	it('counts opening kills on round 0', () => {
		const base = makeMatch();
		const analysis = analyzeMatch(
			makeMatch({
				metadata: {
					...base.metadata!,
					rounds_played: 1,
				},
				kills: [
					kill({
						round: 0,
						kill_time_in_round: 400,
						killer_puuid: PUUID,
						victim_puuid: OTHER,
					}),
				],
			}),
			PUUID,
		);

		expect(analysis?.firstKills).toBe(1);
	});

	it('returns draw when neither team has_won', () => {
		const analysis = analyzeMatch(
			makeMatch({
				teams: {
					red: { has_won: false, rounds_won: 12, rounds_lost: 12 },
					blue: { has_won: false, rounds_won: 12, rounds_lost: 12 },
				},
			}),
			PUUID,
		);

		expect(analysis?.result).toBe('draw');
	});

	it('treats missing ability casts as zero instead of throwing', () => {
		const analysis = analyzeMatch(
			makeMatch({
				players: {
					all_players: [
						player({
							ability_casts: null,
						}),
					],
					red: [],
					blue: [],
				},
			}),
			PUUID,
		);

		expect(analysis?.abilityCasts).toBe(0);
	});

	it('returns null for unavailable matches instead of throwing', () => {
		const match = {
			is_available: false,
			metadata: null,
			players: null,
			teams: null,
			rounds: [],
			kills: [],
		} as unknown as ValorantMatch;

		expect(analyzeMatch(match, PUUID)).toBeNull();
	});

	it('returns null for unrated', () => {
		const base = makeMatch();
		const analysis = analyzeMatch(
			makeMatch({
				metadata: {
					...base.metadata!,
					mode: 'Unrated',
					mode_id: 'unrated',
				},
			}),
			PUUID,
		);

		expect(analysis).toBeNull();
	});

	it('returns null for deathmatch', () => {
		const base = makeMatch();
		const analysis = analyzeMatch(
			makeMatch({
				metadata: {
					...base.metadata!,
					mode: 'Deathmatch',
					mode_id: 'deathmatch',
				},
			}),
			PUUID,
		);

		expect(analysis).toBeNull();
	});

	it('returns null when the player is missing from the match', () => {
		const analysis = analyzeMatch(
			makeMatch({
				players: { all_players: [player({ puuid: OTHER })], red: [], blue: [] },
			}),
			PUUID,
		);

		expect(analysis).toBeNull();
	});
});
