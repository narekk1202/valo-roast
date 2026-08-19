import type { ComponentProps } from 'react'

type RevealProps = ComponentProps<'div'> & {
	delay?: 0 | 1 | 2 | 3 | 4 | 5
}

function Reveal({ className, delay = 0, ...props }: RevealProps) {
	return (
		<div
			data-slot='reveal'
			data-reveal={delay}
			className={className}
			{...props}
		/>
	)
}

export { Reveal }
