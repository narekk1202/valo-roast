import type { ApiResult } from '@/shared/api/unwrap';

const MIN_ROAST_LENGTH = 20;

export function sanitizeRoast(text: string): ApiResult<string> {
	const cleaned = text
		.replace(/```[\s\S]*?```/g, '')
		.replace(/\*\*(.*?)\*\*/g, '$1')
		.replace(/`([^`]+)`/g, '$1')
		.replace(/^#{1,6}\s+/gm, '')
		.trim();

	if (cleaned.length < MIN_ROAST_LENGTH) {
		return { ok: false, error: 'Roast came back empty' };
	}

	return { ok: true, data: cleaned };
}
