import { MatchKill, MatchTeams, PlayerMatchAnalysis, ValorantMatch } from '../types';

function num(value: number | null | undefined): number {
	return value ?? 0;
}

function isCompetitive(mode: string, modeId: string): boolean {
	return (
		modeId.toLowerCase() === 'competitive' ||
		mode.toLowerCase() === 'competitive'
	);
}

function getOpeningKills(kills: MatchKill[], puuid: string) {
	const firstByRound = new Map<number, MatchKill>();

	for (const kill of kills) {
		const existing = firstByRound.get(kill.round);
		if (
			!existing ||
			kill.kill_time_in_round < existing.kill_time_in_round
		) {
			firstByRound.set(kill.round, kill);
		}
	}

	let firstKills = 0;
	let firstDeaths = 0;

	for (const kill of firstByRound.values()) {
		if (kill.killer_puuid === puuid) {
			firstKills++;
		}
		if (kill.victim_puuid === puuid) {
			firstDeaths++;
		}
	}

	return { firstKills, firstDeaths };
}

function matchResult(
	teamName: string,
	teams: MatchTeams,
): PlayerMatchAnalysis['result'] {
	const team = teamName.toLowerCase();
	if (team !== 'red' && team !== 'blue') {
		return 'draw';
	}

	const redWon = teams.red.has_won === true;
	const blueWon = teams.blue.has_won === true;
	if (redWon === blueWon) {
		return 'draw';
	}

	const won = team === 'red' ? redWon : blueWon;
	return won ? 'win' : 'loss';
}

export function analyzeMatch(
	match: ValorantMatch,
	puuid: string,
): PlayerMatchAnalysis | null {
	if (
		!match.is_available ||
		!match.metadata ||
		!match.players ||
		!match.teams
	) {
		return null;
	}

	if (!isCompetitive(match.metadata.mode, match.metadata.mode_id)) {
		return null;
	}

	const player = match.players.all_players.find(
		matchPlayer => matchPlayer.puuid === puuid,
	);

	if (!player) {
		return null;
	}

	const { firstKills, firstDeaths } = getOpeningKills(match.kills, puuid);
	const result = matchResult(player.team, match.teams);
	const { kills, deaths, assists, score, headshots, bodyshots, legshots } =
		player.stats;
	const rounds = match.metadata.rounds_played;
	const totalShots = headshots + bodyshots + legshots;
	const casts = player.ability_casts;

	return {
		matchId: match.metadata.matchid,
		map: match.metadata.map,
		mode: match.metadata.mode,
		date: match.metadata.game_start_patched,
		duration: match.metadata.game_length,
		rounds,

		result,

		agent: player.character ?? 'Unknown',

		kills,
		deaths,
		assists,

		kd: deaths === 0 ? kills : kills / deaths,
		kda: deaths === 0 ? kills + assists : (kills + assists) / deaths,

		score,
		scorePerRound: rounds === 0 ? 0 : score / rounds,

		headshots,
		bodyshots,
		legshots,
		headshotRate: totalShots === 0 ? 0 : headshots / totalShots,

		damageMade: player.damage_made,
		damageReceived: player.damage_received,

		firstKills,
		firstDeaths,

		afkRounds: num(player.behavior?.afk_rounds),
		roundsInSpawn: num(player.behavior?.rounds_in_spawn),
		friendlyFireOutgoing: num(player.behavior?.friendly_fire?.outgoing),

		abilityCasts:
			num(casts?.x_cast) +
			num(casts?.e_cast) +
			num(casts?.q_cast) +
			num(casts?.c_cast),

		spent: num(player.economy?.spent?.overall),
		averageLoadoutValue: num(player.economy?.loadout_value?.average),

		rank: player.currenttier_patched,
		rankId: player.currenttier,
	};
}
