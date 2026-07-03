const { requireAuth } = require('./_lib/auth');
const { supabase } = require('./_lib/supabase');

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

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { content, image_url, slug, summary, title } = req.body || {};

	if (!content || !image_url || !summary || !title) {
		return res.status(400).json({ error: 'Todos los campos son obligatorios' });
	}

	const finalSlug = slug || toSlug(title);

	const { error } = await supabase
		.from('Curiosidades')
		.insert({ content, image_url, slug: finalSlug, summary, title });

	if (error) {
		return res.status(400).json({ error: error.message });
	}

	res.json({ ok: true });
};
