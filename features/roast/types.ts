export interface RiotAccountData {
	puuid: string;
	region: string;
	account_level: number;
	name: string;
	tag: string;
	card: {
		small: string;
		large: string;
		wide: string;
		id: string;
	};
	last_update: string;
	last_update_raw: number;
}

export interface RiotApiResponse<T = unknown> {
	status: number;
	data?: T;
	errors?: Array<{
		message: string;
		code: number;
		details?: string;
	}>;
}

export interface ValorantMatch {
	is_available: boolean;
	metadata: MatchMetadata | null;
	players: MatchPlayers | null;
	teams: MatchTeams | null;
	rounds: MatchRound[];
	kills: MatchKill[];
}

export interface MatchMetadata {
	map: string;
	game_version: string;
	game_length: number;
	game_start: number;
	game_start_patched: string;
	rounds_played: number;
	mode: string;
	mode_id: string;
	queue: string;
	season_id: string;
	platform: string;
	matchid: string;
	region: string;
	cluster: string;
}

export interface MatchPlayers {
	all_players: MatchPlayer[];
	red: MatchPlayer[];
	blue: MatchPlayer[];
}

export interface MatchPlayer {
	puuid: string;
	name: string;
	tag: string;
	team: string;
	level: number;
	character: string | null;
	currenttier: number;
	currenttier_patched: string;
	player_card: string;
	player_title: string;
	party_id: string;

	behavior: {
		afk_rounds: number;
		friendly_fire: {
			incoming: number;
			outgoing: number;
		};
		rounds_in_spawn: number;
	};

	ability_casts: {
		x_cast: number | null;
		e_cast: number | null;
		q_cast: number | null;
		c_cast: number | null;
	} | null;

	stats: {
		score: number;
		kills: number;
		deaths: number;
		assists: number;
		bodyshots: number;
		headshots: number;
		legshots: number;
	};

	economy: {
		spent: {
			overall: number;
			average: number;
		};
		loadout_value: {
			overall: number;
			average: number;
		};
	};

	damage_made: number;
	damage_received: number;
}

export interface MatchTeams {
	red: MatchTeam;
	blue: MatchTeam;
}

export interface MatchTeam {
	has_won: boolean | null;
	rounds_won: number | null;
	rounds_lost: number | null;
}

export interface MatchRound {
	winning_team: string;
	end_type: string;
	bomb_planted: boolean;
	bomb_defused: boolean;

	player_stats: MatchRoundPlayerStats[];
}

export interface MatchRoundPlayerStats {
	player_puuid: string;
	player_display_name: string;
	player_team: string;

	ability_casts: {
		x_casts: number;
		e_casts: number;
		q_casts: number;
		c_casts: number;
	};

	damage_events: MatchDamageEvent[];

	damage: number;
	headshots: number;
	bodyshots: number;
	legshots: number;

	kill_events: MatchKillEvent[];

	kills: number;
	score: number;

	economy: {
		loadout_value: number;
		remaining: number;
		spent: number;
		weapon: {
			id?: string;
			name?: string;
		};
		armor: {
			id?: string;
			name?: string;
		};
	};

	was_afk: boolean;
	was_penalized: boolean;
	stayed_in_spawn: boolean;
}

export interface MatchDamageEvent {
	receiver_puuid: string;
	receiver_display_name: string;
	receiver_team: string;

	bodyshots: number;
	headshots: number;
	legshots: number;
	damage: number;
}

export interface MatchKillEvent {
	kill_time_in_round: number;
	kill_time_in_match: number;

	killer_puuid: string;
	killer_display_name: string;
	killer_team: string;

	victim_puuid: string;
	victim_display_name: string;
	victim_team: string;

	damage_weapon_id: string;
	damage_weapon_name?: string;

	secondary_fire_mode: boolean;

	assistants: MatchAssistant[];
}

export interface MatchAssistant {
	assistant_puuid: string;
	assistant_display_name: string;
	assistant_team: string;
}

export interface MatchKill {
	kill_time_in_round: number;
	kill_time_in_match: number;
	round: number;

	killer_puuid: string;
	killer_display_name: string;
	killer_team: string;

	victim_puuid: string;
	victim_display_name: string;
	victim_team: string;

	damage_weapon_id: string;
	damage_weapon_name?: string;

	secondary_fire_mode: boolean;

	assistants: MatchAssistant[];
}

export interface PlayerMatchAnalysis {
	matchId: string;
	map: string;
	mode: string;
	date: string;
	duration: number;
	rounds: number;

	result: 'win' | 'loss' | 'draw';

	agent: string;

	kills: number;
	deaths: number;
	assists: number;

	kd: number;
	kda: number;

	score: number;
	scorePerRound: number;

	headshots: number;
	bodyshots: number;
	legshots: number;
	headshotRate: number;

	damageMade: number;
	damageReceived: number;

	firstKills: number;
	firstDeaths: number;

	afkRounds: number;
	roundsInSpawn: number;
	friendlyFireOutgoing: number;

	abilityCasts: number;

	spent: number;
	averageLoadoutValue: number;

	rank: string;
	rankId: number;
}

export interface PlayerAnalysis {
	player: {
		puuid: string;
		name: string;
		tag: string;
		level: number;
		rank: string;
		rankId: number;
	};

	matches: {
		total: number;
		wins: number;
		losses: number;
		draws: number;
		winRate: number;
	};

	performance: {
		kills: number;
		deaths: number;
		assists: number;

		kd: number;
		kda: number;

		averageKills: number;
		averageDeaths: number;
		averageAssists: number;

		averageScore: number;
		averageScorePerRound: number;

		headshotRate: number;

		averageDamageMade: number;
		averageDamageReceived: number;
	};

	opening: {
		firstKills: number;
		firstDeaths: number;
		openingWinRate: number;
	};

	behavior: {
		afkRounds: number;
		roundsInSpawn: number;
		friendlyFireDamage: number;
	};

	abilities: {
		totalCasts: number;
		averageCastsPerRound: number;
	};

	economy: {
		totalSpent: number;
		averageSpentPerRound: number;
		averageLoadoutValue: number;
	};

	agents: AgentAnalysis[];
	maps: MapAnalysis[];

	scores: PlayerScores;
}

export interface AgentAnalysis {
	name: string;
	games: number;
	wins: number;
	losses: number;
	winRate: number;
	kd: number;
	pickRate: number;
}

export interface MapAnalysis {
	name: string;
	games: number;
	wins: number;
	losses: number;
	winRate: number;
	kd: number;
}

export interface PlayerScores {
	overall: number;
	aim: number;
	gameSense: number;
	teamplay: number;
	survival: number;
	consistency: number;
	ego: number;
}
