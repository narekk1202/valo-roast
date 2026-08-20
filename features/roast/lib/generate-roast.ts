import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import type { ApiResult } from '@/shared/api/unwrap';
import { GROQ_TIMEOUT_MS } from '@/shared/lib/limits';
import { logEvent } from '@/shared/lib/log';
import type { PlayerAnalysis } from '../types';
import { buildRoastPrompt } from './roast-prompt';
import { sanitizeRoast } from './sanitize-roast';

export type RoastGenerator = (input: {
	system: string;
	prompt: string;
}) => Promise<string>;

async function generateWithGroq({
	system,
	prompt,
}: {
	system: string;
	prompt: string;
}): Promise<string> {
	const { text } = await generateText({
		model: groq('openai/gpt-oss-20b'),
		system,
		prompt,
		temperature: 0.8,
		maxOutputTokens: 1024,
		timeout: GROQ_TIMEOUT_MS,
		providerOptions: {
			groq: { reasoningEffort: 'low' },
		},
	});

	return text;
}

export async function generateRoast(
	analysis: PlayerAnalysis,
	generate: RoastGenerator = generateWithGroq,
): Promise<ApiResult<string>> {
	const { system, prompt } = buildRoastPrompt(analysis);
	const started = Date.now();

	try {
		const roast = await generate({ system, prompt });
		const sanitized = sanitizeRoast(roast);

		logEvent('groq.roast', {
			ok: sanitized.ok,
			durationMs: Date.now() - started,
		});

		return sanitized;
	} catch (error) {
		const timedOut =
			error instanceof Error &&
			(error.name === 'AbortError' || error.name === 'TimeoutError');

		logEvent('groq.roast', {
			ok: false,
			timedOut,
			durationMs: Date.now() - started,
		});

		return {
			ok: false,
			error: timedOut ? 'Request timed out' : 'Failed to generate roast',
		};
	}
}
