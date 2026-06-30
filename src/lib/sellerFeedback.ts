import { supabase } from './supabase';

const FEEDBACK_SUBMITTED_KEY = 'thecorezi_feedback_submitted';

export interface Feedback {
	comment: string;
	created_at: string;
	model: string;
	name: string;
}

const cache: Record<string, Feedback[]> = {};
const pending: Record<string, Promise<Feedback[]>> = {};

export async function fetchFeedback(sellerId: string): Promise<Feedback[]> {
	if (cache[sellerId]) return cache[sellerId];
	if (pending[sellerId]) return pending[sellerId];

	pending[sellerId] = supabase
		.from('seller_feedback')
		.select('comment, created_at, model, name')
		.eq('seller_id', sellerId)
		.order('created_at', { ascending: false })
		.then(({ data }) => {
			const result = (data ?? []) as Feedback[];
			cache[sellerId] = result;
			delete pending[sellerId];
			return result;
		});

	return pending[sellerId];
}

export function hasSubmittedFeedback(sellerId: string): boolean {
	try {
		const submitted: string[] = JSON.parse(localStorage.getItem(FEEDBACK_SUBMITTED_KEY) || '[]');
		return submitted.includes(sellerId);
	} catch {
		return false;
	}
}

export function invalidateFeedbackCache(sellerId: string): void {
	delete cache[sellerId];
}

export function markFeedbackSubmitted(sellerId: string): void {
	try {
		const submitted: string[] = JSON.parse(localStorage.getItem(FEEDBACK_SUBMITTED_KEY) || '[]');
		if (!submitted.includes(sellerId)) {
			submitted.push(sellerId);
			localStorage.setItem(FEEDBACK_SUBMITTED_KEY, JSON.stringify(submitted));
		}
	} catch {
		localStorage.setItem(FEEDBACK_SUBMITTED_KEY, JSON.stringify([sellerId]));
	}
}

export async function submitFeedback(params: {
	comment: string;
	email: string;
	model: string;
	name: string;
	seller_id: string;
}): Promise<{ error: string | null }> {
	const { error } = await supabase
		.from('seller_feedback')
		.insert(params);

	if (error) {
		if (error.code === '23505') {
			return { error: 'Ya dejaste un comentario para este vendedor.' };
		}
		return { error: 'Error al enviar tu comentario. Intenta de nuevo.' };
	}

	invalidateFeedbackCache(params.seller_id);
	markFeedbackSubmitted(params.seller_id);
	return { error: null };
}
