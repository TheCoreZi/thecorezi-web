import { useEffect, useState } from 'preact/hooks';
import type { Seller } from '../data/sellers';
import { fetchAllVoteCounts } from '../lib/sellerVotes';
import SellerVoteButtons from './SellerVoteButtons';

interface Props {
	sellers: Seller[];
}

export default function SellerList({ sellers }: Props) {
	const [expanded, setExpanded] = useState<Set<string>>(new Set());
	const [sorted, setSorted] = useState<Seller[]>(sellers);

	useEffect(() => {
		fetchAllVoteCounts().then((counts) => {
			const withScores = sellers.map((s) => ({
				net: counts[s.id]?.net ?? 0,
				seller: s,
			}));
			withScores.sort((a, b) => b.net - a.net);
			setSorted(withScores.map((w) => w.seller));
		});
	}, []);

	function toggleCard(id: string) {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}

	return (
		<>
			{sorted.map((seller) => {
				const isExpanded = expanded.has(seller.id);
				return (
					<div class={`seller-card${isExpanded ? ' expanded' : ''}`} key={seller.id}>
						<div class="seller-summary" onClick={() => toggleCard(seller.id)}>
							{seller.image && (
								<img alt={seller.name} class="seller-image" height="60" src={seller.image} width="160" />
							)}
							<div class="seller-summary-text">
								<div class="seller-header">
									<h4 class="seller-name">{seller.name}</h4>
									<SellerVoteButtons sellerId={seller.id} />
									<span class="seller-chevron">▸</span>
								</div>
							</div>
						</div>
						<div class="seller-body">
							<div class="seller-body-top">
								<a class="seller-link" href={seller.link} rel="noopener noreferrer" target="_blank">
									Visitar ↗
								</a>
							</div>
							<p class="seller-description">{seller.description}</p>
							<div class="seller-details">
								<div class="seller-pros">
									<h5>Lo bueno</h5>
									<ul>
										{seller.pros.map((pro) => (
											<li key={pro}>{pro}</li>
										))}
									</ul>
								</div>
								<div class="seller-cons">
									<h5>Lo malo</h5>
									<ul>
										{seller.cons.map((con) => (
											<li key={con}>{con}</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</>
	);
}
