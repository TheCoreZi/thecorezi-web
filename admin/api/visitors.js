const UMAMI_URL = process.env.UMAMI_URL;
const UMAMI_USERNAME = process.env.UMAMI_USERNAME;
const UMAMI_PASSWORD = process.env.UMAMI_PASSWORD;
const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;

async function getUmamiToken() {
	const res = await fetch(`${UMAMI_URL}/api/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username: UMAMI_USERNAME, password: UMAMI_PASSWORD }),
	});
	const data = await res.json();
	return data.token;
}

module.exports = async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', 'https://thecorezi.com');
	res.setHeader('Access-Control-Allow-Methods', 'GET');
	res.setHeader('Cache-Control', 'public, max-age=3600');

	if (req.method === 'OPTIONS') {
		return res.status(204).end();
	}

	try {
		const token = await getUmamiToken();
		if (!token) {
			return res.status(500).json({ error: 'auth failed', hasUrl: !!UMAMI_URL, hasUser: !!UMAMI_USERNAME });
		}
		const statsRes = await fetch(
			`${UMAMI_URL}/api/websites/${UMAMI_WEBSITE_ID}/stats?startAt=0&endAt=${Date.now()}`,
			{ headers: { Authorization: `Bearer ${token}` } },
		);
		const stats = await statsRes.json();
		if (stats.error) {
			return res.status(500).json({ error: 'stats failed', details: stats.error });
		}
		res.json({ visitors: stats.visitors });
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
};
