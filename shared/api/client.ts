import { env } from '@/app/env';

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

export class RiotApiClient {
	private readonly baseUrl: string;
	private readonly apiKey: string;

	constructor(baseUrl: string, apiKey: string) {
		this.baseUrl = baseUrl;
		this.apiKey = apiKey;
	}

	async get<T>(path: string): Promise<JsonGetResult<T>> {
		try {
			const response = await fetch(`${this.baseUrl}${path}`, {
				headers: {
					Authorization: this.apiKey,
				},
				cache: 'no-store',
			});

			try {
				const data = (await response.json()) as T;
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
			console.error('Riot API fetch error:', error);
			return {
				ok: false,
				error: 'Network error or service unavailable',
			};
		}
	}
}

export const riotApiClient = new RiotApiClient(
	env.RIOT_API_URL,
	env.RIOT_API_KEY,
);
