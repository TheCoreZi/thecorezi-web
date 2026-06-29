import { useEffect, useState } from 'preact/hooks';
import SellerVoteButtons from './SellerVoteButtons';

export default function SellerVoteButtonsDynamic() {
	const [sellerId, setSellerId] = useState<string | null>(null);

	useEffect(() => {
		function handleOpen(e: Event) {
			const detail = (e as CustomEvent).detail;
			setSellerId(detail?.id ?? null);
		}

		window.addEventListener('seller:detail', handleOpen);
		return () => window.removeEventListener('seller:detail', handleOpen);
	}, []);

	if (!sellerId) return null;
	return <SellerVoteButtons key={sellerId} sellerId={sellerId} />;
}
