import { useActionState, useEffect, useRef, useState } from 'react';
import { getPlayerStats } from '../actions';
import { PublicRoastView } from '../lib/public-roast';
import { sanitizeRoast } from '../lib/sanitize-roast';
import type { RiotId } from '../schemas';

export const useRiotForm = (
	initialRiotId: string,
	initialView: PublicRoastView | null,
) => {
	const [state, formAction, isPending] = useActionState(getPlayerStats, {
		error: null,
		riotId: (initialRiotId || null) as RiotId | null,
		view: initialView,
	});
	const [streamed, setStreamed] = useState<string | null>(
		initialView?.roast ?? null,
	);
	const [streaming, setStreaming] = useState(false);
	const [streamError, setStreamError] = useState<string | null>(null);
	const [attempt, setAttempt] = useState(0);
	const streamKey = useRef<string | null>(
		initialView?.roast ? initialView.riotId : null,
	);

	const view = state.view;
	const roast = streamed ?? view?.roast ?? null;

	const [riotId, setRiotId] = useState(initialRiotId);

	const wrappedAction = (formData: FormData) => {
		streamKey.current = '__pending';
		setStreamed(null);
		setStreamError(null);
		setStreaming(false);
		return formAction(formData);
	};

	useEffect(() => {
		if (isPending) {
			streamKey.current = '__pending';
			return;
		}

		if (streamKey.current === '__pending') {
			streamKey.current = null;
		}

		if (!state.riotId || !view || view.roast) {
			return;
		}

		if (streamKey.current === state.riotId) {
			return;
		}

		streamKey.current = state.riotId;
		let cancelled = false;
		let finished = false;
		setStreaming(true);
		setStreamError(null);

		void (async () => {
			try {
				const response = await fetch('/api/roast', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ riotId: state.riotId }),
				});

				if (!response.ok) {
					const body = (await response.json().catch(() => null)) as {
						error?: string;
					} | null;
					if (!cancelled) {
						setStreamError(body?.error ?? 'Failed to generate roast');
						setStreaming(false);
					}
					return;
				}

				const reader = response.body?.getReader();
				if (!reader) {
					if (!cancelled) {
						setStreamError('Failed to generate roast');
						setStreaming(false);
					}
					return;
				}

				const decoder = new TextDecoder();
				let full = '';

				while (!cancelled) {
					const { done, value } = await reader.read();
					if (done) {
						break;
					}
					full += decoder.decode(value, { stream: true });
					if (!cancelled) {
						setStreamed(full);
					}
				}

				if (!cancelled) {
					const sanitized = sanitizeRoast(full);
					if (sanitized.ok) {
						setStreamed(sanitized.data);
					} else {
						setStreamError(sanitized.error);
						setStreamed(null);
					}
					setStreaming(false);
					finished = true;
				}
			} catch {
				if (!cancelled) {
					setStreamError('Failed to generate roast');
					setStreaming(false);
				}
			} finally {
				if (!cancelled) {
					finished = true;
				}
			}
		})();

		return () => {
			cancelled = true;
			if (!finished) {
				streamKey.current = null;
			}
		};
	}, [attempt, isPending, state.riotId, view]);

	function retryRoast() {
		streamKey.current = null;
		setAttempt(current => current + 1);
		setStreamed(null);
		setStreamError(null);
		setStreaming(false);
	}

	return {
		riotId,
		setRiotId,
		roast,
		streaming,
		streamError,
		retryRoast,
		wrappedAction,
		isPending,
		view,
		state,
	};
};
