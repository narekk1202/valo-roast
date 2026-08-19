'use client';

import { Stack } from '@/shared/components/layout/stack';
import { useActionState } from 'react';
import { getPlayerStats } from '../actions';
import { analyzeMatch } from '../lib/analyze-match';
import { RiotIdField } from './riot-id-field';
import { RoastCta } from './roast-cta';

function RiotForm() {
	const [state, formAction] = useActionState(getPlayerStats, {
		error: null,
		riotId: null,
		data: null,
	});

	const analysis = state.data?.matches[0]
		? analyzeMatch(state.data?.matches[0], state.data?.account.puuid)
		: null;

	console.log(analysis);

	return (
		<form action={formAction}>
			<Stack gap='md' align='center' className='w-full'>
				<RiotIdField />
				{state.error ? (
					<p aria-live='polite' className='text-destructive text-sm'>
						{state.error}
					</p>
				) : null}
				<RoastCta />
			</Stack>
		</form>
	);
}

export { RiotForm };
