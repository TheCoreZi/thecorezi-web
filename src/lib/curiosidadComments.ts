import { supabase } from './supabase';

const COMMENT_SUBMITTED_KEY = 'thecorezi_curiosidad_comment_submitted';

export interface CuriosidadComment {
	comment: string;
	created_at: string;
	name: string;
}

const cache: Record<string, CuriosidadComment[]> = {};
const pending: Record<string, Promise<CuriosidadComment[]>> = {};

export async function fetchComments(curiosidadId: string): Promise<CuriosidadComment[]> {
	if (cache[curiosidadId]) return cache[curiosidadId];
	if (pending[curiosidadId]) return pending[curiosidadId];

	pending[curiosidadId] = supabase
		.from('curiosidad_comments')
		.select('comment, created_at, name')
		.eq('curiosidad_id', curiosidadId)
		.order('created_at', { ascending: false })
		.then(({ data }) => {
			const result = (data ?? []) as CuriosidadComment[];
			cache[curiosidadId] = result;
			delete pending[curiosidadId];
			return result;
		});

	return pending[curiosidadId];
}

export function hasSubmittedComment(curiosidadId: string): boolean {
	try {
		const submitted: string[] = JSON.parse(localStorage.getItem(COMMENT_SUBMITTED_KEY) || '[]');
		return submitted.includes(curiosidadId);
	} catch {
		return false;
	}
}

export function invalidateCommentCache(curiosidadId: string): void {
	delete cache[curiosidadId];
}

export function markCommentSubmitted(curiosidadId: string): void {
	try {
		const submitted: string[] = JSON.parse(localStorage.getItem(COMMENT_SUBMITTED_KEY) || '[]');
		if (!submitted.includes(curiosidadId)) {
			submitted.push(curiosidadId);
			localStorage.setItem(COMMENT_SUBMITTED_KEY, JSON.stringify(submitted));
		}
	} catch {
		localStorage.setItem(COMMENT_SUBMITTED_KEY, JSON.stringify([curiosidadId]));
	}
}

export async function submitComment(params: {
	comment: string;
	curiosidad_id: string;
	email: string;
	name: string;
}): Promise<{ error: string | null }> {
	const { error } = await supabase
		.from('curiosidad_comments')
		.insert(params);

	if (error) {
		if (error.code === '23505') {
			return { error: 'Ya dejaste un comentario para esta curiosidad.' };
		}
		return { error: 'Error al enviar tu comentario. Intenta de nuevo.' };
	}

	invalidateCommentCache(params.curiosidad_id);
	markCommentSubmitted(params.curiosidad_id);
	return { error: null };
}
