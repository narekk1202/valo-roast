import { describe, expect, it } from 'vitest';
import { valorantMatchesSchema } from './schemas';

describe('valorantMatchesSchema', () => {
	it('keeps a competitive match with required fields', () => {
		const parsed = valorantMatchesSchema.safeParse([
			{
				is_available: true,
				metadata: {
					map: 'Ascent',
					game_length: 1000,
					game_start_patched: 'today',
					rounds_played: 13,
					mode: 'Competitive',
					mode_id: 'competitive',
					matchid: 'm1',
				},
				players: {
					all_players: [
						{
							puuid: 'p-self',
							team: 'Blue',
							stats: {
								score: 1,
								kills: 1,
								deaths: 1,
								assists: 0,
								bodyshots: 1,
								headshots: 0,
								legshots: 0,
							},
						},
					],
				},
				teams: {
					red: { has_won: false },
					blue: { has_won: true },
				},
				kills: [],
			},
		]);

		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data).toHaveLength(1);
			expect(parsed.data[0]?.metadata?.matchid).toBe('m1');
		}
	});

	it('drops garbage rows instead of failing the whole payload', () => {
		const parsed = valorantMatchesSchema.safeParse([
			{ nope: true },
			{
				is_available: true,
				metadata: null,
				players: null,
				teams: null,
			},
		]);

		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data).toHaveLength(1);
			expect(parsed.data[0]?.is_available).toBe(true);
		}
	});
});
