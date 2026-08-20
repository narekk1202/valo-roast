'use client';

import { useEffect } from 'react';
import { SiteShell } from '@/shared/components/layout/site-shell';
import { Stack } from '@/shared/components/layout/stack';
import { Text } from '@/shared/components/typography/text';
import { Button } from '@/shared/components/ui/button';
import { logEvent } from '@/shared/lib/log';

export default function ErrorPage({
	error,
	retry,
}: {
	error: Error & { digest?: string };
	retry: () => void;
}) {
	useEffect(() => {
		logEvent('app.error', {
			digest: error.digest,
			message: error.message,
		});
	}, [error]);

	return (
		<SiteShell>
			<Stack gap='md' align='center'>
				<Text as='h2' variant='display'>
					Tilted
				</Text>
				<Text variant='lead'>Something crashed mid-round.</Text>
				<Button type='button' size='cta' onClick={() => retry()}>
					Try again
				</Button>
			</Stack>
		</SiteShell>
	);
}
