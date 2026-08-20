import Link from 'next/link';
import { SiteShell } from '@/shared/components/layout/site-shell';
import { Stack } from '@/shared/components/layout/stack';
import { Text } from '@/shared/components/typography/text';
import { buttonVariants } from '@/shared/components/ui/button';

export default function NotFound() {
	return (
		<SiteShell>
			<Stack gap='md' align='center'>
				<Text as='h2' variant='display'>
					Whiffed
				</Text>
				<Text variant='lead'>That page does not exist.</Text>
				<Link href='/' className={buttonVariants({ size: 'cta' })}>
					Back to roast
				</Link>
			</Stack>
		</SiteShell>
	);
}
