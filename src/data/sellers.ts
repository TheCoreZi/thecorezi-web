import { supabase } from '../lib/supabase';

export type SellerType = 'community' | 'independent' | 'store';

export interface Seller {
	cons: string[];
	description: string;
	id: string;
	image?: string;
	link: string;
	name: string;
	pros: string[];
	type: SellerType;
}

export interface CountryGroup {
	country: string;
	sellers: Seller[];
}

const COUNTRY_FLAGS: Record<string, string> = {
	GL: '🌎',
	JP: '🇯🇵',
	MX: '🇲🇽',
	PE: '🇵🇪',
};

const COUNTRY_ORDER = ['GL', 'JP', 'MX', 'PE'];

export async function fetchAllSellers(): Promise<Seller[]> {
	const { data, error } = await supabase
		.from('sellers')
		.select('cons, description, id, image, link, name, pros, type');

	if (error) throw new Error(`Failed to fetch sellers: ${error.message}`);
	return (data ?? []) as Seller[];
}

export async function fetchSellersByCountry(): Promise<CountryGroup[]> {
	const { data, error } = await supabase
		.from('sellers')
		.select('cons, country_code, description, id, image, link, name, pros, type');

	if (error) throw new Error(`Failed to fetch sellers: ${error.message}`);

	const grouped = new Map<string, Seller[]>();
	for (const row of data ?? []) {
		const { country_code, ...seller } = row;
		const list = grouped.get(country_code) ?? [];
		list.push(seller as Seller);
		grouped.set(country_code, list);
	}

	return COUNTRY_ORDER
		.filter((code) => grouped.has(code))
		.map((code) => ({
			country: COUNTRY_FLAGS[code] ?? code,
			sellers: grouped.get(code)!,
		}));
}
