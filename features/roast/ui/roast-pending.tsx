'use client';

import { HudFrame } from '@/shared/components/layout/hud-frame';
import { Stack } from '@/shared/components/layout/stack';
import { Text } from '@/shared/components/typography/text';
import { cn } from '@/shared/lib/utils';
import { usePendingSteps } from './use-pending-steps';

function padStep(index: number) {
	return String(index + 1).padStart(2, '0');
}

function RoastPending() {
	const { index, comment, steps } = usePendingSteps();

	return (
		<HudFrame className='w-full'>
			<Stack
				gap='md'
				className='border border-border bg-background/70 px-4 py-4'
				role='status'
				aria-live='polite'
				aria-atomic='true'
			>
				<Text variant='label'>Live scan</Text>
				<ol className='flex flex-col gap-2'>
					{steps.map((step, stepIndex) => {
						const status =
							stepIndex < index
								? 'done'
								: stepIndex === index
									? 'live'
									: 'wait';

						return (
							<li
								key={step.label}
								className={cn(
									'flex items-baseline gap-3 font-mono text-xs tracking-wide uppercase',
									status === 'live' && 'text-primary',
									status === 'done' && 'text-muted-foreground',
									status === 'wait' && 'text-muted-foreground/45',
								)}
							>
								<span className='w-6 shrink-0 tabular-nums'>
									{padStep(stepIndex)}
								</span>
								<span className='w-20 shrink-0'>{step.label}</span>
								<span className='min-w-0 flex-1 font-sans text-[0.7rem] tracking-normal normal-case'>
									{status === 'done'
										? 'cleared'
										: status === 'live'
											? 'in progress'
											: 'queued'}
								</span>
								{status === 'live' ? (
									<span
										aria-hidden
										className='size-1.5 shrink-0 bg-primary motion-safe:animate-pulse'
									/>
								) : null}
							</li>
						);
					})}
				</ol>
				<p className='font-mono text-sm text-pretty text-primary'>
					{comment}
				</p>
			</Stack>
		</HudFrame>
	);
}

export { RoastPending };
