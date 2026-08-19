import { cn } from '@/lib/utils'

type BrandMarkProps = {
	prefix?: string
	accent?: string
	className?: string
}

function BrandMark({
	prefix = 'VALO',
	accent = 'ROAST',
	className,
}: BrandMarkProps) {
	return (
		<h1
			data-slot='brand-mark'
			className={cn(
				'text-center font-heading text-2xl font-medium tracking-[0.55em] uppercase sm:text-3xl',
				className
			)}
		>
			<span>{prefix}</span>
			<span className='text-primary'>{accent}</span>
		</h1>
	)
}

export { BrandMark }
