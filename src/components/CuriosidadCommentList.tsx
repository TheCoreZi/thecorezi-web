import { useEffect, useState } from 'preact/hooks';
import { fetchComments, type CuriosidadComment } from '../lib/curiosidadComments';

interface Props {
	curiosidadId: string;
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

export default function CuriosidadCommentList({ curiosidadId }: Props) {
	const [comments, setComments] = useState<CuriosidadComment[]>([]);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setLoaded(false);
		fetchComments(curiosidadId).then((data) => {
			setComments(data);
			setLoaded(true);
		});
	}, [curiosidadId]);

	if (!loaded) return null;

	return (
		<div class="comments-section">
			<h4 class="comments-title">Comentarios</h4>
			{comments.length === 0 ? (
				<p class="comments-empty">Aun no hay comentarios. Se el primero en opinar.</p>
			) : (
				<div class="comments-list">
					{comments.map((c, i) => (
						<div class="comment-item" key={i}>
							<div class="comment-item-header">
								<span class="comment-item-author">{c.name}</span>
								<span class="comment-item-date">{formatRelativeDate(c.created_at)}</span>
							</div>
							<p class="comment-item-text">{c.comment}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
