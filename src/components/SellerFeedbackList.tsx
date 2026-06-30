import { useEffect, useState } from 'preact/hooks';
import { fetchFeedback, type Feedback } from '../lib/sellerFeedback';

interface Props {
	sellerId: string;
}

function formatRelativeDate(dateStr: string): string {
	const now = Date.now();
	const date = new Date(dateStr).getTime();
	const diffMs = now - date;
	const diffDays = Math.floor(diffMs / 86_400_000);

	if (diffDays < 1) return 'hoy';
	if (diffDays === 1) return 'hace 1 dia';
	if (diffDays < 30) return `hace ${diffDays} dias`;
	const diffMonths = Math.floor(diffDays / 30);
	if (diffMonths === 1) return 'hace 1 mes';
	if (diffMonths < 12) return `hace ${diffMonths} meses`;
	const diffYears = Math.floor(diffDays / 365);
	if (diffYears === 1) return 'hace 1 ano';
	return `hace ${diffYears} anos`;
}

export default function SellerFeedbackList({ sellerId }: Props) {
	const [feedback, setFeedback] = useState<Feedback[]>([]);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setLoaded(false);
		fetchFeedback(sellerId).then((data) => {
			setFeedback(data);
			setLoaded(true);
		});
	}, [sellerId]);

	if (!loaded) return null;

	return (
		<div class="feedback-section">
			<h4 class="feedback-title">Comentarios de la comunidad</h4>
			{feedback.length === 0 ? (
				<p class="feedback-empty">Aun no hay comentarios. Se el primero en opinar.</p>
			) : (
				<div class="feedback-list">
					{feedback.map((f, i) => (
						<div class="feedback-card" key={i}>
							<div class="feedback-card-header">
								<span class="feedback-author">{f.name}</span>
								<span class="feedback-date">{formatRelativeDate(f.created_at)}</span>
							</div>
							<p class="feedback-model">Compro: {f.model}</p>
							<p class="feedback-comment">{f.comment}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
