import { describe, expect, it } from 'vitest';
import type { Zoid } from '../src/types/zoid';

describe('Zoid type', () => {
	it('should accept a valid zoid object with DAY precision', () => {
		const zoid: Zoid = {
			brand: 'Kotobukiya',
			description: 'Liger Zero con armadura CAS',
			features: ['Falcon Wings bañadas en oro', 'Dos figuras de piloto'],
			id: '123',
			image_url: 'https://example.com/liger.jpg',
			launch_date: 1748736000000,
			launch_date_precission: 'DAY',
			line: 'HMM',
			model_code: 'RPZ-14',
			name: 'Liger Zero',
			official_link: 'https://example.com',
			reserve_date: 1742083200000,
			reserve_date_precision: 'DAY',
		};

		expect(zoid.name).toBe('Liger Zero');
		expect(zoid.brand).toBe('Kotobukiya');
	});

	it('should accept null optional fields and MONTH precision', () => {
		const zoid: Zoid = {
			brand: 'Takara Tomy',
			description: 'Próximamente',
			features: null,
			id: '456',
			image_url: null,
			launch_date: null,
			launch_date_precission: 'MONTH',
			line: 'Zoids Wild',
			model_code: 'ZW-01',
			name: 'Blade Liger',
			official_link: null,
			reserve_date: null,
			reserve_date_precision: 'MONTH',
		};

		expect(zoid.launch_date).toBeNull();
		expect(zoid.features).toBeNull();
		expect(zoid.launch_date_precission).toBe('MONTH');
	});

	it('should accept YEAR precision', () => {
		const zoid: Zoid = {
			brand: 'Kotobukiya',
			description: 'Sin fecha definida',
			features: null,
			id: '789',
			image_url: null,
			launch_date: null,
			launch_date_precission: 'YEAR',
			line: 'HMM',
			model_code: 'RPZ-14',
			name: 'Geno Saurer',
			official_link: null,
			reserve_date: null,
			reserve_date_precision: 'YEAR',
		};

		expect(zoid.launch_date_precission).toBe('YEAR');
		expect(zoid.reserve_date_precision).toBe('YEAR');
	});
});
