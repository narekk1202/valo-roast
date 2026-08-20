import type { Metadata } from 'next';
import { RoastLanding } from '@/features/roast';
import { shareCache } from '@/features/roast/lib/limiters';
import { riotIdKey, schema, splitRiotId } from '@/features/roast/schemas';

type RoastSharePageProps = {
	params: Promise<{ name: string; tag: string }>;
};

function decodeParam(value: string): string {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

async function riotIdFromParams(params: Promise<{ name: string; tag: string }>) {
	const { name, tag } = await params;
	return `${decodeParam(name)}#${decodeParam(tag)}`;
}

export async function generateMetadata({
	params,
}: RoastSharePageProps): Promise<Metadata> {
	const riotId = await riotIdFromParams(params);

	return {
		title: `${riotId} got roasted`,
		description: `A ValoRoast of ${riotId}.`,
		openGraph: {
			title: `${riotId} got roasted`,
			description: 'How bad are they at Valorant?',
		},
	};
}

export default async function RoastSharePage({ params }: RoastSharePageProps) {
	const riotId = await riotIdFromParams(params);
	const parsed = schema.safeParse(riotId);
	const parts = parsed.success ? splitRiotId(parsed.data) : null;
	const view = parts
		? (shareCache.get(riotIdKey(parts.name, parts.tag)) ?? null)
		: null;

	return (
		<RoastLanding
			initialRiotId={parsed.success ? parsed.data : riotId}
			initialView={view}
		/>
	);
}
