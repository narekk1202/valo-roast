import { Stack } from '@/components/layout/stack'
import { Text } from '@/components/typography/text'
import { landingCopy } from '@/content/landing'

type RoastHeroProps = {
	headline?: string
	subhead?: string
}

function RoastHero({
	headline = landingCopy.headline,
	subhead = landingCopy.subhead,
}: RoastHeroProps) {
	return (
		<Stack gap='sm' align='center'>
			<Text as='h2' variant='display'>
				{headline}
			</Text>
			<Text variant='lead'>{subhead}</Text>
		</Stack>
	)
}

export { RoastHero }
