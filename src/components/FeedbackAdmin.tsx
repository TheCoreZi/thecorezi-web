import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'preact/hooks';
import { sellersByCountry } from '../data/sellers';

const PAGE_SIZE = 25;

interface PendingFeedback {
	comment: string;
	created_at: string;
	email: string;
	id: string;
	model: string;
	name: string;
	seller_id: string;
}

interface Props {
	serviceKey: string;
	supabaseUrl: string;
}

const sellerNames: Record<string, string> = {};
for (const group of sellersByCountry) {
	for (const seller of group.sellers) {
		sellerNames[seller.id] = seller.name;
	}
}

export default function FeedbackAdmin({ serviceKey, supabaseUrl }: Props) {
	const [items, setItems] = useState<PendingFeedback[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const [processing, setProcessing] = useState<Set<string>>(new Set());
	const [total, setTotal] = useState(0);

	const admin = createClient(supabaseUrl, serviceKey);

	useEffect(() => {
		loadPage(0);
	}, []);

	async function loadPage(p: number) {
		setLoading(true);
		const from = p * PAGE_SIZE;
		const to = from + PAGE_SIZE - 1;
		const { count, data } = await admin
			.from('seller_feedback')
			.select('comment, created_at, email, id, model, name, seller_id', { count: 'exact' })
			.eq('approved', false)
			.order('created_at', { ascending: false })
			.range(from, to);
		setItems((data ?? []) as PendingFeedback[]);
		setTotal(count ?? 0);
		setPage(p);
		setLoading(false);
	}

	async function handleApprove(id: string) {
		setProcessing((prev) => new Set(prev).add(id));
		await admin
			.from('seller_feedback')
			.update({ approved: true })
			.eq('id', id);
		setItems((prev) => prev.filter((f) => f.id !== id));
		setTotal((prev) => prev - 1);
		setProcessing((prev) => {
			const next = new Set(prev);
			next.delete(id);
			return next;
		});
	}

	async function handleDelete(id: string) {
		setProcessing((prev) => new Set(prev).add(id));
		await admin
			.from('seller_feedback')
			.delete()
			.eq('id', id);
		setItems((prev) => prev.filter((f) => f.id !== id));
		setTotal((prev) => prev - 1);
		setProcessing((prev) => {
			const next = new Set(prev);
			next.delete(id);
			return next;
		});
	}

	const totalPages = Math.ceil(total / PAGE_SIZE);

	if (loading) {
		return <div class="admin-container"><p class="admin-empty">Cargando...</p></div>;
	}

	return (
		<div class="admin-container">
			<div class="admin-header">
				<h1 class="admin-title">Moderacion de Feedback</h1>
				<span class="admin-count">{total} pendiente{total !== 1 ? 's' : ''}</span>
			</div>
			{items.length === 0 ? (
				<p class="admin-empty">No hay feedback pendiente de revision.</p>
			) : (
				<>
					<div class="admin-table-wrap">
						<table class="admin-table">
							<thead>
								<tr>
									<th>Vendedor</th>
									<th>Nombre</th>
									<th>Correo</th>
									<th>Modelo</th>
									<th>Comentario</th>
									<th>Acciones</th>
								</tr>
							</thead>
							<tbody>
								{items.map((f) => (
									<tr key={f.id}>
										<td class="admin-cell-seller">{sellerNames[f.seller_id] ?? f.seller_id}</td>
										<td>{f.name}</td>
										<td class="admin-cell-email">{f.email}</td>
										<td>{f.model}</td>
										<td class="admin-cell-comment" title={f.comment}>{f.comment}</td>
										<td class="admin-cell-actions">
											<button
												class="admin-btn admin-btn--approve"
												disabled={processing.has(f.id)}
												onClick={() => handleApprove(f.id)}
												type="button"
											>
												Aprobar
											</button>
											<button
												class="admin-btn admin-btn--delete"
												disabled={processing.has(f.id)}
												onClick={() => handleDelete(f.id)}
												type="button"
											>
												Eliminar
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{totalPages > 1 && (
						<div class="admin-pagination">
							<button
								class="admin-btn-page"
								disabled={page === 0}
								onClick={() => loadPage(page - 1)}
								type="button"
							>
								Anterior
							</button>
							<span class="admin-page-info">{page + 1} / {totalPages}</span>
							<button
								class="admin-btn-page"
								disabled={page >= totalPages - 1}
								onClick={() => loadPage(page + 1)}
								type="button"
							>
								Siguiente
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
