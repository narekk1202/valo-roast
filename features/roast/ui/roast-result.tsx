import { HudFrame } from '@/shared/components/layout/hud-frame';
import { Stack } from '@/shared/components/layout/stack';
import { Text } from '@/shared/components/typography/text';
import { toRoastFacts } from '../lib/roast-prompt';
import type { PlayerAnalysis, RiotAccountData } from '../types';
import Image from 'next/image'

type RoastResultProps = {
	account: RiotAccountData;
	analysis: PlayerAnalysis;
	roast: string | null;
};

function Receipt({ label, value }: { label: string; value: string }) {
	return (
		<div className='flex flex-col gap-1'>
			<dt className='font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase'>
				{label}
			</dt>
			<dd className='font-heading text-xl tracking-[0.08em] text-foreground uppercase'>
				{value}
			</dd>
		</div>
	);
}

function RoastResult({ account, analysis, roast }: RoastResultProps) {
	const facts = toRoastFacts(analysis);
	const cardSrc = account.card.small;

	return (
		<HudFrame className='w-full'>
			<Stack
				gap='md'
				className='border border-border bg-background/70 px-4 py-4'
			>
				<Text variant='label'>Verdict</Text>
				<div className='flex items-center gap-3'>
					{cardSrc ? (
						<Image
							src={cardSrc}
							alt={`${account.name} ${account.tag} card`}
							width={48}
							height={48}
							className='size-12 shrink-0 object-cover'
						/>
					) : null}
					<div className='min-w-0'>
						<p className='font-heading text-2xl tracking-[0.12em] text-foreground uppercase'>
							{facts.riotId}
						</p>
						<p className='font-mono text-xs tracking-wide text-muted-foreground uppercase'>
							{facts.rank} · LVL {facts.level}
						</p>
					</div>
				</div>
				{roast ? (
					<p
						aria-live='polite'
						className='text-pretty border-l-2 border-primary pl-3 text-sm leading-relaxed whitespace-pre-wrap'
					>
						{roast}
					</p>
				) : null}
				<dl className='grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3'>
					<Receipt label='Record' value={facts.record} />
					<Receipt label='Win rate' value={facts.winRate} />
					<Receipt label='K/D' value={facts.kd} />
					<Receipt label='ACS' value={facts.acs} />
					<Receipt label='HS%' value={facts.headshotRate} />
					<Receipt label='Ego' value={String(facts.scores.ego)} />
				</dl>
				{facts.mainAgent || facts.worstMap ? (
					<p className='font-mono text-[0.7rem] tracking-wide text-muted-foreground uppercase'>
						{facts.mainAgent ? `Main ${facts.mainAgent}` : null}
						{facts.mainAgent && facts.worstMap ? ' · ' : null}
						{facts.worstMap ? `Cursed ${facts.worstMap}` : null}
					</p>
				) : null}
			</Stack>
		</HudFrame>
	);
}

export { RoastResult };
