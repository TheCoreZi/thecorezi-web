const { requireAuth } = require('./_lib/auth');

module.exports = async function handler(req, res) {
	if (!requireAuth(req)) {
		return res.status(401).json({ error: 'No autorizado' });
	}

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { comment, context, email, first_name, topic } = req.body || {};

	if (!comment || !context || !email || !first_name || !topic) {
		return res.status(400).json({ error: 'Todos los campos son obligatorios' });
	}

	const response = await fetch('https://api.resend.com/emails', {
		body: JSON.stringify({
			from: 'The Core Zi <no-reply@thecorezi.com>',
			template: {
				id: 'comment-needs-proof',
				variables: { comment, context, first_name, topic },
			},
			to: email,
		}),
		headers: {
			'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
			'Content-Type': 'application/json',
		},
		method: 'POST',
	});

	const data = await response.json();

	if (!response.ok) {
		return res.status(400).json({ error: data.message || 'Error al enviar correo' });
	}

	return res.json({ ok: true });
};
