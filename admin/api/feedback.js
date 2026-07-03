const { requireAuth } = require('./_lib/auth');
const { supabase } = require('./_lib/supabase');

const PAGE_SIZE = 50;

module.exports = async function handler(req, res) {
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
		.select('approved, comment, created_at, email, email_verified, id, model, name, seller_id', { count: 'exact' })
		.order('approved', { ascending: true })
		.order('email_verified', { ascending: true })
		.order('created_at', { ascending: false })
		.range(from, to);

	res.json({ items: data ?? [], total: count ?? 0 });
};
