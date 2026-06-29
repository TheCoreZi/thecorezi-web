import { useEffect, useState } from 'preact/hooks';
import faceHappyIcon from '../assets/icons/face-happy.svg?raw';
import faceSadIcon from '../assets/icons/face-sad.svg?raw';
import { fetchAllVoteCounts, invalidateVoteCache, type VoteCounts } from '../lib/sellerVotes';
import { supabase } from '../lib/supabase';
import { getLocalVotes, getVoterId, removeLocalVote, setLocalVote } from '../lib/voter';

interface Props {
	sellerId: string;
}

const DEFAULT_COUNTS: VoteCounts = { dislikes: 0, likes: 0, net: 0 };

export default function SellerVoteButtons({ sellerId }: Props) {
	const [counts, setCounts] = useState<VoteCounts>(DEFAULT_COUNTS);
	const [loading, setLoading] = useState(false);
	const [myVote, setMyVote] = useState<-1 | 1 | null>(null);

	useEffect(() => {
		const localVotes = getLocalVotes();
		if (localVotes[sellerId]) setMyVote(localVotes[sellerId]);

		fetchAllVoteCounts().then((all) => {
			setCounts(all[sellerId] ?? DEFAULT_COUNTS);
		});
	}, []);

	async function handleVote(vote: -1 | 1) {
		if (loading) return;
		setLoading(true);

		const voterId = getVoterId();

		if (myVote === vote) {
			await supabase
				.from('seller_votes')
				.delete()
				.eq('seller_id', sellerId)
				.eq('voter_id', voterId);
			removeLocalVote(sellerId);
			setMyVote(null);
		} else {
			await supabase
				.from('seller_votes')
				.upsert(
					{ seller_id: sellerId, vote, voter_id: voterId },
					{ onConflict: 'seller_id,voter_id' },
				);
			setLocalVote(sellerId, vote);
			setMyVote(vote);
		}

		invalidateVoteCache();
		const all = await fetchAllVoteCounts();
		setCounts(all[sellerId] ?? DEFAULT_COUNTS);
		setLoading(false);
	}

	return (
		<div class="seller-vote-buttons" onClick={(e) => e.stopPropagation()}>
			<button
				class={`seller-vote-btn seller-vote-btn--like${myVote === 1 ? ' seller-vote-btn--active' : ''}`}
				disabled={loading}
				onClick={() => handleVote(1)}
				type="button"
			>
				<span class="seller-vote-icon" dangerouslySetInnerHTML={{ __html: faceHappyIcon }} /> {counts.likes}
			</button>
			<button
				class={`seller-vote-btn seller-vote-btn--dislike${myVote === -1 ? ' seller-vote-btn--active' : ''}`}
				disabled={loading}
				onClick={() => handleVote(-1)}
				type="button"
			>
				<span class="seller-vote-icon" dangerouslySetInnerHTML={{ __html: faceSadIcon }} /> {counts.dislikes}
			</button>
		</div>
	);
}
