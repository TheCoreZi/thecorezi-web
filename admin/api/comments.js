const { requireAuth } = require('./_lib/auth');
const { supabase } = require('./_lib/supabase');

const PAGE_SIZE = 25;

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
			await supabase.from('curiosidad_comments').update({ approved: true }).eq('id', id);
		} else {
			await supabase.from('curiosidad_comments').delete().eq('id', id);
		}
		return res.json({ ok: true });
	}

	const page = parseInt(req.query.page) || 0;
	const from = page * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	const { count, data } = await supabase
		.from('curiosidad_comments')
		.select('comment, created_at, curiosidad_id, email, id, name', { count: 'exact' })
		.eq('approved', false)
		.order('created_at', { ascending: false })
		.range(from, to);

	const items = data ?? [];

	const curiosidadIds = [...new Set(items.map((c) => c.curiosidad_id))];
	let titleMap = {};
	if (curiosidadIds.length > 0) {
		const { data: curiosidades } = await supabase
			.from('Curiosidades')
			.select('id, title')
			.in('id', curiosidadIds);
		titleMap = Object.fromEntries((curiosidades ?? []).map((c) => [c.id, c.title]));
	}

	const enriched = items.map((c) => ({
		...c,
		curiosidad_title: titleMap[c.curiosidad_id] ?? c.curiosidad_id,
	}));

	res.json({ items: enriched, total: count ?? 0 });
};
