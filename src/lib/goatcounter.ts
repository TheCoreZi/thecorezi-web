declare global {
	interface Window {
		goatcounter?: { count: (opts: { path: string }) => void };
	}
}

export function trackPath(path: string) {
	window.goatcounter?.count({ path });
}
