import { useEffect, useRef, useState } from 'preact/hooks';
import { hasSubmittedComment, submitComment } from '../lib/curiosidadComments';

declare global {
	interface Window {
		turnstile: {
			render: (element: HTMLElement, options: Record<string, unknown>) => string;
			remove: (widgetId: string) => void;
			reset: (widgetId: string) => void;
		};
	}
}

interface Props {
	curiosidadId: string;
}

type FormState = 'error' | 'idle' | 'submitting' | 'success';

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

export default function CuriosidadCommentForm({ curiosidadId }: Props) {
	const [alreadySubmitted, setAlreadySubmitted] = useState(true);
	const [comment, setComment] = useState('');
	const [email, setEmail] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [honeypot, setHoneypot] = useState('');
	const [name, setName] = useState('');
	const [state, setState] = useState<FormState>('idle');
	const [turnstileToken, setTurnstileToken] = useState('');
	const turnstileRef = useRef<HTMLDivElement>(null);
	const widgetIdRef = useRef<string | null>(null);

	useEffect(() => {
		setAlreadySubmitted(hasSubmittedComment(curiosidadId));
		setComment('');
		setErrorMsg('');
		setName('');
		setState('idle');
	}, [curiosidadId]);

	useEffect(() => {
		let cancelled = false;
		setTurnstileToken('');

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
	}, [curiosidadId]);

	if (alreadySubmitted || state === 'success') {
		if (state === 'success') {
			return (
				<div class="feedback-form">
					<p class="feedback-success">Tu comentario fue enviado y sera visible una vez que sea revisado.</p>
				</div>
			);
		}
		return null;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (honeypot) return;
		if (state === 'submitting') return;
		if (!turnstileToken) {
			setErrorMsg('Por favor espera a que se complete la verificacion.');
			return;
		}

		setState('submitting');
		setErrorMsg('');

		const result = await submitComment({
			comment: comment.trim(),
			curiosidad_id: curiosidadId,
			email: email.trim().toLowerCase(),
			name: name.trim(),
		});

		if (result.error) {
			if (result.error.includes('Ya dejaste')) {
				setAlreadySubmitted(true);
			}
			setErrorMsg(result.error);
			setState('error');
		} else {
			setState('success');
		}
	}

	return (
		<div class="feedback-form">
			<h4 class="feedback-title">Deja tu comentario</h4>
			<form onSubmit={handleSubmit}>
				<div class="feedback-form-row">
					<div class="feedback-field">
						<label for="comment-name">Nombre o alias</label>
						<input
							id="comment-name"
							maxLength={50}
							onInput={(e) => setName((e.target as HTMLInputElement).value)}
							required
							type="text"
							value={name}
						/>
					</div>
					<div class="feedback-field">
						<label for="comment-email">Email (no se mostrara publicamente)</label>
						<input
							id="comment-email"
							onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
							required
							type="email"
							value={email}
						/>
					</div>
				</div>
				<div class="feedback-field">
					<label for="comment-text">Comentario</label>
					<textarea
						id="comment-text"
						maxLength={500}
						minLength={10}
						onInput={(e) => setComment((e.target as HTMLTextAreaElement).value)}
						required
						value={comment}
					/>
					<span class="feedback-char-count">{comment.length}/500</span>
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
				<p class="feedback-disclaimer">Al enviar, aceptas que almacenemos tu nombre y correo para gestionar tu comentario. Tu correo no sera visible publicamente ni compartido con terceros.</p>
				<button class="feedback-submit-btn" disabled={state === 'submitting'} type="submit">
					{state === 'submitting' ? 'Enviando...' : 'Enviar comentario'}
				</button>
			</form>
		</div>
	);
}
