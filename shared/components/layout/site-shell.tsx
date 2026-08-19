import type { ReactNode } from 'react';

import { Atmosphere } from '@/shared/components/layout/atmosphere';
import { CenteredStage } from '@/shared/components/layout/centered-stage';

type SiteShellProps = {
	children: ReactNode;
};

function SiteShell({ children }: SiteShellProps) {
	return (
		<div data-slot='site-shell' className='relative min-h-svh overflow-hidden'>
			<Atmosphere />
			<CenteredStage>{children}</CenteredStage>
		</div>
	);
}

export { SiteShell };
