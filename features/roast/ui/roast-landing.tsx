import { BrandMark } from '@/shared/components/brand/brand-mark';
import { Reveal } from '@/shared/components/layout/reveal';
import { SiteShell } from '@/shared/components/layout/site-shell';
import { Stack } from '@/shared/components/layout/stack';
import { Text } from '@/shared/components/typography/text';
import { landingCopy } from '@/shared/content/landing';
import type { PublicRoastView } from '../lib/public-roast';
import { RiotForm } from './riot-form';
import { RoastHero } from './roast-hero';

type RoastLandingProps = {
	initialRiotId?: string;
	initialView?: PublicRoastView | null;
};

function RoastLanding({
	initialRiotId,
	initialView,
}: RoastLandingProps) {
	return (
		<SiteShell>
			<Stack gap='xl' align='center' className='w-full'>
				<Reveal>
					<BrandMark
						prefix={landingCopy.brandPrefix}
						accent={landingCopy.brandAccent}
					/>
				</Reveal>
				<Reveal delay={1}>
					<RoastHero />
				</Reveal>
				<Reveal delay={2} className='w-full'>
					<RiotForm
						initialRiotId={initialRiotId}
						initialView={initialView}
					/>
				</Reveal>
				<Reveal delay={4}>
					<Text variant='mute'>{landingCopy.disclaimer}</Text>
				</Reveal>
			</Stack>
		</SiteShell>
	);
}

export { RoastLanding };
