'use client';

import { Stack } from '@/shared/components/layout/stack';
import { Button } from '@/shared/components/ui/button';
import type { PublicRoastView } from '../lib/public-roast';

import { RiotIdField } from './riot-id-field';
import { RoastCta } from './roast-cta';
import { RoastPending } from './roast-pending';
import { RoastResult } from './roast-result';
import { useRiotForm } from '../hooks/use-riot-form'

type RiotFormProps = {
	initialRiotId?: string;
	initialView?: PublicRoastView | null;
};

function RiotForm({ initialRiotId = '', initialView = null }: RiotFormProps) {
	const {
		riotId,
		setRiotId,
		roast,
		streaming,
		streamError,
		retryRoast,
		wrappedAction,
		isPending,
		view,
		state
	} = useRiotForm(initialRiotId, initialView);

	return (
		<form action={wrappedAction} aria-busy={isPending || streaming}>
			<Stack gap='md' align='center' className='w-full'>
				<RiotIdField
					disabled={isPending || streaming}
					value={riotId}
					onValueChange={setRiotId}
					error={state.error}
				/>
				{isPending || (streaming && !roast) ? <RoastPending /> : null}
				{!isPending && view && (roast || streamError) ? (
					<RoastResult view={view} roast={roast} />
				) : null}
				{(state.error || streamError) && !isPending ? (
					<p
						id='riot-id-error'
						aria-live='polite'
						className='text-destructive text-sm'
					>
						{streamError ?? state.error}
					</p>
				) : null}
				{streamError && view ? (
					<Button type='button' variant='outline' onClick={retryRoast}>
						Try roast again
					</Button>
				) : null}
				<RoastCta isPending={isPending || streaming} />
			</Stack>
		</form>
	);
}

export { RiotForm };
