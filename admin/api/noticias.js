const { requireAuth } = require('./_lib/auth');
const { supabase } = require('./_lib/supabase');

const PAGE_SIZE = 25;

module.exports = async function handler(req, res) {
	if (!requireAuth(req)) {
		return res.status(401).json({ error: 'No autorizado' });
	}

	if (req.method === 'GET') {
		const page = parseInt(req.query.page) || 0;
		const search = req.query.search || '';
		const from = page * PAGE_SIZE;
		const to = from + PAGE_SIZE - 1;

		let query = supabase
			.from('News')
			.select('*', { count: 'exact' })
			.order('published_at', { ascending: false })
			.range(from, to);

		if (search) {
			query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`);
		}

		const { count, data, error } = await query;
		if (error) return res.status(400).json({ error: error.message });
		return res.json({ items: data ?? [], total: count ?? 0 });
	}

	if (req.method === 'POST') {
		const { content, image_url, link, summary, title } = req.body || {};

		if (!content || !image_url || !summary || !title) {
			return res.status(400).json({ error: 'Todos los campos son obligatorios' });
		}

		const { error } = await supabase
			.from('News')
			.insert({ content, image_url, link: link || null, summary, title });

		if (error) return res.status(400).json({ error: error.message });
		return res.json({ ok: true });
	}

	if (req.method === 'PUT') {
		const { content, id, image_url, link, summary, title } = req.body || {};
		if (!id) return res.status(400).json({ error: 'ID es obligatorio' });

		const { error } = await supabase
			.from('News')
			.update({ content, image_url, link: link || null, summary, title })
			.eq('id', id);

		if (error) return res.status(400).json({ error: error.message });
		return res.json({ ok: true });
	}

	if (req.method === 'DELETE') {
		const { id } = req.body || {};
		if (!id) return res.status(400).json({ error: 'ID es obligatorio' });

		const { error } = await supabase.from('News').delete().eq('id', id);
		if (error) return res.status(400).json({ error: error.message });
		return res.json({ ok: true });
	}

	return res.status(405).json({ error: 'Method not allowed' });
};
