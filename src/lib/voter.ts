import { generateFingerprint } from './fingerprint';

const STORAGE_KEY = 'thecorezi_voter_id';
const VOTES_KEY = 'thecorezi_seller_votes';

export async function getVoterId(): Promise<string> {
	const fingerprint = await generateFingerprint();
	const storedId = localStorage.getItem(STORAGE_KEY);

	if (storedId !== fingerprint) {
		localStorage.setItem(STORAGE_KEY, fingerprint);
	}

	return fingerprint;
}

export function getLocalVotes(): Record<string, 1 | -1> {
	try {
		return JSON.parse(localStorage.getItem(VOTES_KEY) || '{}');
	} catch {
		return {};
	}
}

export function removeLocalVote(sellerId: string): void {
	const votes = getLocalVotes();
	delete votes[sellerId];
	localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}

export function setLocalVote(sellerId: string, vote: 1 | -1): void {
	const votes = getLocalVotes();
	votes[sellerId] = vote;
	localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}
