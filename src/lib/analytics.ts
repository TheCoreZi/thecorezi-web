declare global {
	interface Window {
		umami?: { track: (name: string, data?: Record<string, string>) => void };
	}
}

export function trackPath(path: string) {
	window.umami?.track('pageview', { path });
}
