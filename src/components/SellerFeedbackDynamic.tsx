import { useEffect, useState } from 'preact/hooks';
import SellerFeedbackForm from './SellerFeedbackForm';
import SellerFeedbackList from './SellerFeedbackList';

export default function SellerFeedbackDynamic() {
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
	return (
		<>
			<SellerFeedbackList key={sellerId} sellerId={sellerId} />
			<SellerFeedbackForm key={`form-${sellerId}`} sellerId={sellerId} />
		</>
	);
}
