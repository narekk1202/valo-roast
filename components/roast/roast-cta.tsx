import { Button } from '@/components/ui/button'
import { landingCopy } from '@/content/landing'

type RoastCtaProps = {
	label?: string
}

function RoastCta({ label = landingCopy.cta }: RoastCtaProps) {
	return (
		<Button type='button' size='cta'>
			{label}
		</Button>
	)
}

export { RoastCta }
