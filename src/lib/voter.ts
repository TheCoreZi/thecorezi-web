const STORAGE_KEY = 'thecorezi_voter_id';
const VOTES_KEY = 'thecorezi_seller_votes';

export function getVoterId(): string {
	let id = localStorage.getItem(STORAGE_KEY);
	if (!id) {
		id = crypto.randomUUID();
		localStorage.setItem(STORAGE_KEY, id);
	}
	return id;
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
