import FingerprintJS from '@fingerprintjs/fingerprintjs';

let cachedId: string | null = null;

export async function generateFingerprint(): Promise<string> {
	if (cachedId) return cachedId;

	const agent = await FingerprintJS.load();
	const result = await agent.get();
	cachedId = result.visitorId;
	return cachedId;
}
