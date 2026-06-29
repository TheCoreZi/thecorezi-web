import { useEffect, useRef, useState } from 'preact/hooks';
import loadingLogo from '../assets/images/lines/thecorezi_center.png';
import { supabase } from '../lib/supabase';
import type { Zoid } from '../types/zoid';
import ZoidCard from './ZoidCard';

type SortKey = 'brand_line' | 'launch_asc' | 'launch_desc';

const INITIAL_COUNT = 3;
const PAGE_SIZE = 10;

const threeMonthsAgo = new Date();
threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
const CUTOFF = threeMonthsAgo.getTime();

function applySort(query: any, sort: SortKey) {
	switch (sort) {
		case 'brand_line':
			return query.order('brand').order('line').order('launch_date', { ascending: true, nullsFirst: false });
		case 'launch_asc':
			return query.order('launch_date', { ascending: true, nullsFirst: false });
		case 'launch_desc':
			return query.order('launch_date', { ascending: false, nullsFirst: true });
	}
}

export default function ZoidCardList() {
	const [activated, setActivated] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const [phase, setPhase] = useState<'old' | 'recent'>('recent');
	const [sort, setSort] = useState<SortKey>('launch_asc');
	const [zoids, setZoids] = useState<Zoid[]>([]);
	const initialRef = useRef(true);
	const offsetRef = useRef(0);
	const sentinelRef = useRef<HTMLDivElement>(null);

	async function loadMore(count = PAGE_SIZE) {
		if (loading || !hasMore) return;
		setLoading(true);

		const from = offsetRef.current;
		const to = from + count - 1;

		let query = supabase.from('Zoids Releases').select('*');
		if (phase === 'recent') {
			query = query.or(`launch_date.is.null,launch_date.gt.${CUTOFF}`);
		} else {
			query = query.lte('launch_date', CUTOFF);
		}
		query = applySort(query, sort);
		query = query.range(from, to);

		const { data } = await query;
		const newZoids = (data ?? []) as Zoid[];

		if (newZoids.length > 0) {
			setZoids((prev) => [...prev, ...newZoids]);
			offsetRef.current += newZoids.length;
		}

		if (newZoids.length < count) {
			if (phase === 'recent') {
				setPhase('old');
				offsetRef.current = 0;
			} else {
				setHasMore(false);
			}
		}

		setLoading(false);
	}

	useEffect(() => {
		loadMore(INITIAL_COUNT);
	}, []);

	useEffect(() => {
		if (phase === 'old') loadMore();
	}, [phase]);

	function handleSortChange(e: Event) {
		const newSort = (e.target as HTMLSelectElement).value as SortKey;
		setSort(newSort);
		setZoids([]);
		setPhase('recent');
		setHasMore(true);
		setActivated(false);
		offsetRef.current = 0;
	}

	useEffect(() => {
		if (initialRef.current) {
			initialRef.current = false;
			return;
		}
		loadMore(INITIAL_COUNT);
	}, [sort]);

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
			<div class="sort-controls">
				<label for="sort-select">Ordenar por</label>
				<select id="sort-select" value={sort} onChange={handleSortChange}>
					<option value="launch_asc">Lanzamiento (más próximos primero)</option>
					<option value="launch_desc">Lanzamiento (más lejanos primero)</option>
					<option value="brand_line">Marca y Línea</option>
				</select>
			</div>
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
