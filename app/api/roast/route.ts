import { groq } from '@ai-sdk/groq';
import { createTextStreamResponse, streamText, toTextStream } from 'ai';
import { clientIp } from '@/shared/lib/client-ip';
import { GROQ_TIMEOUT_MS } from '@/shared/lib/limits';
import { logEvent } from '@/shared/lib/log';
import { getPlayerData, playerDataCache } from '@/features/roast/lib/get-player-data';
import { roastLimiter, shareCache } from '@/features/roast/lib/limiters';
import { toPublicRoast } from '@/features/roast/lib/public-roast';
import { buildRoastPrompt } from '@/features/roast/lib/roast-prompt';
import { sanitizeRoast } from '@/features/roast/lib/sanitize-roast';
import { riotIdKey, schema, splitRiotId } from '@/features/roast/schemas';

export const maxDuration = 60;

export async function POST(request: Request) {
	let riotId = '';

	try {
		const body = (await request.json()) as { riotId?: unknown };
		riotId = typeof body.riotId === 'string' ? body.riotId : '';
	} catch {
		return Response.json({ error: 'Invalid request' }, { status: 400 });
	}

	const validated = schema.safeParse(riotId);
	if (!validated.success) {
		return Response.json(
			{ error: 'Invalid Riot ID format (expected Name#TAG)' },
			{ status: 400 },
		);
	}

	const { name, tag } = splitRiotId(validated.data);
	const key = riotIdKey(name, tag);
	const cached = shareCache.get(key);

	if (cached?.roast) {
		return new Response(cached.roast, {
			headers: { 'Content-Type': 'text/plain; charset=utf-8' },
		});
	}

	let player = playerDataCache.get(key);

	if (!player) {
		const loaded = await getPlayerData(name, tag);
		if (!loaded.ok) {
			return Response.json({ error: loaded.error }, { status: 404 });
		}
		player = loaded.data;
	}

	const playerData = player;

	const limited = roastLimiter.consume(clientIp(request.headers));
	if (!limited.ok) {
		return Response.json(
			{ error: 'Too many roasts. Please wait a moment.' },
			{ status: 429 },
		);
	}

	const { system, prompt } = buildRoastPrompt(playerData.analysis);
	const started = Date.now();

	const result = streamText({
		model: groq('openai/gpt-oss-20b'),
		system,
		prompt,
		temperature: 0.8,
		maxOutputTokens: 1024,
		timeout: GROQ_TIMEOUT_MS,
		providerOptions: {
			groq: { reasoningEffort: 'low' },
		},
		onFinish({ text }) {
			const sanitized = sanitizeRoast(text);
			logEvent('groq.roast', {
				ok: sanitized.ok,
				stream: true,
				durationMs: Date.now() - started,
			});
			if (sanitized.ok) {
				shareCache.set(
					key,
					toPublicRoast(
						playerData.account,
						playerData.analysis,
						sanitized.data,
					),
				);
			}
		},
	});

	return createTextStreamResponse({
		stream: toTextStream({ stream: result.stream }),
	});
}
