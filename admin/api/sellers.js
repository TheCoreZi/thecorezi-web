const { requireAuth } = require('./_lib/auth');
const { supabase } = require('./_lib/supabase');

const PAGE_SIZE = 50;

const REQUIRED_FIELDS = ['country_code', 'description', 'id', 'link', 'name', 'type'];
const VALID_TYPES = ['community', 'independent', 'store'];
const VALID_COUNTRIES = ['GL', 'JP', 'MX', 'PE'];

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

	if (req.method === 'POST') {
		const body = req.body || {};
		for (const field of REQUIRED_FIELDS) {
			if (!body[field] && field !== 'id') {
				return res.status(400).json({ error: `Campo obligatorio: ${field}` });
			}
		}
		if (!VALID_TYPES.includes(body.type)) {
			return res.status(400).json({ error: 'Tipo invalido' });
		}
		if (!VALID_COUNTRIES.includes(body.country_code)) {
			return res.status(400).json({ error: 'Pais invalido' });
		}

		const id = body.id || toSlug(body.name);
		const row = {
			cons: body.cons || [],
			country_code: body.country_code,
			description: body.description,
			id,
			image: body.image || null,
			link: body.link,
			name: body.name,
			pros: body.pros || [],
			type: body.type,
		};

		const { error } = await supabase.from('sellers').insert(row);
		if (error) return res.status(400).json({ error: error.message });
		return res.json({ ok: true, id });
	}

	if (req.method === 'PUT') {
		const body = req.body || {};
		if (!body.id) return res.status(400).json({ error: 'ID obligatorio' });

		const updates = {};
		if (body.cons !== undefined) updates.cons = body.cons;
		if (body.country_code !== undefined) {
			if (!VALID_COUNTRIES.includes(body.country_code)) {
				return res.status(400).json({ error: 'Pais invalido' });
			}
			updates.country_code = body.country_code;
		}
		if (body.description !== undefined) updates.description = body.description;
		if (body.image !== undefined) updates.image = body.image || null;
		if (body.link !== undefined) updates.link = body.link;
		if (body.name !== undefined) updates.name = body.name;
		if (body.pros !== undefined) updates.pros = body.pros;
		if (body.type !== undefined) {
			if (!VALID_TYPES.includes(body.type)) {
				return res.status(400).json({ error: 'Tipo invalido' });
			}
			updates.type = body.type;
		}

		if (Object.keys(updates).length === 0) {
			return res.status(400).json({ error: 'Nada que actualizar' });
		}

		const { error } = await supabase.from('sellers').update(updates).eq('id', body.id);
		if (error) return res.status(400).json({ error: error.message });
		return res.json({ ok: true });
	}

	if (req.method === 'DELETE') {
		const { id } = req.body || {};
		if (!id) return res.status(400).json({ error: 'ID obligatorio' });

		const { error } = await supabase.from('sellers').delete().eq('id', id);
		if (error) return res.status(400).json({ error: error.message });
		return res.json({ ok: true });
	}

	// GET - list
	const page = parseInt(req.query.page) || 0;
	const from = page * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	const search = req.query.search || '';
	let query = supabase
		.from('sellers')
		.select('cons, country_code, description, id, image, link, name, pros, type', { count: 'exact' })
		.order('country_code')
		.order('name')
		.range(from, to);

	if (search) {
		query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
	}

	const { count, data, error } = await query;
	if (error) return res.status(500).json({ error: error.message });
	res.json({ items: data ?? [], total: count ?? 0 });
};
