import { BrandMark } from '@/components/brand/brand-mark'
import { Reveal } from '@/components/layout/reveal'
import { SiteShell } from '@/components/layout/site-shell'
import { Stack } from '@/components/layout/stack'
import { RoastCta } from '@/components/roast/roast-cta'
import { RoastHero } from '@/components/roast/roast-hero'
import { RiotIdField } from '@/components/roast/riot-id-field'
import { Text } from '@/components/typography/text'
import { landingCopy } from '@/content/landing'

function RoastLanding() {
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
					<RiotIdField />
				</Reveal>
				<Reveal delay={3}>
					<RoastCta />
				</Reveal>
				<Reveal delay={4}>
					<Text variant='mute'>{landingCopy.disclaimer}</Text>
				</Reveal>
			</Stack>
		</SiteShell>
	)
}

export { RoastLanding }
