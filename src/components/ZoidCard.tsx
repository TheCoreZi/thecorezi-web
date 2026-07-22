import { useEffect, useRef, useState } from 'preact/hooks';
import diamondIcon from '../assets/icons/diamond.svg?raw';
import brandKotobukiya from '../assets/images/brand/kotobukiya.png';
import brandTomy from '../assets/images/brand/tomy.png';
import lineAz from '../assets/images/lines/az.png';
import lineHmm from '../assets/images/lines/hmm.png';
import lineRmz from '../assets/images/lines/rmz.png';
import lineSparkfig from '../assets/images/lines/sparkfig.png';
import lineSynergenex from '../assets/images/lines/synergenex.png';
import { proxyImageUrl } from '../lib/imageProxy';
import type { DatePrecision, Zoid } from '../types/zoid';

const DURATION = 350;
const EASING = 'ease-in-out';

const brandLogos: Record<string, string> = {
	Kotobukiya: brandKotobukiya.src,
	Tomy: brandTomy.src,
};

const lineLogos: Record<string, string> = {
	AZ: lineAz.src,
	HMM: lineHmm.src,
	RMZ: lineRmz.src,
	SPARKFIG: lineSparkfig.src,
	SYNERGENEX: lineSynergenex.src,
};

const exclusiveShopNames: Record<string, string> = {
	KOTO_SHOP: 'Kotobukiya Shop',
	TOMY_MALL: 'Takara Tomy Mall',
};

function formatDate(date: number | null, precision: DatePrecision): string {
	if (!date) return 'TBA';
	const optionsMap: Record<DatePrecision, Intl.DateTimeFormatOptions> = {
		DAY: { year: 'numeric', month: 'long', day: 'numeric' },
		MONTH: { year: 'numeric', month: 'long' },
		YEAR: { year: 'numeric' },
	};
	const options = optionsMap[precision];
	const formatted = new Date(date).toLocaleDateString('es', { ...options, timeZone: 'UTC' });
	return formatted.replace(/\b[a-záéíóúñ]+\b/g, (word) =>
		['de'].includes(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)
	);
}


interface Props {
	defaultOpen?: boolean;
	eager?: boolean;
	onSelect?: () => void;
	onToggle?: (open: boolean) => void;
	zoid: Zoid;
}

