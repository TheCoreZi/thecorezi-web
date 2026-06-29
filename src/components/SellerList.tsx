import { useEffect, useState } from 'preact/hooks';
import type { Seller, SellerType } from '../data/sellers';
import { fetchAllVoteCounts } from '../lib/sellerVotes';
import SellerVoteButtons from './SellerVoteButtons';

const SELLER_TYPE_TITLES: Record<SellerType, string> = {
	community: 'Comunidad',
	independent: 'Vendedor independiente',
	store: 'Tienda',
};

interface Props {
	sellers: Seller[];
}

export default function SellerList({ sellers }: Props) {
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

	function openSeller(seller: Seller) {
		window.dispatchEvent(new CustomEvent('seller:open', { detail: seller }));
	}

	return (
		<>
			{sorted.map((seller) => (
				<div class="seller-card" key={seller.id} onClick={() => openSeller(seller)}>
					<div class="seller-summary">
						{seller.image && (
							<img alt={seller.name} class="seller-image" height="60" src={seller.image} width="160" />
						)}
						<div class="seller-summary-text">
							<div class="seller-header">
								<div class="seller-name-row">
									<h4 class="seller-name">{seller.name}</h4>
									<img alt={SELLER_TYPE_TITLES[seller.type]} class={`seller-type-icon seller-type-icon--${seller.type}`} height="18" src={`/images/sellers/type-${seller.type}.svg`} title={SELLER_TYPE_TITLES[seller.type]} width="18" />
								</div>
								<SellerVoteButtons sellerId={seller.id} />
							</div>
						</div>
					</div>
				</div>
			))}
		</>
	);
}
