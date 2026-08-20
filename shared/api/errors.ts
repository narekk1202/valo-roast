export function httpErrorMessage(
	status: number,
	fallback = 'Request failed',
): string {
	if (status === 429) {
		return 'Rate limit exceeded. Please wait a moment.';
	}
	if (status === 401 || status === 403) {
		return 'Service unavailable';
	}
	if (status === 404) {
		return fallback === 'Request failed' ? 'Not found' : fallback;
	}

	return fallback;
}
