import { useEffect, useRef, useState } from 'preact/hooks';
import loadingLogo from '../assets/images/lines/thecorezi_center.png';
import { supabase } from '../lib/supabase';
import type { Zoid } from '../types/zoid';
import ZoidCard from './ZoidCard';

const INITIAL_COUNT = 3;
const PAGE_SIZE = 10;

export default function ZoidCardList() {
	const [activated, setActivated] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const [zoids, setZoids] = useState<Zoid[]>([]);
	const offsetRef = useRef(0);
	const sentinelRef = useRef<HTMLDivElement>(null);

	async function loadMore(count = PAGE_SIZE) {
		if (loading || !hasMore) return;
		setLoading(true);

		const from = offsetRef.current;
		const to = from + count - 1;

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
		if (newZoids.length < count) {
			setHasMore(false);
		}

		setLoading(false);
	}

	useEffect(() => {
		loadMore(INITIAL_COUNT);
	}, []);

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
			{!loading && zoids.length === 0 && (
				<p class="empty">No hay lanzamientos registrados aún.</p>
			)}
			{!activated && hasMore && zoids.length > 0 && (
				<button class="load-more-btn" onClick={handleVerMas}>Ver más</button>
			)}
			{activated && hasMore && (
				<div ref={sentinelRef} aria-hidden="true" style="height: 1px" />
			)}
			{loading && (
				<div class="load-indicator">
					<img src={loadingLogo.src} alt="Cargando..." />
					<span class="load-indicator-text">CARGANDO...</span>
				</div>
			)}
		</>
	);
}
