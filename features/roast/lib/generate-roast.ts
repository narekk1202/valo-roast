import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import type { ApiResult } from '@/shared/api/unwrap';
import type { PlayerAnalysis } from '../types';
import { buildRoastPrompt } from './roast-prompt';

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

	try {
		const roast = (await generate({ system, prompt })).trim();

		if (!roast) {
			return { ok: false, error: 'Roast came back empty' };
		}

		return { ok: true, data: roast };
	} catch (error) {
		console.error(
			'generateRoast failed:',
			error instanceof Error ? error.message : error,
		);
		return { ok: false, error: 'Failed to generate roast' };
	}
}
