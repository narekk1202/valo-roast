import { z } from 'zod';

export const riotAccountSchema = z.object({
	puuid: z.string(),
	region: z.string(),
	account_level: z.number(),
	name: z.string(),
	tag: z.string(),
	card: z.object({
		small: z.string(),
		large: z.string(),
		wide: z.string(),
		id: z.string(),
	}),
	last_update: z.string(),
	last_update_raw: z.number(),
});

const matchPlayerSchema = z.looseObject({
	puuid: z.string(),
	name: z.string().optional(),
	tag: z.string().optional(),
	team: z.string(),
	character: z.string().nullable().optional(),
	currenttier: z.number().optional().default(0),
	currenttier_patched: z.string().optional().default('Unranked'),
	behavior: z
		.looseObject({
			afk_rounds: z.number().optional(),
			rounds_in_spawn: z.number().optional(),
			friendly_fire: z
				.looseObject({
					outgoing: z.number().optional(),
				})
				.optional(),
		})
		.optional(),
	ability_casts: z
		.looseObject({
			x_cast: z.number().nullable().optional(),
			e_cast: z.number().nullable().optional(),
			q_cast: z.number().nullable().optional(),
			c_cast: z.number().nullable().optional(),
		})
		.nullable()
		.optional(),
	stats: z.looseObject({
		score: z.number(),
		kills: z.number(),
		deaths: z.number(),
		assists: z.number(),
		bodyshots: z.number(),
		headshots: z.number(),
		legshots: z.number(),
	}),
	economy: z
		.looseObject({
			spent: z.looseObject({ overall: z.number().optional() }).optional(),
			loadout_value: z
				.looseObject({ average: z.number().optional() })
				.optional(),
		})
		.optional(),
	damage_made: z.number().optional().default(0),
	damage_received: z.number().optional().default(0),
});

const matchKillSchema = z.looseObject({
	kill_time_in_round: z.number(),
	round: z.number(),
	killer_puuid: z.string(),
	victim_puuid: z.string(),
});

export const valorantMatchSchema = z.looseObject({
	is_available: z.boolean(),
	metadata: z
		.looseObject({
			map: z.string(),
			game_length: z.number(),
			game_start_patched: z.string(),
			rounds_played: z.number(),
			mode: z.string(),
			mode_id: z.string(),
			matchid: z.string(),
		})
		.nullable(),
	players: z
		.looseObject({
			all_players: z.array(matchPlayerSchema),
		})
		.nullable(),
	teams: z
		.looseObject({
			red: z.looseObject({ has_won: z.boolean().nullable() }),
			blue: z.looseObject({ has_won: z.boolean().nullable() }),
		})
		.nullable(),
	rounds: z.array(z.unknown()).optional().default([]),
	kills: z.array(matchKillSchema).optional().default([]),
});

export const valorantMatchesSchema = z.array(z.unknown()).transform(items =>
	items.flatMap(item => {
		const parsed = valorantMatchSchema.safeParse(item);
		return parsed.success ? [parsed.data] : [];
	}),
);
