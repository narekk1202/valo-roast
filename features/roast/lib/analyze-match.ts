import { PlayerMatchAnalysis, ValorantMatch } from '../types';

function getOpeningKills(match: ValorantMatch, puuid: string) {
	let firstKills = 0;
	let firstDeaths = 0;

	for (let round = 1; round <= match.metadata.rounds_played; round++) {
		const firstKill = match.kills.find(kill => kill.round === round);

		if (!firstKill) {
			continue;
		}

		if (firstKill.killer_puuid === puuid) {
			firstKills++;
		}

		if (firstKill.victim_puuid === puuid) {
			firstDeaths++;
		}
	}

	return {
		firstKills,
		firstDeaths,
	};
}

export function analyzeMatch(
	match: ValorantMatch,
	puuid: string,
): PlayerMatchAnalysis {
	const player = match.players.all_players.find(
		player => player.puuid === puuid,
	);

	const { firstKills, firstDeaths } = getOpeningKills(match, puuid);

	if (!player) {
		throw new Error('Player not found in match');
	}

	const team = player.team.toLowerCase() as 'red' | 'blue';
	const result = match.teams[team].has_won ? 'win' : 'loss';

	const { kills, deaths, assists, score, headshots, bodyshots, legshots } =
		player.stats;

	const rounds = match.metadata.rounds_played;

	const totalShots = headshots + bodyshots + legshots;

	const headshotRate = totalShots === 0 ? 0 : headshots / totalShots;

	const kd = deaths === 0 ? kills : kills / deaths;

	const kda = deaths === 0 ? kills + assists : (kills + assists) / deaths;

	const scorePerRound = rounds === 0 ? 0 : score / rounds;

	const abilityCasts =
		player.ability_casts.x_cast +
		player.ability_casts.e_cast +
		player.ability_casts.q_cast +
		player.ability_casts.c_cast;

	return {
		matchId: match.metadata.matchid,
		map: match.metadata.map,
		mode: match.metadata.mode,
		date: match.metadata.game_start_patched,
		duration: match.metadata.game_length,
		rounds,

		result,

		agent: player.character,

		kills,
		deaths,
		assists,

		kd,
		kda,

		score,
		scorePerRound,

		headshots,
		bodyshots,
		legshots,
		headshotRate,

		damageMade: player.damage_made,
		damageReceived: player.damage_received,

		firstKills,
		firstDeaths,

		afkRounds: player.behavior.afk_rounds,
		roundsInSpawn: player.behavior.rounds_in_spawn,

		abilityCasts,

		spent: player.economy.spent.overall,
		averageLoadoutValue: player.economy.loadout_value.average,
	};
}
