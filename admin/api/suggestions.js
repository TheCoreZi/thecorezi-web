const { requireAuth } = require('./_lib/auth');
const { supabase } = require('./_lib/supabase');

const PAGE_SIZE = 50;

module.exports = async function handler(req, res) {
	if (!requireAuth(req)) {
		return res.status(401).json({ error: 'No autorizado' });
	}

	if (req.method === 'POST') {
		const { action, id } = req.body || {};
		if (!id || !['delete'].includes(action)) {
			return res.status(400).json({ error: 'Parametros invalidos' });
		}
		await supabase.from('seller_suggestions').delete().eq('id', id);
		return res.json({ ok: true });
	}

	const page = parseInt(req.query.page) || 0;
	const from = page * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	const { count, data } = await supabase
		.from('seller_suggestions')
		.select('cons, country, created_at, description, id, link, name, pros', { count: 'exact' })
		.order('created_at', { ascending: false })
		.range(from, to);

	res.json({ items: data ?? [], total: count ?? 0 });
};
