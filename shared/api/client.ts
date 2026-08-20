import { env } from '@/app/env';
import { RiotApiClient } from './riot-client';

export type {
	JsonGetFailure,
	JsonGetResult,
	JsonGetSuccess,
} from './riot-client';
export { RiotApiClient } from './riot-client';

export const riotApiClient = new RiotApiClient(
	env.RIOT_API_URL,
	env.RIOT_API_KEY,
);
