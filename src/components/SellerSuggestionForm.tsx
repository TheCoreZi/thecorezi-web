import { useEffect, useRef, useState } from 'preact/hooks';
import { submitSellerSuggestion } from '../lib/sellerSuggestion';

declare global {
	interface Window {
		turnstile: {
			render: (element: HTMLElement, options: Record<string, unknown>) => string;
			remove: (widgetId: string) => void;
			reset: (widgetId: string) => void;
		};
	}
}

type FormState = 'error' | 'idle' | 'submitting' | 'success';

const MIN_ITEMS = 2;

let turnstilePromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
	if (turnstilePromise) return turnstilePromise;
	turnstilePromise = new Promise((resolve, reject) => {
		if (window.turnstile) { resolve(); return; }
		const script = document.createElement('script');
		script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad';
		script.async = true;
		(window as unknown as Record<string, unknown>).onTurnstileLoad = () => resolve();
		script.onerror = () => reject(new Error('Failed to load Turnstile'));
		document.head.appendChild(script);
	});
	return turnstilePromise;
}

export default function SellerSuggestionForm() {
	const [cons, setCons] = useState(['', '']);
	const [country, setCountry] = useState('');
	const [description, setDescription] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [honeypot, setHoneypot] = useState('');
	const [link, setLink] = useState('');
	const [name, setName] = useState('');
	const [pros, setPros] = useState(['', '']);
	const [state, setState] = useState<FormState>('idle');
	const [turnstileToken, setTurnstileToken] = useState('');
	const turnstileRef = useRef<HTMLDivElement>(null);
	const widgetIdRef = useRef<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		loadTurnstileScript().then(() => {
			if (cancelled || !turnstileRef.current) return;
			if (widgetIdRef.current !== null) {
				window.turnstile.remove(widgetIdRef.current);
				widgetIdRef.current = null;
			}
			widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
				sitekey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY,
				callback: (token: string) => { if (!cancelled) setTurnstileToken(token); },
				'expired-callback': () => { if (!cancelled) setTurnstileToken(''); },
				theme: 'dark',
			});
		});
		return () => {
			cancelled = true;
			if (widgetIdRef.current !== null) {
				window.turnstile.remove(widgetIdRef.current);
				widgetIdRef.current = null;
			}
		};
	}, []);

	function updateListItem(list: string[], setList: (v: string[]) => void, index: number, value: string) {
		const updated = [...list];
		updated[index] = value;
		setList(updated);
	}

	function addListItem(list: string[], setList: (v: string[]) => void) {
		setList([...list, '']);
	}

	function removeListItem(list: string[], setList: (v: string[]) => void, index: number) {
		if (list.length <= MIN_ITEMS) return;
		setList(list.filter((_, i) => i !== index));
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (honeypot) return;
		if (state === 'submitting') return;
		if (!turnstileToken) {
			setErrorMsg('Por favor espera a que se complete la verificación.');
			return;
		}

		const filledPros = pros.map((p) => p.trim()).filter(Boolean);
		const filledCons = cons.map((c) => c.trim()).filter(Boolean);

		if (filledPros.length < MIN_ITEMS) {
			setErrorMsg(`Agrega al menos ${MIN_ITEMS} puntos buenos.`);
			return;
		}
		if (filledCons.length < MIN_ITEMS) {
			setErrorMsg(`Agrega al menos ${MIN_ITEMS} puntos malos.`);
			return;
		}

		setState('submitting');
		setErrorMsg('');

		const result = await submitSellerSuggestion({
			cons: filledCons,
			country: country.trim(),
			description: description.trim(),
			link: link.trim(),
			name: name.trim(),
			pros: filledPros,
		});

		if (result.error) {
			setErrorMsg(result.error);
			setState('error');
		} else {
			setState('success');
		}
	}

	if (state === 'success') {
		return (
			<div class="suggestion-form">
				<p class="feedback-success">¡Gracias por tu sugerencia! La revisaremos pronto.</p>
				<a class="suggestion-back-link" href="/donde-comprar/">← Volver al directorio</a>
			</div>
		);
	}

	return (
		<div class="suggestion-form">
			<form onSubmit={handleSubmit}>
				<div class="feedback-form-row">
					<div class="feedback-field">
						<label for="suggestion-name">Nombre del vendedor</label>
						<input
							id="suggestion-name"
							maxLength={100}
							onInput={(e) => setName((e.target as HTMLInputElement).value)}
							placeholder="Ej: Zoid Store MX"
							required
							type="text"
							value={name}
						/>
					</div>
					<div class="feedback-field">
						<label for="suggestion-country">País</label>
						<input
							id="suggestion-country"
							maxLength={50}
							onInput={(e) => setCountry((e.target as HTMLInputElement).value)}
							placeholder="Ej: México"
							required
							type="text"
							value={country}
						/>
					</div>
				</div>
				<div class="feedback-field">
					<label for="suggestion-link">Link a su página o red social</label>
					<input
						id="suggestion-link"
						maxLength={500}
						onInput={(e) => setLink((e.target as HTMLInputElement).value)}
						placeholder="Ej: https://facebook.com/vendedor"
						required
						type="url"
						value={link}
					/>
				</div>
				<div class="feedback-field">
					<label for="suggestion-description">Descripción de los servicios que ofrece</label>
					<textarea
						id="suggestion-description"
						maxLength={1000}
						minLength={20}
						onInput={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
						placeholder="¿Qué vende? ¿Cómo funciona? ¿Qué lo hace diferente?"
						required
						value={description}
					/>
					<span class="feedback-char-count">{description.length}/1000</span>
				</div>

				<div class="suggestion-list-section">
					<label>Lo bueno (mínimo {MIN_ITEMS})</label>
					{pros.map((pro, i) => (
						<div class="suggestion-list-row" key={`pro-${i}`}>
							<input
								maxLength={200}
								onInput={(e) => updateListItem(pros, setPros, i, (e.target as HTMLInputElement).value)}
								placeholder={`Punto bueno ${i + 1}`}
								type="text"
								value={pro}
							/>
							{pros.length > MIN_ITEMS && (
								<button class="suggestion-remove-btn" onClick={() => removeListItem(pros, setPros, i)} type="button">✕</button>
							)}
						</div>
					))}
					<button class="suggestion-add-btn" onClick={() => addListItem(pros, setPros)} type="button">+ Agregar otro</button>
				</div>

				<div class="suggestion-list-section">
					<label>Lo malo (mínimo {MIN_ITEMS})</label>
					{cons.map((con, i) => (
						<div class="suggestion-list-row" key={`con-${i}`}>
							<input
								maxLength={200}
								onInput={(e) => updateListItem(cons, setCons, i, (e.target as HTMLInputElement).value)}
								placeholder={`Punto malo ${i + 1}`}
								type="text"
								value={con}
							/>
							{cons.length > MIN_ITEMS && (
								<button class="suggestion-remove-btn" onClick={() => removeListItem(cons, setCons, i)} type="button">✕</button>
							)}
						</div>
					))}
					<button class="suggestion-add-btn" onClick={() => addListItem(cons, setCons)} type="button">+ Agregar otro</button>
				</div>

				<input
					class="feedback-hp"
					onInput={(e) => setHoneypot((e.target as HTMLInputElement).value)}
					tabIndex={-1}
					type="text"
					value={honeypot}
				/>
				<div ref={turnstileRef} class="feedback-turnstile" />
				{errorMsg && <p class="feedback-error">{errorMsg}</p>}
				<button class="feedback-submit-btn" disabled={state === 'submitting'} type="submit">
					{state === 'submitting' ? 'Enviando...' : 'Enviar sugerencia'}
				</button>
			</form>
		</div>
	);
}
