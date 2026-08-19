'use client';

import { Stack } from '@/shared/components/layout/stack';
import { useActionState } from 'react';
import { getPlayerStats } from '../actions';
import { RiotIdField } from './riot-id-field';
import { RoastCta } from './roast-cta';

function RiotForm() {
	const [state, formAction] = useActionState(getPlayerStats, {
		error: null,
		riotId: null,
		data: null,
	});

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
