import { PlayerMatchAnalysis, ValorantMatch } from '../types';

export function analyzeMatch(
	match: ValorantMatch,
	puuid: string,
): PlayerMatchAnalysis {
	const player = match.players.all_players.find(
		player => player.puuid === puuid,
	);

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

		firstKills: 0,
		firstDeaths: 0,

		afkRounds: player.behavior.afk_rounds,
		roundsInSpawn: player.behavior.rounds_in_spawn,

		abilityCasts,

		spent: player.economy.spent.overall,
		averageLoadoutValue: player.economy.loadout_value.average,
	};
}
