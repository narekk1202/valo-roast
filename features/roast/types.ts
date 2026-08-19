export interface RiotAccountData {
	puuid: string;
	region: string;
	account_level: number;
	name: string;
	tag: string;
	card: {
		small: string;
		large: string;
		wide: string;
		id: string;
	};
	last_update: string;
	last_update_raw: number;
}

export interface RiotApiResponse {
	status: number;
	data?: RiotAccountData;
	errors?: Array<{
		message: string;
		code: number;
		details?: string;
	}>;
}
