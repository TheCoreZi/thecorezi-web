import { useEffect, useRef, useState } from 'preact/hooks';
import loadingLogo from '../assets/images/lines/thecorezi_center.png';
import { trackPath } from '../lib/goatcounter';
import { supabase } from '../lib/supabase';
import type { Zoid } from '../types/zoid';
import ZoidCard from './ZoidCard';

type SortKey = 'brand_line' | 'launch_asc' | 'launch_desc' | 'name';

const PAGE_SIZE = 10;

function applySort(query: ReturnType<typeof supabase.from>, sort: SortKey) {
	switch (sort) {
		case 'brand_line':
			return query.order('brand').order('line').order('launch_date', { ascending: true, nullsFirst: false });
		case 'launch_asc':
			return query.order('launch_date', { ascending: true, nullsFirst: false });
		case 'launch_desc':
			return query.order('launch_date', { ascending: false, nullsFirst: true });
		case 'name':
			return query.order('name', { ascending: true });
	}
}

function getHashId() {
	return typeof window !== 'undefined' ? window.location.hash.slice(1) || null : null;
}

export default function ZoidCardListFull() {
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const [selectedZoid, setSelectedZoid] = useState<Zoid | null>(null);
	const [sort, setSort] = useState<SortKey>('launch_asc');
	const [zoids, setZoids] = useState<Zoid[]>([]);
	const detailRef = useRef<HTMLDivElement>(null);
	const loadingRef = useRef(false);
	const offsetRef = useRef(0);
	const sentinelRef = useRef<HTMLDivElement>(null);

	async function loadMore() {
		if (loadingRef.current || !hasMore) return;
		loadingRef.current = true;
		setLoading(true);

		const from = offsetRef.current;
		const to = from + PAGE_SIZE - 1;

		let query = supabase.from('Zoids Releases').select('*');
		query = applySort(query, sort);
		query = query.range(from, to);

		const { data } = await query;
		const newZoids = (data ?? []) as Zoid[];

		if (newZoids.length > 0) {
			setZoids((prev) => [...prev, ...newZoids]);
			offsetRef.current += newZoids.length;
		}

		if (newZoids.length < PAGE_SIZE) {
			setHasMore(false);
		}

		loadingRef.current = false;
		setLoading(false);
	}

	useEffect(() => {
		const hashId = getHashId();
		if (hashId) {
			trackPath(`/lanzamientos/#${hashId}`);
			supabase
				.from('Zoids Releases')
				.select('*')
				.eq('id', hashId)
				.single()
				.then(({ data }) => {
					if (data) setSelectedZoid(data as Zoid);
				});
		}
		loadMore();
	}, []);

	useEffect(() => {
		if (!selectedZoid) return;
		requestAnimationFrame(() => {
			detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
	}, [selectedZoid]);

	function selectZoid(zoid: Zoid) {
		setSelectedZoid(zoid);
		history.pushState(null, '', `#${zoid.id}`);
		trackPath(`/lanzamientos/#${zoid.id}`);
	}

	function closeDetail() {
		setSelectedZoid(null);
		history.pushState(null, '', window.location.pathname);
	}

	function handleSortChange(e: Event) {
		const newSort = (e.target as HTMLSelectElement).value as SortKey;
		setSort(newSort);
		setZoids([]);
		setHasMore(true);
		offsetRef.current = 0;
	}

	useEffect(() => {
		if (zoids.length === 0 && hasMore && !loading) {
			loadMore();
		}
	}, [sort]);

	useEffect(() => {
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
	}, [hasMore, loading]);

	return (
		<>
			{selectedZoid && (
				<div class="zoid-detail-panel" ref={detailRef}>
					<ZoidCard
						defaultOpen
						eager
						onToggle={(isOpen) => { if (!isOpen) closeDetail(); }}
						zoid={selectedZoid}
					/>
				</div>
			)}
			<div class="sort-controls">
				<label for="sort-select">Ordenar por</label>
				<select id="sort-select" value={sort} onChange={handleSortChange}>
					<option value="launch_asc">Lanzamiento (más próximos primero)</option>
					<option value="launch_desc">Lanzamiento (más lejanos primero)</option>
					<option value="brand_line">Marca y Línea</option>
					<option value="name">Nombre (A-Z)</option>
				</select>
			</div>
			<div class="grid">
				{zoids.filter((z) => z.id !== selectedZoid?.id).map((zoid, i) => (
					<div
						key={zoid.id}
						class="card-entrance card-entrance--animate"
						style={`animation-delay: ${i < PAGE_SIZE ? i * 100 : 0}ms`}
					>
						<ZoidCard zoid={zoid} eager={i < 3} onSelect={() => selectZoid(zoid)} />
					</div>
				))}
			</div>
			{!loading && zoids.length === 0 && (
				<p class="empty">No hay lanzamientos registrados aún.</p>
			)}
			{hasMore && <div ref={sentinelRef} aria-hidden="true" style="height: 1px" />}
			{loading && (
				<div class="load-indicator">
					<img src={loadingLogo.src} alt="Cargando..." />
					<span class="load-indicator-text">CARGANDO...</span>
				</div>
			)}
		</>
	);
}
