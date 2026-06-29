import { useEffect, useRef, useState } from 'preact/hooks';
import { supabase } from '../lib/supabase';
import type { Zoid } from '../types/zoid';
import ZoidCard from './ZoidCard';

const INITIAL_COUNT = 3;
const PAGE_SIZE = 10;

interface Props {
	initialZoids: Zoid[];
}

export default function ZoidCardList({ initialZoids }: Props) {
	const [activated, setActivated] = useState(false);
	const [hasMore, setHasMore] = useState(initialZoids.length >= INITIAL_COUNT);
	const [loading, setLoading] = useState(false);
	const [zoids, setZoids] = useState<Zoid[]>(initialZoids);
	const offsetRef = useRef(INITIAL_COUNT);
	const sentinelRef = useRef<HTMLDivElement>(null);

	async function loadMore() {
		if (loading || !hasMore) return;
		setLoading(true);

		const from = offsetRef.current;
		const to = from + PAGE_SIZE - 1;

		const { data } = await supabase
			.from('Zoids Releases')
			.select('*')
			.order('launch_date', { ascending: true, nullsFirst: false })
			.range(from, to);

		const newZoids = (data ?? []) as Zoid[];
		if (newZoids.length > 0) {
			setZoids((prev) => [...prev, ...newZoids]);
			offsetRef.current += newZoids.length;
		}
		if (newZoids.length < PAGE_SIZE) {
			setHasMore(false);
		}

		setLoading(false);
	}

	function handleVerMas() {
		setActivated(true);
		loadMore();
	}

	useEffect(() => {
		if (!activated) return;
		const sentinel = sentinelRef.current;
		if (!sentinel || !hasMore) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) loadMore();
			},
			{ rootMargin: '200px' },
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [activated, hasMore, loading]);

	return (
		<>
			<div class="grid">
				{zoids.map((zoid, i) => (
					<div
						key={zoid.id}
						class="card-entrance card-entrance--animate"
						style={`animation-delay: ${i < INITIAL_COUNT ? i * 200 : 0}ms`}
					>
						<ZoidCard zoid={zoid} eager={i < INITIAL_COUNT} />
					</div>
				))}
			</div>
			{!activated && hasMore && (
				<button class="load-more-btn" onClick={handleVerMas}>Ver más</button>
			)}
			{activated && hasMore && (
				<div ref={sentinelRef} aria-hidden="true" style="height: 1px" />
			)}
			{loading && (
				<p class="load-status">Cargando...</p>
			)}
		</>
	);
}
