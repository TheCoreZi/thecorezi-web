import { supabase } from './supabase';

export interface VoteCounts {
	dislikes: number;
	likes: number;
	net: number;
}

let cache: Record<string, VoteCounts> | null = null;
let pending: Promise<Record<string, VoteCounts>> | null = null;

export async function fetchAllVoteCounts(): Promise<Record<string, VoteCounts>> {
	if (cache) return cache;
	if (pending) return pending;

	pending = supabase
		.from('seller_vote_counts')
		.select('*')
		.then(({ data }) => {
			const map: Record<string, VoteCounts> = {};
			for (const row of data ?? []) {
				map[row.seller_id] = {
					dislikes: row.dislikes,
					likes: row.likes,
					net: row.net,
				};
			}
			cache = map;
			pending = null;
			return map;
		});

	return pending;
}

export function invalidateVoteCache(): void {
	cache = null;
}
