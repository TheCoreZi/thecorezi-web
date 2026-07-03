import { requireAuth } from './_lib/auth.js';
import { supabase } from './_lib/supabase.js';

const PAGE_SIZE = 25;

export default async function handler(req, res) {
	if (!requireAuth(req)) {
		return res.status(401).json({ error: 'No autorizado' });
	}

	if (req.method === 'POST') {
		const { action, id } = req.body || {};
		if (!id || !['approve', 'delete'].includes(action)) {
			return res.status(400).json({ error: 'Parametros invalidos' });
		}
		if (action === 'approve') {
			await supabase.from('seller_feedback').update({ approved: true }).eq('id', id);
		} else {
			await supabase.from('seller_feedback').delete().eq('id', id);
		}
		return res.json({ ok: true });
	}

	const page = parseInt(req.query.page) || 0;
	const from = page * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	const { count, data } = await supabase
		.from('seller_feedback')
		.select('comment, created_at, email, id, model, name, seller_id', { count: 'exact' })
		.eq('approved', false)
		.order('created_at', { ascending: false })
		.range(from, to);

	res.json({ items: data ?? [], total: count ?? 0 });
}
