import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

const textVariants = cva('text-pretty', {
	variants: {
		variant: {
			display:
				'text-center font-heading text-5xl font-medium tracking-[0.12em] text-foreground uppercase sm:text-6xl md:text-7xl',
			lead: 'text-center text-base text-muted-foreground sm:text-lg',
			mute: 'text-center text-sm tracking-[0.18em] text-muted-foreground',
			kicker:
				'text-center font-heading text-sm font-medium tracking-[0.55em] text-muted-foreground uppercase',
			label:
				'font-heading text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase',
		},
	},
	defaultVariants: {
		variant: 'lead',
	},
})

type TextProps = ComponentProps<'p'> &
	VariantProps<typeof textVariants> & {
		as?: 'p' | 'h1' | 'h2' | 'h3'
	}

function Text({
	as: Comp = 'p',
	className,
	variant,
	...props
}: TextProps) {
	return (
		<Comp
			data-slot='text'
			data-variant={variant}
			className={cn(textVariants({ variant }), className)}
			{...props}
		/>
	)
}

export { Text, textVariants }
