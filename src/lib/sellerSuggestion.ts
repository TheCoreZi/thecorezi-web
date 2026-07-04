import { supabase } from './supabase';

export interface SellerSuggestionParams {
	cons: string[];
	country: string;
	description: string;
	link: string;
	name: string;
	pros: string[];
}

export async function submitSellerSuggestion(params: SellerSuggestionParams): Promise<{ error: string | null }> {
	const { error } = await supabase
		.from('seller_suggestions')
		.insert(params);

	if (error) {
		return { error: 'Error al enviar tu sugerencia. Intenta de nuevo.' };
	}

	return { error: null };
}
