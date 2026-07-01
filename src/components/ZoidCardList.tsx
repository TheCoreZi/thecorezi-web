import { useEffect, useState } from 'preact/hooks';
import loadingLogo from '../assets/images/lines/thecorezi_center.png';
import { supabase } from '../lib/supabase';
import type { Zoid } from '../types/zoid';
import ZoidCard from './ZoidCard';

const PREVIEW_COUNT = 3;

const threeMonthsAgo = new Date();
threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
const CUTOFF = threeMonthsAgo.getTime();

export default function ZoidCardList() {
	const [loading, setLoading] = useState(true);
	const [zoids, setZoids] = useState<Zoid[]>([]);

	useEffect(() => {
		supabase
			.from('Zoids Releases')
			.select('*')
			.or(`launch_date.is.null,launch_date.gt.${CUTOFF}`)
			.order('launch_date', { ascending: true, nullsFirst: false })
			.limit(PREVIEW_COUNT)
			.then(({ data }) => {
				if (data) setZoids(data as Zoid[]);
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div class="load-indicator">
				<img src={loadingLogo.src} alt="Cargando..." />
				<span class="load-indicator-text">CARGANDO...</span>
			</div>
		);
	}

	if (zoids.length === 0) {
		return <p class="empty">No hay lanzamientos registrados aún.</p>;
	}

	return (
		<>
			<div class="grid">
				{zoids.map((zoid, i) => (
					<div
						key={zoid.id}
						class="card-entrance card-entrance--animate"
						style={`animation-delay: ${i * 200}ms`}
					>
						<ZoidCard zoid={zoid} eager />
					</div>
				))}
			</div>
			<a class="load-more-btn" href="/lanzamientos/">Ver todos los lanzamientos →</a>
		</>
	);
}
