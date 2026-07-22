const { requireAuth } = require('./_lib/auth');
const { supabase } = require('./_lib/supabase');

const PAGE_SIZE = 25;
const TABLE = 'Zoids Releases';
const REQUIRED_FIELDS = ['brand', 'description', 'launch_date_precission', 'line', 'name', 'reserve_date_precision'];

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
			.from(TABLE)
			.select('*', { count: 'exact' })
			.order('launch_date', { ascending: false, nullsFirst: true })
			.range(from, to);

		if (search) {
			query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,line.ilike.%${search}%`);
		}

		const { count, data, error } = await query;
		if (error) return res.status(400).json({ error: error.message });
		return res.json({ items: data ?? [], total: count ?? 0 });
	}

	if (req.method === 'POST') {
		const body = req.body || {};
		const missing = REQUIRED_FIELDS.filter((f) => !body[f]);
		if (missing.length) {
			return res.status(400).json({ error: `Campos obligatorios: ${missing.join(', ')}` });
		}

		const row = buildRow(body);
		const { error } = await supabase.from(TABLE).insert(row);
		if (error) return res.status(400).json({ error: error.message });
		return res.json({ ok: true });
	}

	if (req.method === 'PUT') {
		const body = req.body || {};
		if (!body.id) return res.status(400).json({ error: 'ID es obligatorio' });

		const row = buildRow(body);
		const { error } = await supabase.from(TABLE).update(row).eq('id', body.id);
		if (error) return res.status(400).json({ error: error.message });
		return res.json({ ok: true });
	}

	if (req.method === 'DELETE') {
		const { id } = req.body || {};
		if (!id) return res.status(400).json({ error: 'ID es obligatorio' });

		const { error } = await supabase.from(TABLE).delete().eq('id', id);
		if (error) return res.status(400).json({ error: error.message });
		return res.json({ ok: true });
	}

	return res.status(405).json({ error: 'Method not allowed' });
};

function buildRow(body) {
	return {
		brand: body.brand,
		currency: body.currency || null,
		description: body.description,
		exclusive: body.exclusive || null,
		features: body.features || null,
		image_url: body.image_url || null,
		launch_date: body.launch_date ?? null,
		launch_date_precission: body.launch_date_precission,
		line: body.line,
		model_code: body.model_code || null,
		name: body.name,
		official_link: body.official_link || null,
		reserve_date: body.reserve_date ?? null,
		reserve_date_precision: body.reserve_date_precision,
		retail_price: body.retail_price ?? null,
		scale: body.scale || null,
		slug: body.slug || null,
	};
}
