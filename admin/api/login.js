import { clearCookie, setCookie, signToken } from './_lib/auth.js';

export default function handler(req, res) {
	if (req.method === 'DELETE') {
		res.setHeader('Set-Cookie', clearCookie());
		return res.json({ ok: true });
	}

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { password, username } = req.body || {};

	if (username !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASSWORD) {
		return res.status(401).json({ error: 'Credenciales invalidas' });
	}

	const token = signToken(username);
	res.setHeader('Set-Cookie', setCookie(token));
	res.json({ ok: true });
}
