import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

const stackVariants = cva('flex', {
	variants: {
		direction: {
			vertical: 'flex-col',
			horizontal: 'flex-row',
		},
		gap: {
			xs: 'gap-1',
			sm: 'gap-2',
			md: 'gap-4',
			lg: 'gap-8',
			xl: 'gap-12',
		},
		align: {
			start: 'items-start',
			center: 'items-center',
			stretch: 'items-stretch',
			end: 'items-end',
		},
	},
	defaultVariants: {
		direction: 'vertical',
		gap: 'md',
		align: 'stretch',
	},
})

type StackProps = ComponentProps<'div'> & VariantProps<typeof stackVariants>

function Stack({
	className,
	direction,
	gap,
	align,
	...props
}: StackProps) {
	return (
		<div
			data-slot='stack'
			className={cn(stackVariants({ direction, gap, align }), className)}
			{...props}
		/>
	)
}

export { Stack, stackVariants }
