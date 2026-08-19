import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

const cornerClass =
	'pointer-events-none absolute size-2.5 border-primary'

type HudFrameProps = ComponentProps<'div'>

function HudFrame({ className, children, ...props }: HudFrameProps) {
	return (
		<div
			data-slot='hud-frame'
			className={cn('relative', className)}
			{...props}
		>
			<span
				aria-hidden
				className={cn(cornerClass, '-top-0.5 -left-0.5 border-t-2 border-l-2')}
			/>
			<span
				aria-hidden
				className={cn(cornerClass, '-top-0.5 -right-0.5 border-t-2 border-r-2')}
			/>
			<span
				aria-hidden
				className={cn(cornerClass, '-bottom-0.5 -left-0.5 border-b-2 border-l-2')}
			/>
			<span
				aria-hidden
				className={cn(cornerClass, '-bottom-0.5 -right-0.5 border-b-2 border-r-2')}
			/>
			{children}
		</div>
	)
}

export { HudFrame }
