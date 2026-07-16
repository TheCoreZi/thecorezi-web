const { requireAuth } = require('./_lib/auth');

module.exports = async function handler(req, res) {
	if (!requireAuth(req)) {
		return res.status(401).json({ error: 'No autorizado' });
	}

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { content, image_url } = req.body || {};

	if (!content || !content.trim()) {
		return res.status(400).json({ error: 'El mensaje no puede estar vacio' });
	}

	const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
	if (!webhookUrl) {
		return res.status(500).json({ error: 'Webhook de Discord no configurado' });
	}

	const payload = { content: content.trim() };
	if (image_url) {
		payload.embeds = [{ image: { url: image_url } }];
	}

	const response = await fetch(webhookUrl, {
		body: JSON.stringify(payload),
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
	});

	if (!response.ok) {
		const text = await response.text().catch(() => '');
		return res.status(400).json({ error: text || 'Error al enviar mensaje a Discord' });
	}

	return res.json({ ok: true });
};
