const { requireAuth } = require('./_lib/auth');
const { supabase } = require('./_lib/supabase');

module.exports = async function handler(req, res) {
	if (!requireAuth(req)) {
		return res.status(401).json({ error: 'No autorizado' });
	}

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { content, image_url, link, summary, title } = req.body || {};

	if (!content || !image_url || !summary || !title) {
		return res.status(400).json({ error: 'Todos los campos son obligatorios' });
	}

	const { error } = await supabase
		.from('News')
		.insert({ content, image_url, link: link || null, summary, title });

	if (error) {
		return res.status(400).json({ error: error.message });
	}

	res.json({ ok: true });
};