export default function ZoidCard({ defaultOpen = false, eager = false, onSelect, onToggle, zoid }: Props) {
	const [open, setOpen] = useState(false);
	const cardRef = useRef<HTMLDetailsElement>(null);
	const loading = eager ? 'eager' : 'lazy';

	useEffect(() => {
		if (!defaultOpen) return;
		const card = cardRef.current;
		if (!card) return;
		const wrapper = card.parentElement ?? card;
		const fromRect = wrapper.getBoundingClientRect();
		setOpen(true);
		requestAnimationFrame(() => {
			const toRect = wrapper.getBoundingClientRect();
			card.style.overflow = 'hidden';
			wrapper.animate(
				{ height: [`${fromRect.height}px`, `${toRect.height}px`] },
				{ duration: DURATION, easing: EASING },
			).onfinish = () => {
				card.style.overflow = '';
			};
		});
	}, []);

	const threeMonthsAgo = new Date();
	threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
	const showReserveDate = zoid.reserve_date != null && zoid.reserve_date > threeMonthsAgo.getTime();

	function handleClick(e: Event) {
		e.preventDefault();

		if (onSelect) {
			onSelect();
			return;
		}

		const card = cardRef.current;
		if (!card) return;
		const wrapper = card.parentElement ?? card;

		if (open) {
			const fromRect = wrapper.getBoundingClientRect();
			card.open = false;
			wrapper.style.gridColumn = '';
			wrapper.style.order = '';
			const toRect = wrapper.getBoundingClientRect();
			card.open = true;
			wrapper.style.gridColumn = '1 / -1';
			wrapper.style.order = '-1';
			card.style.overflow = 'hidden';
			wrapper.animate(
				{ width: [`${fromRect.width}px`, `${toRect.width}px`], height: [`${fromRect.height}px`, `${toRect.height}px`] },
				{ duration: DURATION, easing: EASING },
			).onfinish = () => {
				setOpen(false);
				onToggle?.(false);
				wrapper.style.gridColumn = '';
				wrapper.style.order = '';
				card.style.overflow = '';
			};
			return;
		}

		document.querySelectorAll<HTMLDetailsElement>('[data-zoid-card][open]').forEach((other) => {
			if (other !== card) {
				other.open = false;
				const w = other.parentElement ?? other;
				w.style.gridColumn = '';
				w.style.order = '';
			}
		});

		const fromRect = wrapper.getBoundingClientRect();
		setOpen(true);
		onToggle?.(true);
		requestAnimationFrame(() => {
			wrapper.style.gridColumn = '1 / -1';
			if (!window.matchMedia('(max-width: 550px)').matches) {
				wrapper.style.order = '-1';
			}
			const toRect = wrapper.getBoundingClientRect();
			card.style.overflow = 'hidden';
			wrapper.animate(
				{ width: [`${fromRect.width}px`, `${toRect.width}px`], height: [`${fromRect.height}px`, `${toRect.height}px`] },
				{ duration: DURATION, easing: EASING },
			).onfinish = () => {
				card.style.overflow = '';
			};
		});
	}

	return (
		<details class="zoid-card" data-zoid-card ref={cardRef} open={open}>
			<summary class="zoid-summary" onClick={handleClick}>
				{zoid.image_url && (
					<>
						<img src={proxyImageUrl(zoid.image_url)} alt="" class="zoid-image-bg" aria-hidden="true" width={640} height={360} loading={loading} />
						<img src={proxyImageUrl(zoid.image_url)} alt={zoid.name} class="zoid-image" width={640} height={360} loading={loading} />
					</>
				)}
				<div class="zoid-scrim" />
				{zoid.exclusive && <span class="exclusive-icon" dangerouslySetInnerHTML={{ __html: diamondIcon }} />}
				<div class="zoid-dates">
					{showReserveDate && (
						<span class="date-label">Preventa: <strong>{formatDate(zoid.reserve_date, zoid.reserve_date_precision)}</strong></span>
					)}
					<span class="date-label">Lanzamiento: <strong>{formatDate(zoid.launch_date, zoid.launch_date_precission)}</strong></span>
				</div>
				<div class="zoid-summary-logos">
						{brandLogos[zoid.brand] && (
							<img src={brandLogos[zoid.brand]} alt={zoid.brand} class="zoid-summary-logo" />
						)}
						{lineLogos[zoid.line] && (
							<img src={lineLogos[zoid.line]} alt={zoid.line} class="zoid-summary-logo" />
						)}
					</div>
					<div class="zoid-detail-logos">
						{brandLogos[zoid.brand] && (
							<img src={brandLogos[zoid.brand]} alt={zoid.brand} class="zoid-detail-logo" />
						)}
						{lineLogos[zoid.line] && (
							<img src={lineLogos[zoid.line]} alt={zoid.line} class="zoid-detail-logo" />
						)}
					</div>
					<div class="zoid-info">
					{zoid.retail_price && zoid.currency && (
						<p class="zoid-price" data-price={zoid.retail_price} data-currency={zoid.currency}>
							{zoid.retail_price.toLocaleString('en', { style: 'currency', currency: zoid.currency })}
						</p>
					)}
					{zoid.model_code && <span class="zoid-code">{zoid.model_code}</span>}
					<h3 class="zoid-name">{zoid.name}</h3>
				</div>
			</summary>

			<div class="zoid-detail">
				{zoid.model_code && <span class="zoid-detail-code">{zoid.model_code}</span>}
				<h3 class="zoid-detail-name">{zoid.name}</h3>

				{zoid.retail_price && zoid.currency && (
					<p class="zoid-detail-price" data-price={zoid.retail_price} data-currency={zoid.currency}>
						{zoid.retail_price.toLocaleString('en', { style: 'currency', currency: zoid.currency })}
					</p>
				)}

				<div class="zoid-detail-dates">
					{showReserveDate && (
						<span class="date-label">Preventa: <strong>{formatDate(zoid.reserve_date, zoid.reserve_date_precision)}</strong></span>
					)}
					<span class="date-label">Lanzamiento: <strong>{formatDate(zoid.launch_date, zoid.launch_date_precission)}</strong></span>
				</div>

				{zoid.exclusive && (
					<p class="exclusive-detail"><span class="exclusive-icon-inline" dangerouslySetInnerHTML={{ __html: diamondIcon }} /> Exclusivo de <strong>{exclusiveShopNames[zoid.exclusive] ?? zoid.exclusive}</strong></p>
				)}

				{zoid.description && (
					<p class="zoid-description">{zoid.description}</p>
				)}

				{zoid.features && zoid.features.length > 0 && (
					<div class="zoid-features-section">
						<h4>Características</h4>
						<ul class="zoid-features">
							{zoid.features.map((feature: string) => (
								<li>{feature}</li>
							))}
						</ul>
					</div>
				)}

				{zoid.official_link && (
					<a href={zoid.official_link} target="_blank" rel="noopener noreferrer" class="official-link">Ver página oficial</a>
				)}
			</div>
		</details>
	);
}
