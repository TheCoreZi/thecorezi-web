import { marked } from 'marked';
import { useEffect, useRef, useState } from 'preact/hooks';
import { supabase } from '../lib/supabase';
import type { CuriosidadItem } from '../types/curiosidad';

const PAGE_SIZE = 10;

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	const formatted = date.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
	return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function renderMarkdown(content: string): string {
	return marked.parse(content, { async: false }) as string;
}

export default function CuriosidadesList() {
	const [curiosidades, setCuriosidades] = useState<CuriosidadItem[]>([]);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const offsetRef = useRef(0);
	const sentinelRef = useRef<HTMLDivElement>(null);

	async function loadMore() {
		if (loading || !hasMore) return;
		setLoading(true);

		const from = offsetRef.current;
		const to = from + PAGE_SIZE - 1;

		const { data } = await supabase
			.from('Curiosidades')
			.select('*')
			.order('published_at', { ascending: false })
			.range(from, to);

		const items = (data ?? []) as CuriosidadItem[];

		if (items.length > 0) {
			setCuriosidades((prev) => [...prev, ...items]);
			offsetRef.current += items.length;
		}
		if (items.length < PAGE_SIZE) {
			setHasMore(false);
		}
		setLoading(false);
	}

	useEffect(() => {
		loadMore();
	}, []);

	useEffect(() => {
		if (!sentinelRef.current || !hasMore) return;
		const observer = new IntersectionObserver(
			(entries) => { if (entries[0].isIntersecting) loadMore(); },
			{ rootMargin: '200px' },
		);
		observer.observe(sentinelRef.current);
		return () => observer.disconnect();
	}, [hasMore, loading]);

	useEffect(() => {
		const hash = window.location.hash.slice(1);
		if (hash) setSelectedId(hash);
	}, []);

	function openDetail(id: string) {
		setSelectedId(id);
		window.scrollTo(0, 0);
		history.pushState(null, '', `/archivo/curiosidades/#${id}`);
	}

	function closeDetail() {
		setSelectedId(null);
		history.pushState(null, '', '/archivo/curiosidades/');
	}

	useEffect(() => {
		function onPopState() {
			const hash = window.location.hash.slice(1);
			setSelectedId(hash || null);
		}
		window.addEventListener('popstate', onPopState);
		return () => window.removeEventListener('popstate', onPopState);
	}, []);

	const selected = selectedId ? curiosidades.find((c) => c.id === selectedId) : null;

	if (selectedId && !selected && curiosidades.length > 0) {
		return <CuriosidadDetail id={selectedId} onBack={closeDetail} />;
	}

	if (selected) {
		return (
			<div class="news-detail">
				<button class="news-detail-back" onClick={closeDetail} type="button">← Volver a curiosidades</button>
				<p class="news-detail-date">{formatDate(selected.published_at)}</p>
				<h1 class="news-detail-title">{selected.title}</h1>
				<div class="news-detail-body">
					<img alt="" class="news-detail-image" src={selected.image_url} />
					<div class="news-detail-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(selected.content) }} />
				</div>
			</div>
		);
	}

	return (
		<>
			<div class="news-list-grid">
				{curiosidades.map((item) => (
					<article class="news-card" key={item.id} onClick={() => openDetail(item.id)}>
						<img alt="" class="news-card-image" loading="lazy" src={item.image_url} />
						<div class="news-card-body">
							<p class="news-card-date">{formatDate(item.published_at)}</p>
							<h3 class="news-card-title">{item.title}</h3>
							<p class="news-card-summary">{item.summary}</p>
						</div>
					</article>
				))}
			</div>
			{loading && <div class="news-loading">Cargando curiosidades...</div>}
			{hasMore && <div ref={sentinelRef} style={{ height: '1px' }} />}
		</>
	);
}

function CuriosidadDetail({ id, onBack }: { id: string; onBack: () => void }) {
	const [item, setItem] = useState<CuriosidadItem | null>(null);

	useEffect(() => {
		supabase
			.from('Curiosidades')
			.select('*')
			.eq('id', id)
			.single()
			.then(({ data }) => { if (data) setItem(data as CuriosidadItem); });
	}, [id]);

	if (!item) return <div class="news-loading">Cargando...</div>;

	return (
		<div class="news-detail">
			<button class="news-detail-back" onClick={onBack} type="button">← Volver a curiosidades</button>
			<p class="news-detail-date">{formatDate(item.published_at)}</p>
			<h1 class="news-detail-title">{item.title}</h1>
			<div class="news-detail-body">
				<img alt="" class="news-detail-image" src={item.image_url} />
				<div class="news-detail-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(item.content) }} />
			</div>
		</div>
	);
}
