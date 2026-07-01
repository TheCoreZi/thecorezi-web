import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { supabase } from '../lib/supabase';
import type { NewsItem } from '../types/news';

const CAROUSEL_SIZE = 5;
const AUTO_PLAY_INTERVAL = 5000;

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	const formatted = date.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
	return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export default function NewsCarousel() {
	const [current, setCurrent] = useState(0);
	const [news, setNews] = useState<NewsItem[]>([]);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const trackRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		supabase
			.from('News')
			.select('id, image_url, link, published_at, summary, title')
			.order('published_at', { ascending: false })
			.limit(CAROUSEL_SIZE)
			.then(({ data }) => {
				if (data) setNews(data as NewsItem[]);
			});
	}, []);

	const goTo = useCallback((index: number) => {
		setCurrent(index);
	}, []);

	const next = useCallback(() => {
		setCurrent((prev) => (prev + 1) % news.length);
	}, [news.length]);

	const prev = useCallback(() => {
		setCurrent((prev) => (prev - 1 + news.length) % news.length);
	}, [news.length]);

	const startAutoPlay = useCallback(() => {
		if (intervalRef.current) clearInterval(intervalRef.current);
		intervalRef.current = setInterval(next, AUTO_PLAY_INTERVAL);
	}, [next]);

	const stopAutoPlay = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	useEffect(() => {
		if (news.length > 1) startAutoPlay();
		return stopAutoPlay;
	}, [news.length, startAutoPlay, stopAutoPlay]);

	if (news.length === 0) {
		return <div class="news-carousel-empty">Cargando noticias...</div>;
	}

	return (
		<>
		<div
			class="news-carousel"
			onMouseEnter={stopAutoPlay}
			onMouseLeave={() => { if (news.length > 1) startAutoPlay(); }}
		>
			<div class="news-carousel-track" ref={trackRef} style={{ transform: `translateX(-${current * 100}%)` }}>
				{news.map((item) => (
					<a class="news-carousel-slide" href={`/noticias/#${item.id}`} key={item.id}>
						<img alt="" class="news-carousel-image" loading="lazy" src={item.image_url} />
						<div class="news-carousel-overlay">
							<div class="news-carousel-content">
								<p class="news-carousel-date">{formatDate(item.published_at)}</p>
								<h3 class="news-carousel-title">{item.title}</h3>
								<p class="news-carousel-summary">{item.summary}</p>
								<span class="news-carousel-read-more">Leer más →</span>
							</div>
						</div>
					</a>
				))}
			</div>

			{news.length > 1 && (
				<>
					<button aria-label="Anterior" class="news-carousel-arrow news-carousel-arrow--prev" onClick={(e) => { e.preventDefault(); prev(); }} type="button">
						&#8249;
					</button>
					<button aria-label="Siguiente" class="news-carousel-arrow news-carousel-arrow--next" onClick={(e) => { e.preventDefault(); next(); }} type="button">
						&#8250;
					</button>
					<div class="news-carousel-dots">
						{news.map((_, i) => (
							<button
								aria-label={`Noticia ${i + 1}`}
								class={`news-carousel-dot${i === current ? ' news-carousel-dot--active' : ''}`}
								key={i}
								onClick={(e) => { e.preventDefault(); goTo(i); }}
								type="button"
							/>
						))}
					</div>
				</>
			)}
		</div>
		<a class="news-carousel-all-btn" href="/noticias/">Ver todas las noticias →</a>
		</>
	);
}
