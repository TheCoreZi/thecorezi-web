const proxyUrl = import.meta.env.PUBLIC_IMAGE_PROXY_URL;
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;

export function proxyContentUrls(html: string): string {
	if (!proxyUrl || !supabaseUrl) return html;
	return html.replaceAll(supabaseUrl, proxyUrl);
}

export function proxyImageUrl(url: string | null | undefined): string | undefined {
	if (!url || !proxyUrl || !supabaseUrl) return url ?? undefined;
	if (!url.startsWith(supabaseUrl)) return url;
	return url.replace(supabaseUrl, proxyUrl);
}
