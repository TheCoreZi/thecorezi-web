import { marked } from 'marked';
import { useEffect, useRef, useState } from 'preact/hooks';
import { trackPath } from '../lib/goatcounter';
import { proxyContentUrls, proxyImageUrl } from '../lib/imageProxy';
import { supabase } from '../lib/supabase';
import type { NewsItem } from '../types/news';
import ImageLightbox from './ImageLightbox';

const PAGE_SIZE = 10;

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	const formatted = date.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
	return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function normalizeLink(link: string): string {
	return link.startsWith('#') ? `/${link}` : link;
}

function renderMarkdown(content: string): string {
	return proxyContentUrls(marked.parse(content, { async: false }) as string);
}

export default function NewsList() {
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const [news, setNews] = useState<NewsItem[]>([]);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const offsetRef = useRef(0);
	const sentinelRef = useRef<HTMLDivElement>(null);

	async function loadMore() {
		if (loading || !hasMore) return;
		setLoading(true);

		const from = offsetRef.current;
		const to = from + PAGE_SIZE - 1;

		const { data } = await supabase
			.from('News')
			.select('*')
			.order('published_at', { ascending: false })
			.range(from, to);

		const items = (data ?? []) as NewsItem[];

		if (items.length > 0) {
			setNews((prev) => [...prev, ...items]);
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
		if (hash) {
			setSelectedId(hash);
			trackPath(`/noticias/#${hash}`);
		}
	}, []);

	function openDetail(id: string) {
		setSelectedId(id);
		window.scrollTo(0, 0);
		history.pushState(null, '', `/noticias/#${id}`);
		trackPath(`/noticias/#${id}`);
	}

	function closeDetail() {
		setSelectedId(null);
		history.pushState(null, '', '/noticias/');
	}

	useEffect(() => {
		function onPopState() {
			const hash = window.location.hash.slice(1);
			setSelectedId(hash || null);
		}
		window.addEventListener('popstate', onPopState);
		return () => window.removeEventListener('popstate', onPopState);
	}, []);

	const selectedNews = selectedId ? news.find((n) => n.id === selectedId) : null;

	if (selectedId && !selectedNews && news.length > 0) {
		return <NewsDetail id={selectedId} onBack={closeDetail} />;
	}

	const contentRef = useRef<HTMLDivElement>(null);

	if (selectedNews) {
		return (
			<div class="news-detail">
				<button class="news-detail-back" onClick={closeDetail} type="button">← Volver a noticias</button>
				<p class="news-detail-date">{formatDate(selectedNews.published_at)}</p>
				<h1 class="news-detail-title">{selectedNews.title}</h1>
				<div class="news-detail-body">
					<img alt="" class="news-detail-image" src={proxyImageUrl(selectedNews.image_url)} />
					<div class="news-detail-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedNews.content) }} ref={contentRef} />
				</div>
				{selectedNews.link && (
					<a class="news-detail-link" href={normalizeLink(selectedNews.link)}>Ver más →</a>
				)}
				<ImageLightbox containerRef={contentRef} />
			</div>
		);
	}

	return (
		<>
			<div class="news-list-grid">
				{news.map((item) => (
					<article class="news-card" key={item.id} onClick={() => openDetail(item.id)}>
						<img alt="" class="news-card-image" loading="lazy" src={proxyImageUrl(item.image_url)} />
						<div class="news-card-body">
							<p class="news-card-date">{formatDate(item.published_at)}</p>
							<h3 class="news-card-title">{item.title}</h3>
							<p class="news-card-summary">{item.summary}</p>
						</div>
					</article>
				))}
			</div>
			{loading && <div class="news-loading">Cargando noticias...</div>}
			{hasMore && <div ref={sentinelRef} style={{ height: '1px' }} />}
		</>
	);
}

function NewsDetail({ id, onBack }: { id: string; onBack: () => void }) {
	const [item, setItem] = useState<NewsItem | null>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		supabase
			.from('News')
			.select('*')
			.eq('id', id)
			.single()
			.then(({ data }) => { if (data) setItem(data as NewsItem); });
	}, [id]);

	if (!item) return <div class="news-loading">Cargando...</div>;

	return (
		<div class="news-detail">
			<button class="news-detail-back" onClick={onBack} type="button">← Volver a noticias</button>
			<p class="news-detail-date">{formatDate(item.published_at)}</p>
			<h1 class="news-detail-title">{item.title}</h1>
			<div class="news-detail-body">
				<img alt="" class="news-detail-image" src={proxyImageUrl(item.image_url)} />
				<div class="news-detail-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(item.content) }} ref={contentRef} />
			</div>
			{item.link && (
				<a class="news-detail-link" href={normalizeLink(item.link)}>Ver más →</a>
			)}
			<ImageLightbox containerRef={contentRef} />
		</div>
	);
}
