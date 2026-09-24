const { randomUUID } = require('crypto');

const BUCKETS = {
	curiosity: 'curiosity',
	news: 'news',
	release: 'zoid-model-images',
};
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MIME_EXTENSIONS = {
	'image/avif': 'avif',
	'image/bmp': 'bmp',
	'image/gif': 'gif',
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/svg+xml': 'svg',
	'image/tiff': 'tiff',
	'image/vnd.microsoft.icon': 'ico',
	'image/webp': 'webp',
};

function prepareImageUpload(body) {
	const { contentType, fileName, folder, size, storageName, target } = body || {};
	validateImageUpload(contentType, fileName, folder, size, storageName, target);

	const normalizedFolder = normalizeFolder(folder);
	const generatedFileName = createFileName(fileName, contentType, storageName);

	return {
		bucket: BUCKETS[target],
		path: normalizedFolder ? `${normalizedFolder}/${generatedFileName}` : generatedFileName,
	};
}

function validateImageUpload(contentType, fileName, folder, size, storageName, target) {
	if (!BUCKETS[target]) throw new Error('Destino de imagen invalido');
	if (typeof contentType !== 'string' || !contentType.startsWith('image/')) {
		throw new Error('El archivo debe ser una imagen');
	}
	if (!Number.isFinite(size) || size <= 0 || size > MAX_FILE_SIZE) {
		throw new Error('La imagen debe pesar como maximo 50 MB');
	}
	if (fileName !== undefined && typeof fileName !== 'string') {
		throw new Error('Nombre de archivo invalido');
	}
	if (folder !== undefined && typeof folder !== 'string') {
		throw new Error('Ruta de carpeta invalida');
	}
	if (storageName !== undefined && typeof storageName !== 'string') {
		throw new Error('Nombre de almacenamiento invalido');
	}
}

function normalizeFolder(folder = '') {
	const trimmedFolder = folder.trim().replace(/^\/+|\/+$/g, '');
	if (!trimmedFolder) return '';

	const segments = trimmedFolder.split('/');
	if (segments.some((segment) => !segment || segment === '.' || segment === '..')) {
		throw new Error('Ruta de carpeta invalida');
	}

	const normalizedSegments = segments.map(toPathSegment);
	if (normalizedSegments.some((segment) => !segment)) {
		throw new Error('Ruta de carpeta invalida');
	}
	return normalizedSegments.join('/');
}

function createFileName(fileName = '', contentType, storageName = '') {
	if (storageName.includes('/') || storageName.includes('\\')) {
		throw new Error('El nombre no puede incluir carpetas');
	}

	const requestedName = storageName.trim() || fileName;
	const baseName = requestedName.replace(/\.[^.]+$/, '');
	const normalizedBaseName = toPathSegment(baseName).slice(0, 60) || 'image';
	const extension = MIME_EXTENSIONS[contentType] || toPathSegment(contentType.slice(6)) || 'image';
	return storageName.trim()
		? `${normalizedBaseName}.${extension}`
		: `${normalizedBaseName}-${randomUUID()}.${extension}`;
}

function toPathSegment(value) {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9_-]+/g, '-')
		.replace(/^-|-$/g, '');
}

module.exports = { MAX_FILE_SIZE, normalizeFolder, prepareImageUpload };
