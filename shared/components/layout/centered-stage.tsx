import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';

type CenteredStageProps = ComponentProps<'main'>;

function CenteredStage({ className, ...props }: CenteredStageProps) {
	return (
		<main
			data-slot='centered-stage'
			className={cn(
				'relative mx-auto flex min-h-svh w-full max-w-lg flex-col items-center justify-center px-6 py-16',
				className,
			)}
			{...props}
		/>
	);
}

export { CenteredStage };
