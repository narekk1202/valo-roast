import { Button } from '@/shared/components/ui/button';
import { landingCopy } from '@/shared/content/landing';
import { Loader2 } from 'lucide-react';

type RoastCtaProps = {
	label?: string;
	isPending?: boolean;
};

function RoastCta({ label = landingCopy.cta, isPending }: RoastCtaProps) {
	return (
		<Button type='submit' size='cta' disabled={isPending}>
			{isPending ? <Loader2 className='animate-spin' /> : label}
		</Button>
	);
}

export { RoastCta };
