import { useEffect, useState } from 'preact/hooks';
import { hasSubmittedFeedback, submitFeedback } from '../lib/sellerFeedback';

interface Props {
	sellerId: string;
}

type FormState = 'error' | 'idle' | 'submitting' | 'success';

export default function SellerFeedbackForm({ sellerId }: Props) {
	const [alreadySubmitted, setAlreadySubmitted] = useState(true);
	const [comment, setComment] = useState('');
	const [email, setEmail] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [honeypot, setHoneypot] = useState('');
	const [model, setModel] = useState('');
	const [name, setName] = useState('');
	const [state, setState] = useState<FormState>('idle');

	useEffect(() => {
		setAlreadySubmitted(hasSubmittedFeedback(sellerId));
		setComment('');
		setErrorMsg('');
		setModel('');
		setName('');
		setState('idle');
	}, [sellerId]);

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

		setState('submitting');
		setErrorMsg('');

		const result = await submitFeedback({
			comment: comment.trim(),
			email: email.trim().toLowerCase(),
			model: model.trim(),
			name: name.trim(),
			seller_id: sellerId,
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
						<label for="feedback-name">Nombre o alias</label>
						<input
							id="feedback-name"
							maxLength={50}
							onInput={(e) => setName((e.target as HTMLInputElement).value)}
							required
							type="text"
							value={name}
						/>
					</div>
					<div class="feedback-field">
						<label for="feedback-email">Email (no se mostrara publicamente)</label>
						<input
							id="feedback-email"
							onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
							required
							type="email"
							value={email}
						/>
					</div>
				</div>
				<div class="feedback-field">
					<label for="feedback-model">Modelo que compraste</label>
					<input
						id="feedback-model"
						maxLength={100}
						onInput={(e) => setModel((e.target as HTMLInputElement).value)}
						placeholder="Ej: Liger Zero, Shield Liger DCS-J..."
						required
						type="text"
						value={model}
					/>
				</div>
				<div class="feedback-field">
					<label for="feedback-comment">Comentario</label>
					<textarea
						id="feedback-comment"
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
				{errorMsg && <p class="feedback-error">{errorMsg}</p>}
				<p class="feedback-disclaimer">Al enviar, aceptas que almacenemos tu nombre y correo para gestionar tu comentario. Tu correo no sera visible publicamente ni compartido con terceros.</p>
				<button class="feedback-submit-btn" disabled={state === 'submitting'} type="submit">
					{state === 'submitting' ? 'Enviando...' : 'Enviar comentario'}
				</button>
			</form>
		</div>
	);
}
