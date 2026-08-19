function Atmosphere() {
	return (
		<div
			aria-hidden
			data-slot='atmosphere'
			className='pointer-events-none absolute inset-0 overflow-hidden'
		>
			<div className='absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,var(--primary),transparent_55%)] opacity-20' />
			<div className='atmosphere-grid absolute inset-0' />
			<div className='atmosphere-scan absolute inset-0' />
			<div className='atmosphere-grain absolute inset-0' />
			<div className='absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent' />
		</div>
	)
}

export { Atmosphere }
