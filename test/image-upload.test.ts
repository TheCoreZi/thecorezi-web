import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { MAX_FILE_SIZE, normalizeFolder, prepareImageUpload } = require('../admin/api/_lib/image-upload');

describe('image upload', () => {
	it('maps each target to its bucket', () => {
		expect(prepareImageUpload(validUpload('curiosity')).bucket).toBe('curiosity');
		expect(prepareImageUpload(validUpload('news')).bucket).toBe('news');
		expect(prepareImageUpload(validUpload('release')).bucket).toBe('zoid-model-images');
	});

	it('normalizes nested folders and creates a unique image name', () => {
		const upload = prepareImageUpload({
			...validUpload('release'),
			fileName: 'Liger Zero.PNG',
			folder: '/HMM/Año 2026/',
		});

		expect(upload.path).toMatch(/^hmm\/ano-2026\/liger-zero-[0-9a-f-]+\.png$/);
	});

	it('uses a requested storage name without a random suffix', () => {
		const upload = prepareImageUpload({
			...validUpload('release'),
			storageName: 'Liger Zero final.jpg',
		});

		expect(upload.path).toBe('liger-zero-final.png');
	});

	it('rejects unsafe folders', () => {
		expect(() => normalizeFolder('hmm/../2026')).toThrow('Ruta de carpeta invalida');
		expect(() => normalizeFolder('hmm//2026')).toThrow('Ruta de carpeta invalida');
	});

	it('rejects unknown targets and invalid files', () => {
		expect(() => prepareImageUpload(validUpload('discord'))).toThrow('Destino de imagen invalido');
		expect(() => prepareImageUpload({ ...validUpload('news'), contentType: 'text/plain' }))
			.toThrow('El archivo debe ser una imagen');
		expect(() => prepareImageUpload({ ...validUpload('news'), size: 0 }))
			.toThrow('La imagen debe pesar como maximo 50 MB');
		expect(() => prepareImageUpload({ ...validUpload('news'), size: MAX_FILE_SIZE + 1 }))
			.toThrow('La imagen debe pesar como maximo 50 MB');
		expect(() => prepareImageUpload({ ...validUpload('news'), storageName: 'folder/image' }))
			.toThrow('El nombre no puede incluir carpetas');
	});
});

function validUpload(target: string) {
	return {
		contentType: 'image/png',
		fileName: 'image.png',
		folder: '',
		size: 1024,
		target,
	};
}
