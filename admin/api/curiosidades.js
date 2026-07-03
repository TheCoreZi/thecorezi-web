const { requireAuth } = require('./_lib/auth');
const { supabase } = require('./_lib/supabase');

const PAGE_SIZE = 25;

function toSlug(text) {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

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
			.from('Curiosidades')
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
		const { content, image_url, is_published, slug, summary, title } = req.body || {};

		if (!content || !image_url || !summary || !title) {
			return res.status(400).json({ error: 'Todos los campos son obligatorios' });
		}

		const finalSlug = slug || toSlug(title);

		const { error } = await supabase
			.from('Curiosidades')
			.insert({ content, image_url, is_published: is_published ?? false, slug: finalSlug, summary, title });

		if (error) return res.status(400).json({ error: error.message });
		return res.json({ ok: true });
	}

	if (req.method === 'PUT') {
		const { content, id, image_url, is_published, slug, summary, title } = req.body || {};
		if (!id) return res.status(400).json({ error: 'ID es obligatorio' });

		const finalSlug = slug || toSlug(title);

		const { error } = await supabase
			.from('Curiosidades')
			.update({ content, image_url, is_published: is_published ?? false, slug: finalSlug, summary, title })
			.eq('id', id);

		if (error) return res.status(400).json({ error: error.message });
		return res.json({ ok: true });
	}

	if (req.method === 'DELETE') {
		const { id } = req.body || {};
		if (!id) return res.status(400).json({ error: 'ID es obligatorio' });

		const { error } = await supabase.from('Curiosidades').delete().eq('id', id);
		if (error) return res.status(400).json({ error: error.message });
		return res.json({ ok: true });
	}

	return res.status(405).json({ error: 'Method not allowed' });
};
