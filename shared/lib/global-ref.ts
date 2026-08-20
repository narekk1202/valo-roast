export function globalRef<T>(key: string, create: () => T): T {
	const store = globalThis as typeof globalThis & Record<string, T | undefined>;
	const existing = store[key];

	if (existing) return existing

	const created = create();
	store[key] = created;
	return created;
}
