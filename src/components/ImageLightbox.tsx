import { createPortal } from 'preact/compat';
import { useCallback, useEffect, useState } from 'preact/hooks';

interface ImageLightboxProps {
	containerRef: { current: HTMLElement | null };
}

export default function ImageLightbox({ containerRef }: ImageLightboxProps) {
	const [src, setSrc] = useState<string | null>(null);

	const close = useCallback(() => setSrc(null), []);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		function handleClick(e: Event) {
			const target = e.target as HTMLElement;
			if (target.tagName === 'IMG') {
				e.stopPropagation();
				setSrc((target as HTMLImageElement).src);
			}
		}

		container.addEventListener('click', handleClick);
		return () => container.removeEventListener('click', handleClick);
	}, [containerRef.current]);

	useEffect(() => {
		if (!src) return;
		function handleKey(e: KeyboardEvent) {
			if (e.key === 'Escape') close();
		}
		document.addEventListener('keydown', handleKey);
		return () => document.removeEventListener('keydown', handleKey);
	}, [src]);

	if (!src) return null;

	return createPortal(
		<div class="lightbox-overlay" onClick={close}>
			<button class="lightbox-close" onClick={close} type="button">✕</button>
			<img alt="" class="lightbox-image" onClick={(e) => e.stopPropagation()} src={src} />
		</div>,
		document.body,
	);
}
