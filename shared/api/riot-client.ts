import { HENRIK_TIMEOUT_MS } from '@/shared/lib/limits';
import { logEvent } from '@/shared/lib/log';

export type JsonGetSuccess<T> = {
	ok: true;
	status: number;
	httpOk: boolean;
	data: T;
};

export type JsonGetFailure = {
	ok: false;
	error: string;
};

export type JsonGetResult<T> = JsonGetSuccess<T> | JsonGetFailure;

type RiotFetch = (
	input: string,
	init?: RequestInit,
) => Promise<Response>;

export class RiotApiClient {
	private readonly baseUrl: string;
	private readonly apiKey: string;
	private readonly timeoutMs: number;
	private readonly fetchImpl: RiotFetch;

	constructor(
		baseUrl: string,
		apiKey: string,
		options: { timeoutMs?: number; fetch?: RiotFetch } = {},
	) {
		this.baseUrl = baseUrl;
		this.apiKey = apiKey;
		this.timeoutMs = options.timeoutMs ?? HENRIK_TIMEOUT_MS;
		this.fetchImpl = options.fetch ?? fetch;
	}

	async get<T = unknown>(path: string): Promise<JsonGetResult<T>> {
		const started = Date.now();

		try {
			const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
				headers: {
					Authorization: this.apiKey,
				},
				cache: 'no-store',
				signal: AbortSignal.timeout(this.timeoutMs),
			});

			try {
				const data = (await response.json()) as T;
				logEvent('henrik.fetch', {
					ok: true,
					status: response.status,
					durationMs: Date.now() - started,
				});
				return {
					ok: true,
					status: response.status,
					httpOk: response.ok,
					data,
				};
			} catch {
				return { ok: false, error: 'Invalid response from API' };
			}
		} catch (error) {
			const timedOut =
				error instanceof Error &&
				(error.name === 'AbortError' || error.name === 'TimeoutError');

			logEvent('henrik.fetch', {
				ok: false,
				timedOut,
				durationMs: Date.now() - started,
			});

			if (timedOut) {
				return { ok: false, error: 'Request timed out' };
			}

			return {
				ok: false,
				error: 'Network error or service unavailable',
			};
		}
	}
}
