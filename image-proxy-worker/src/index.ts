interface Env {
	CACHE_TTL: string;
	SUPABASE_URL: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders() });
		}

		if (request.method !== 'GET') {
			return new Response('Method not allowed', { status: 405 });
		}

		const supabaseUrl = `${env.SUPABASE_URL}${url.pathname}`;
		const cache = caches.default;
		const cacheKey = new Request(supabaseUrl, request);

		const cached = await cache.match(cacheKey);
		if (cached) return addCors(cached);

		const response = await fetch(supabaseUrl, {
			headers: { 'Accept': request.headers.get('Accept') || '*/*' },
		});

		if (!response.ok) {
			return new Response('Not found', { status: 404 });
		}

		const ttl = parseInt(env.CACHE_TTL) || 31536000;
		const headers = new Headers(response.headers);
		headers.set('Cache-Control', `public, max-age=${ttl}, immutable`);
		headers.set('Access-Control-Allow-Origin', '*');
		headers.delete('set-cookie');

		const cached_response = new Response(response.body, {
			headers,
			status: response.status,
		});

		request.cf && await cache.put(cacheKey, cached_response.clone());

		return cached_response;
	},
};

function corsHeaders(): HeadersInit {
	return {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, OPTIONS',
		'Access-Control-Max-Age': '86400',
	};
}

function addCors(response: Response): Response {
	const headers = new Headers(response.headers);
	headers.set('Access-Control-Allow-Origin', '*');
	return new Response(response.body, { headers, status: response.status });
}
