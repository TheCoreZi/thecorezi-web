export type DatePrecision = 'DAY' | 'MONTH' | 'YEAR';

export interface Zoid {
	brand: string;
	description: string;
	features: string[] | null;
	id: string;
	image_url: string | null;
	launch_date: number | null;
	launch_date_precission: DatePrecision;
	line: string;
	model_code: string | null;
	name: string;
	currency: string | null;
	official_link: string | null;
	reserve_date: number | null;
	reserve_date_precision: DatePrecision;
	retail_price: number | null;
	scale: string | null;
}
