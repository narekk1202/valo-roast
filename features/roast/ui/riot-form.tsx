'use client';

import { Stack } from '@/shared/components/layout/stack';
import { useActionState } from 'react';
import { getPlayerStats } from '../actions';
import { RiotIdField } from './riot-id-field';
import { RoastCta } from './roast-cta';
import { RoastPending } from './roast-pending';
import { RoastResult } from './roast-result';

function RiotForm() {
	const [state, formAction, isPending] = useActionState(getPlayerStats, {
		error: null,
		riotId: null,
		data: null,
		roast: null,
	});

	return (
		<form action={formAction} aria-busy={isPending}>
			<Stack gap='md' align='center' className='w-full'>
				<RiotIdField disabled={isPending} />
				{isPending ? <RoastPending /> : null}
				{!isPending && state.data ? (
					<RoastResult
						account={state.data.account}
						analysis={state.data.analysis}
						roast={state.roast}
					/>
				) : null}
				{state.error && !isPending ? (
					<p aria-live='polite' className='text-destructive text-sm'>
						{state.error}
					</p>
				) : null}
				<RoastCta isPending={isPending} />
			</Stack>
		</form>
	);
}

export { RiotForm };
