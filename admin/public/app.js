const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// Themes
const themes = {
	helic: {
		'--color-bg': '#0b1a2e', '--color-surface': '#112240', '--color-primary': '#1a6bb5',
		'--color-accent': '#e8a020', '--color-highlight': '#ffa200', '--color-negative': '#e74c3c',
		'--color-positive': '#2ecc71', '--color-scrim': '#000000', '--color-shadow': '#000000',
		'--color-text': '#e0e8f0', '--color-text-contrast': '#ffffff', '--color-text-muted': '#7a9bbf',
	},
	zenebas: {
		'--color-bg': '#0a0505', '--color-surface': '#151010', '--color-primary': '#6b1515',
		'--color-accent': '#e03030', '--color-highlight': '#ff5040', '--color-negative': '#ff6b6b',
		'--color-positive': '#6bff8a', '--color-scrim': '#000000', '--color-shadow': '#000000',
		'--color-text': '#f0e0e0', '--color-text-contrast': '#ffffff', '--color-text-muted': '#aa6060',
	},
	guylos: {
		'--color-bg': '#1a0808', '--color-surface': '#2a0e0e', '--color-primary': '#601820',
		'--color-accent': '#d03040', '--color-highlight': '#ff5050', '--color-negative': '#ff6b6b',
		'--color-positive': '#6bff8a', '--color-scrim': '#000000', '--color-shadow': '#000000',
		'--color-text': '#f5d0d0', '--color-text-contrast': '#ffffff', '--color-text-muted': '#b26d6d',
	},
	'neo-zenebas': {
		'--color-bg': '#f0f0f0', '--color-surface': '#e0e0e0', '--color-primary': '#c0c0c0',
		'--color-accent': '#1a1a1a', '--color-highlight': '#404040', '--color-negative': '#c0392b',
		'--color-positive': '#27ae60', '--color-scrim': '#222222', '--color-shadow': '#cccbcb',
		'--color-text': '#1a1a1a', '--color-text-contrast': '#ffffff', '--color-text-muted': '#606060',
	},
	'dark-army': {
		'--color-bg': '#050505', '--color-surface': '#0a0a0a', '--color-primary': '#1a3a28',
		'--color-accent': '#0bdd5f', '--color-highlight': '#2d9b5e', '--color-negative': '#ff4444',
		'--color-positive': '#0bdd5f', '--color-scrim': '#000000', '--color-shadow': '#000000',
		'--color-text': '#c8e8d0', '--color-text-contrast': '#ffffff', '--color-text-muted': '#4a8a60',
	},
};

function applyTheme(name) {
	const theme = themes[name];
	if (!theme) return;
	Object.entries(theme).forEach(([prop, value]) => {
		document.documentElement.style.setProperty(prop, value);
	});
	localStorage.setItem('theme', name);
	$$('.theme-option').forEach((btn) => {
		btn.classList.toggle('active', btn.dataset.theme === name);
	});
}

applyTheme(localStorage.getItem('theme') || 'helic');

$('#theme-toggle').addEventListener('click', () => {
	$('#theme-dropdown').classList.toggle('hidden');
});

$$('.theme-option').forEach((btn) => {
	btn.addEventListener('click', () => {
		applyTheme(btn.dataset.theme);
		$('#theme-dropdown').classList.add('hidden');
	});
});

document.addEventListener('click', (e) => {
	if (!e.target.closest('.theme-selector')) {
		$('#theme-dropdown').classList.add('hidden');
	}
});

let currentTab = 'dashboard';
let commentsPage = 0;
let curSearchTimeout = null;
let editingCurId = null;
let editingLanzId = null;
let editingNewsId = null;
let feedbackPage = 0;
let lanzFeatures = [];
let lanzPage = 0;
let lanzSearchTimeout = null;
let newsSearchTimeout = null;

async function api(path, opts = {}) {
	const res = await fetch(`/api/${path}`, {
		headers: { 'Content-Type': 'application/json' },
		...opts,
		body: opts.body ? JSON.stringify(opts.body) : undefined,
	});
	if (res.status === 401) {
		showLogin();
		return null;
	}
	return res.json();
}

function showLogin() {
	$('#login-view').classList.remove('hidden');
	$('#app-view').classList.add('hidden');
}

function showApp() {
	$('#login-view').classList.add('hidden');
	$('#app-view').classList.remove('hidden');
}

function switchTab(tab) {
	currentTab = tab;
	$$('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === tab));
	['dashboard', 'feedback', 'comments', 'curiosidades', 'lanzamientos', 'noticias'].forEach((t) => {
		$(`#tab-${t}`).classList.toggle('hidden', t !== tab);
	});

	if (tab === 'curiosidades') showCurList();
	if (tab === 'feedback') loadFeedback(0);
	if (tab === 'comments') loadComments(0);
	if (tab === 'lanzamientos') showLanzList();
	if (tab === 'noticias') showNewsList();
}

async function loadDashboard() {
	const data = await api('dashboard');
	if (!data) return;
	$('#feedback-count').textContent = data.feedbackCount;
	$('#comments-count').textContent = data.commentsCount;
}

function renderTable(items, columns, extraButtons) {
	if (items.length === 0) return '<div class="empty">No hay items pendientes.</div>';

	const header = columns.map((c) => `<th>${c.label}</th>`).join('') + '<th>Acciones</th>';
	const rows = items.map((item) => {
		const cells = columns.map((c) => {
			const val = item[c.key] ?? '';
			const cls = c.class ? ` class="${c.class}"` : '';
			return `<td${cls} data-label="${c.label}">${val}</td>`;
		}).join('');
		const extra = extraButtons ? extraButtons(item) : '';
		const btns = `<td class="actions">
			<button class="btn btn-approve" data-id="${item.id}" data-action="approve">Aprobar</button>
			<button class="btn btn-delete" data-id="${item.id}" data-action="delete">Eliminar</button>
			${extra}
		</td>`;
		return `<tr>${cells}${btns}</tr>`;
	}).join('');

	return `<div class="table-wrap"><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderPagination(page, total, pageSize) {
	const totalPages = Math.ceil(total / pageSize);
	if (totalPages <= 1) return '';
	return `<div class="pagination">
		<button data-page="${page - 1}" ${page === 0 ? 'disabled' : ''}>Anterior</button>
		<span class="page-info">${page + 1} / ${totalPages}</span>
		<button data-page="${page + 1}" ${page >= totalPages - 1 ? 'disabled' : ''}>Siguiente</button>
	</div>`;
}

async function loadFeedback(page) {
	feedbackPage = page;
	const container = $('#feedback-content');
	container.innerHTML = '<div class="loading">Cargando...</div>';

	const data = await api(`feedback?page=${page}`);
	if (!data) return;

	const columns = [
		{ key: 'seller_id', label: 'Vendedor' },
		{ key: 'name', label: 'Nombre' },
		{ key: 'email', label: 'Email', class: 'cell-email' },
		{ key: 'model', label: 'Modelo' },
		{ key: 'comment', label: 'Comentario', class: 'cell-comment' },
	];

	const proofBtn = (item) => `<button class="btn btn-proof" data-email="${item.email}" data-name="${item.name}" data-comment="${(item.comment || '').replace(/"/g, '&quot;')}" data-model="${item.model || ''}" data-seller="${item.seller_id || ''}">Pedir Pruebas</button>`;

	container.innerHTML = renderTable(data.items, columns, proofBtn) + renderPagination(page, data.total, 25);

	container.querySelectorAll('.btn-approve, .btn-delete').forEach((btn) => {
		btn.addEventListener('click', () => handleAction('feedback', btn));
	});
	container.querySelectorAll('.btn-proof').forEach((btn) => {
		btn.addEventListener('click', () => openProofModal(btn));
	});
	container.querySelectorAll('.pagination button:not([disabled])').forEach((btn) => {
		btn.addEventListener('click', () => loadFeedback(parseInt(btn.dataset.page)));
	});
}

async function loadComments(page) {
	commentsPage = page;
	const container = $('#comments-content');
	container.innerHTML = '<div class="loading">Cargando...</div>';

	const data = await api(`comments?page=${page}`);
	if (!data) return;

	const columns = [
		{ key: 'curiosidad_title', label: 'Curiosidad' },
		{ key: 'name', label: 'Nombre' },
		{ key: 'email', label: 'Email', class: 'cell-email' },
		{ key: 'comment', label: 'Comentario', class: 'cell-comment' },
	];

	container.innerHTML = renderTable(data.items, columns) + renderPagination(page, data.total, 25);

	container.querySelectorAll('.btn-approve, .btn-delete').forEach((btn) => {
		btn.addEventListener('click', () => handleAction('comments', btn));
	});
	container.querySelectorAll('.pagination button:not([disabled])').forEach((btn) => {
		btn.addEventListener('click', () => loadComments(parseInt(btn.dataset.page)));
	});
}

async function handleAction(type, btn) {
	const id = btn.dataset.id;
	const action = btn.dataset.action;
	const row = btn.closest('tr');

	btn.disabled = true;
	await api(type, { method: 'POST', body: { action, id } });
	row.remove();
	loadDashboard();
}

// Proof modal
let proofEmail = '';

function openProofModal(btn) {
	proofEmail = btn.dataset.email;
	$('#proof-first-name').value = btn.dataset.name || '';
	$('#proof-topic').value = btn.dataset.model || '';
	$('#proof-context').value = btn.dataset.seller || '';
	$('#proof-comment').value = btn.dataset.comment || '';
	$('#proof-msg').innerHTML = '';
	$('#proof-modal').classList.remove('hidden');
}

$('#proof-cancel').addEventListener('click', () => {
	$('#proof-modal').classList.add('hidden');
});

$('#proof-send').addEventListener('click', async () => {
	const fields = {
		comment: $('#proof-comment').value,
		context: $('#proof-context').value,
		email: proofEmail,
		first_name: $('#proof-first-name').value,
		topic: $('#proof-topic').value,
	};

	if (!fields.first_name || !fields.topic || !fields.context || !fields.comment) {
		$('#proof-msg').innerHTML = '<div class="create-error">Todos los campos son obligatorios.</div>';
		return;
	}

	$('#proof-send').disabled = true;
	const data = await api('request-proof', { method: 'POST', body: fields });
	$('#proof-send').disabled = false;

	if (!data) return;
	if (data.error) {
		$('#proof-msg').innerHTML = `<div class="create-error">${data.error}</div>`;
		return;
	}

	$('#proof-msg').innerHTML = '<div class="create-success">Correo enviado correctamente.</div>';
	setTimeout(() => { $('#proof-modal').classList.add('hidden'); }, 1500);
});

// Login form
$('#login-form').addEventListener('submit', async (e) => {
	e.preventDefault();
	const errEl = $('#login-error');
	errEl.classList.add('hidden');

	const data = await fetch('/api/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			password: $('#password').value,
			username: $('#username').value,
		}),
	}).then((r) => r.json());

	if (data.error) {
		errEl.textContent = data.error;
		errEl.classList.remove('hidden');
		return;
	}

	showApp();
	loadDashboard();
});

// Logout
$('#logout-btn').addEventListener('click', async () => {
	await api('login', { method: 'DELETE' });
	showLogin();
});

// Tabs
$$('.tab').forEach((tab) => {
	tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

// Preview helpers
function renderPreview(title, summary, image, content) {
	let html = '';
	if (title) html += `<h1 class="news-detail-title">${title}</h1>`;
	if (summary) html += `<p class="preview-summary">${summary}</p>`;
	if (image) html += `<img class="news-detail-image" src="${image}" alt="" />`;
	if (content) html += `<div class="news-detail-content">${marked.parse(content)}</div>`;
	return html || '<p style="color:var(--color-text-muted)">Escribe algo para ver el preview...</p>';
}

function updateCuriosidadPreview() {
	$('#cur-preview').innerHTML = renderPreview(
		$('#cur-title').value, $('#cur-summary').value, $('#cur-image').value, $('#cur-content').value
	);
}

function updateNoticiaPreview() {
	$('#news-preview').innerHTML = renderPreview(
		$('#news-title').value, $('#news-summary').value, $('#news-image').value, $('#news-content').value
	);
}

// Curiosidad live preview
['#cur-title', '#cur-summary', '#cur-image', '#cur-content'].forEach((sel) => {
	$(sel).addEventListener('input', updateCuriosidadPreview);
});

// Noticia live preview
['#news-title', '#news-summary', '#news-image', '#news-content'].forEach((sel) => {
	$(sel).addEventListener('input', updateNoticiaPreview);
});

function toSlug(text) {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

// Slug auto-generation (only when creating)
$('#cur-title').addEventListener('input', (e) => {
	if (!editingCurId) {
		$('#cur-slug').value = toSlug(e.target.value);
	}
});

// Curiosidades list
let curItems = [];

async function loadCuriosidades(page) {
	const container = $('#cur-list-content');
	container.innerHTML = '<div class="loading">Cargando...</div>';

	const search = $('#cur-search').value;
	const params = `page=${page}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
	const data = await api(`curiosidades?${params}`);
	if (!data) return;

	curItems = data.items;

	if (data.items.length === 0) {
		container.innerHTML = '<div class="empty">No hay curiosidades.</div>';
		return;
	}

	const header = '<th>Titulo</th><th>Summary</th><th>Estado</th><th>Fecha</th>';
	const rows = data.items.map((c) => {
		const date = c.published_at ? new Date(c.published_at).toLocaleDateString('es') : '-';
		const summary = (c.summary || '').length > 80 ? c.summary.substring(0, 80) + '...' : (c.summary || '');
		const estado = c.is_published ? '<span class="badge badge-published">Publicado</span>' : '<span class="badge badge-draft">Borrador</span>';
		return `<tr class="clickable-row" data-id="${c.id}">
			<td data-label="Titulo">${c.title}</td>
			<td class="cell-comment" data-label="Summary">${summary}</td>
			<td data-label="Estado">${estado}</td>
			<td class="cell-date" data-label="Fecha">${date}</td>
		</tr>`;
	}).join('');

	container.innerHTML = `<div class="table-wrap"><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></div>`
		+ renderPagination(page, data.total, 25);

	container.querySelectorAll('.clickable-row').forEach((row) => {
		row.addEventListener('click', () => {
			const item = curItems.find((c) => c.id === row.dataset.id);
			if (item) showCurForm(item);
		});
	});
	container.querySelectorAll('.pagination button:not([disabled])').forEach((btn) => {
		btn.addEventListener('click', () => loadCuriosidades(parseInt(btn.dataset.page)));
	});
}

function showCurForm(item) {
	$('#cur-list-view').classList.add('hidden');
	$('#cur-form-view').classList.remove('hidden');
	$('#curiosidad-msg').innerHTML = '';

	if (item) {
		editingCurId = item.id;
		$('#cur-form-title').textContent = `Editar: ${item.title}`;
		$('#cur-delete').classList.remove('hidden');
		$('#cur-draft').classList[item.is_published ? 'add' : 'remove']('hidden');
		$('#cur-title').value = item.title;
		$('#cur-slug').value = item.slug || '';
		$('#cur-summary').value = item.summary || '';
		$('#cur-image').value = item.image_url || '';
		$('#cur-content').value = item.content || '';
	} else {
		editingCurId = null;
		$('#cur-form-title').textContent = 'Nueva Curiosidad';
		$('#cur-delete').classList.add('hidden');
		$('#cur-draft').classList.remove('hidden');
		$('#cur-title').value = '';
		$('#cur-slug').value = '';
		$('#cur-summary').value = '';
		$('#cur-image').value = '';
		$('#cur-content').value = '';
	}
	$('#cur-preview').innerHTML = '';
	updateCuriosidadPreview();
}

function showCurList() {
	$('#cur-form-view').classList.add('hidden');
	$('#cur-list-view').classList.remove('hidden');
	loadCuriosidades(0);
}

$('#cur-new-btn').addEventListener('click', () => showCurForm(null));
$('#cur-back-btn').addEventListener('click', showCurList);

$('#cur-search').addEventListener('input', () => {
	clearTimeout(curSearchTimeout);
	curSearchTimeout = setTimeout(() => loadCuriosidades(0), 300);
});

async function saveCuriosidad(isPublished) {
	const msgEl = $('#curiosidad-msg');
	const fields = {
		content: $('#cur-content').value,
		image_url: $('#cur-image').value,
		is_published: isPublished,
		slug: $('#cur-slug').value,
		summary: $('#cur-summary').value,
		title: $('#cur-title').value,
	};

	if (!fields.title || !fields.summary || !fields.image_url || !fields.content) {
		msgEl.innerHTML = '<div class="create-error">Todos los campos son obligatorios.</div>';
		return;
	}

	$('#cur-publish').disabled = true;
	$('#cur-draft').disabled = true;
	const method = editingCurId ? 'PUT' : 'POST';
	if (editingCurId) fields.id = editingCurId;

	const data = await api('curiosidades', { method, body: fields });
	$('#cur-publish').disabled = false;
	$('#cur-draft').disabled = false;

	if (!data) return;
	if (data.error) {
		msgEl.innerHTML = `<div class="create-error">${data.error}</div>`;
		return;
	}

	const label = isPublished ? 'Curiosidad publicada' : 'Borrador guardado';
	msgEl.innerHTML = `<div class="create-success">${editingCurId ? 'Curiosidad actualizada' : label} correctamente.</div>`;
	setTimeout(() => { msgEl.innerHTML = ''; }, 3000);

	if (!editingCurId) showCurList();
}

$('#cur-draft').addEventListener('click', () => saveCuriosidad(false));
$('#cur-publish').addEventListener('click', () => saveCuriosidad(true));

$('#cur-delete').addEventListener('click', async () => {
	if (!editingCurId) return;
	if (!confirm('Seguro que quieres eliminar esta curiosidad?')) return;

	const data = await api('curiosidades', { method: 'DELETE', body: { id: editingCurId } });
	if (!data) return;
	if (data.error) {
		$('#curiosidad-msg').innerHTML = `<div class="create-error">${data.error}</div>`;
		return;
	}
	showCurList();
});

// Noticias list
let newsItems = [];

async function loadNoticias(page) {
	const container = $('#news-list-content');
	container.innerHTML = '<div class="loading">Cargando...</div>';

	const search = $('#news-search').value;
	const params = `page=${page}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
	const data = await api(`noticias?${params}`);
	if (!data) return;

	newsItems = data.items;

	if (data.items.length === 0) {
		container.innerHTML = '<div class="empty">No hay noticias.</div>';
		return;
	}

	const header = '<th>Titulo</th><th>Summary</th><th>Fecha</th>';
	const rows = data.items.map((n) => {
		const date = n.published_at ? new Date(n.published_at).toLocaleDateString('es') : '-';
		const summary = (n.summary || '').length > 80 ? n.summary.substring(0, 80) + '...' : (n.summary || '');
		return `<tr class="clickable-row" data-id="${n.id}">
			<td data-label="Titulo">${n.title}</td>
			<td class="cell-comment" data-label="Summary">${summary}</td>
			<td class="cell-date" data-label="Fecha">${date}</td>
		</tr>`;
	}).join('');

	container.innerHTML = `<div class="table-wrap"><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></div>`
		+ renderPagination(page, data.total, 25);

	container.querySelectorAll('.clickable-row').forEach((row) => {
		row.addEventListener('click', () => {
			const item = newsItems.find((n) => n.id === row.dataset.id);
			if (item) showNewsForm(item);
		});
	});
	container.querySelectorAll('.pagination button:not([disabled])').forEach((btn) => {
		btn.addEventListener('click', () => loadNoticias(parseInt(btn.dataset.page)));
	});
}

function showNewsForm(item) {
	$('#news-list-view').classList.add('hidden');
	$('#news-form-view').classList.remove('hidden');
	$('#noticia-msg').innerHTML = '';

	if (item) {
		editingNewsId = item.id;
		$('#news-form-title').textContent = `Editar: ${item.title}`;
		$('#news-delete').classList.remove('hidden');
		$('#news-title').value = item.title;
		$('#news-summary').value = item.summary || '';
		$('#news-image').value = item.image_url || '';
		$('#news-link').value = item.link || '';
		$('#news-content').value = item.content || '';
	} else {
		editingNewsId = null;
		$('#news-form-title').textContent = 'Nueva Noticia';
		$('#news-delete').classList.add('hidden');
		$('#news-title').value = '';
		$('#news-summary').value = '';
		$('#news-image').value = '';
		$('#news-link').value = '';
		$('#news-content').value = '';
	}
	$('#news-preview').innerHTML = '';
	updateNoticiaPreview();
}

function showNewsList() {
	$('#news-form-view').classList.add('hidden');
	$('#news-list-view').classList.remove('hidden');
	loadNoticias(0);
}

$('#news-new-btn').addEventListener('click', () => showNewsForm(null));
$('#news-back-btn').addEventListener('click', showNewsList);

$('#news-search').addEventListener('input', () => {
	clearTimeout(newsSearchTimeout);
	newsSearchTimeout = setTimeout(() => loadNoticias(0), 300);
});

$('#news-publish').addEventListener('click', async () => {
	const msgEl = $('#noticia-msg');
	const btn = $('#news-publish');
	const fields = {
		content: $('#news-content').value,
		image_url: $('#news-image').value,
		link: $('#news-link').value,
		summary: $('#news-summary').value,
		title: $('#news-title').value,
	};

	if (!fields.title || !fields.summary || !fields.image_url || !fields.content) {
		msgEl.innerHTML = '<div class="create-error">Todos los campos son obligatorios (link es opcional).</div>';
		return;
	}

	btn.disabled = true;
	const method = editingNewsId ? 'PUT' : 'POST';
	if (editingNewsId) fields.id = editingNewsId;

	const data = await api('noticias', { method, body: fields });
	btn.disabled = false;

	if (!data) return;
	if (data.error) {
		msgEl.innerHTML = `<div class="create-error">${data.error}</div>`;
		return;
	}

	msgEl.innerHTML = `<div class="create-success">${editingNewsId ? 'Noticia actualizada' : 'Noticia publicada'} correctamente.</div>`;
	setTimeout(() => { msgEl.innerHTML = ''; }, 3000);

	if (!editingNewsId) showNewsList();
});

$('#news-delete').addEventListener('click', async () => {
	if (!editingNewsId) return;
	if (!confirm('Seguro que quieres eliminar esta noticia?')) return;

	const data = await api('noticias', { method: 'DELETE', body: { id: editingNewsId } });
	if (!data) return;
	if (data.error) {
		$('#noticia-msg').innerHTML = `<div class="create-error">${data.error}</div>`;
		return;
	}
	showNewsList();
});

// Lanzamientos helpers
function dateToTimestamp(dateStr) {
	if (!dateStr) return null;
	return new Date(dateStr + 'T00:00:00Z').getTime();
}

function timestampToDateStr(ts) {
	if (!ts) return '';
	return new Date(ts).toISOString().split('T')[0];
}

function formatLanzDate(ts, precision) {
	if (!ts) return 'TBA';
	const d = new Date(ts);
	const opts = { timeZone: 'UTC' };
	if (precision === 'YEAR') return d.toLocaleDateString('es', { ...opts, year: 'numeric' });
	if (precision === 'MONTH') return d.toLocaleDateString('es', { ...opts, year: 'numeric', month: 'short' });
	return d.toLocaleDateString('es', { ...opts, year: 'numeric', month: 'short', day: 'numeric' });
}

function formatLanzPrice(price, currency) {
	if (!price || !currency) return '-';
	return price.toLocaleString('en', { style: 'currency', currency });
}

// Lanzamientos list
let lanzItems = [];

async function loadLanzamientos(page) {
	lanzPage = page;
	const container = $('#lanz-list-content');
	container.innerHTML = '<div class="loading">Cargando...</div>';

	const search = $('#lanz-search').value;
	const params = `page=${page}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
	const data = await api(`lanzamientos?${params}`);
	if (!data) return;

	lanzItems = data.items;

	if (data.items.length === 0) {
		container.innerHTML = '<div class="empty">No hay lanzamientos.</div>';
		return;
	}

	const header = '<th>Nombre</th><th>Marca</th><th>Linea</th><th>Lanzamiento</th><th>Precio</th>';
	const rows = data.items.map((z) => {
		const date = formatLanzDate(z.launch_date, z.launch_date_precission);
		const price = formatLanzPrice(z.retail_price, z.currency);
		return `<tr class="clickable-row" data-id="${z.id}">
			<td data-label="Nombre">${z.name}</td>
			<td data-label="Marca">${z.brand}</td>
			<td data-label="Linea">${z.line}</td>
			<td class="cell-date" data-label="Lanzamiento">${date}</td>
			<td class="cell-price" data-label="Precio">${price}</td>
		</tr>`;
	}).join('');

	container.innerHTML = `<div class="table-wrap"><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></div>`
		+ renderPagination(page, data.total, 25);

	container.querySelectorAll('.clickable-row').forEach((row) => {
		row.addEventListener('click', () => {
			const zoid = lanzItems.find((z) => z.id === row.dataset.id);
			if (zoid) showLanzForm(zoid);
		});
	});
	container.querySelectorAll('.pagination button:not([disabled])').forEach((btn) => {
		btn.addEventListener('click', () => loadLanzamientos(parseInt(btn.dataset.page)));
	});
}

// Lanzamientos form
function showLanzForm(zoid) {
	$('#lanz-list-view').classList.add('hidden');
	$('#lanz-form-view').classList.remove('hidden');
	$('#lanz-msg').innerHTML = '';

	if (zoid) {
		editingLanzId = zoid.id;
		$('#lanz-form-title').textContent = `Editar: ${zoid.name}`;
		$('#lanz-delete').classList.remove('hidden');

		$('#lanz-name').value = zoid.name;
		setSelectOrCustom('lanz-brand', zoid.brand);
		setSelectOrCustom('lanz-line', zoid.line);
		$('#lanz-model-code').value = zoid.model_code || '';
		$('#lanz-scale').value = zoid.scale || '';
		$('#lanz-launch-date').value = timestampToDateStr(zoid.launch_date);
		$('#lanz-launch-precision').value = zoid.launch_date_precission || 'MONTH';
		$('#lanz-reserve-date').value = timestampToDateStr(zoid.reserve_date);
		$('#lanz-reserve-precision').value = zoid.reserve_date_precision || 'MONTH';
		$('#lanz-price').value = zoid.retail_price ?? '';
		$('#lanz-currency').value = zoid.currency || '';
		setSelectOrCustom('lanz-exclusive', zoid.exclusive || '');
		$('#lanz-image').value = zoid.image_url || '';
		updateImagePreview(zoid.image_url);
		$('#lanz-link').value = zoid.official_link || '';
		$('#lanz-description').value = zoid.description || '';
		lanzFeatures = zoid.features ? [...zoid.features] : [];
	} else {
		editingLanzId = null;
		$('#lanz-form-title').textContent = 'Nuevo Lanzamiento';
		$('#lanz-delete').classList.add('hidden');

		$('#lanz-id').value = '';
		$('#lanz-name').value = '';
		$('#lanz-brand').value = '';
		$('#lanz-brand-custom').value = '';
		$('#lanz-brand-custom-wrap').classList.add('hidden');
		$('#lanz-line').value = '';
		$('#lanz-line-custom').value = '';
		$('#lanz-line-custom-wrap').classList.add('hidden');
		$('#lanz-model-code').value = '';
		$('#lanz-scale').value = '';
		$('#lanz-launch-date').value = '';
		$('#lanz-launch-precision').value = 'MONTH';
		$('#lanz-reserve-date').value = '';
		$('#lanz-reserve-precision').value = 'MONTH';
		$('#lanz-price').value = '';
		$('#lanz-currency').value = '';
		$('#lanz-exclusive').value = '';
		$('#lanz-exclusive-custom').value = '';
		$('#lanz-exclusive-custom-wrap').classList.add('hidden');
		$('#lanz-image').value = '';
		updateImagePreview(null);
		$('#lanz-link').value = '';
		$('#lanz-description').value = '';
		lanzFeatures = [];
	}
	renderFeatures();
}

function setSelectOrCustom(selectId, value) {
	const sel = $(`#${selectId}`);
	const customWrap = $(`#${selectId}-custom-wrap`);
	const customInput = $(`#${selectId}-custom`);

	const option = [...sel.options].find((o) => o.value === value);
	if (option && value !== '__custom') {
		sel.value = value;
		if (customWrap) customWrap.classList.add('hidden');
		if (customInput) customInput.value = '';
	} else if (value) {
		sel.value = '__custom';
		if (customWrap) customWrap.classList.remove('hidden');
		if (customInput) customInput.value = value;
	} else {
		sel.value = '';
		if (customWrap) customWrap.classList.add('hidden');
		if (customInput) customInput.value = '';
	}
}

function getSelectOrCustom(selectId) {
	const sel = $(`#${selectId}`);
	if (sel.value === '__custom') {
		return $(`#${selectId}-custom`).value.trim();
	}
	return sel.value;
}

function showLanzList() {
	$('#lanz-form-view').classList.add('hidden');
	$('#lanz-list-view').classList.remove('hidden');
	loadLanzamientos(0);
}

// Features
function renderFeatures() {
	const container = $('#lanz-features-list');
	container.innerHTML = lanzFeatures.map((f, i) =>
		`<span class="lanz-feature-tag">${f} <button data-idx="${i}" class="btn-remove-feature">&times;</button></span>`
	).join('');
	container.querySelectorAll('.btn-remove-feature').forEach((btn) => {
		btn.addEventListener('click', () => {
			lanzFeatures.splice(parseInt(btn.dataset.idx), 1);
			renderFeatures();
		});
	});
}

function addFeature() {
	const input = $('#lanz-feature-input');
	const val = input.value.trim();
	if (!val) return;
	lanzFeatures.push(val);
	input.value = '';
	renderFeatures();
}

$('#lanz-add-feature').addEventListener('click', addFeature);
$('#lanz-feature-input').addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		e.preventDefault();
		addFeature();
	}
});

// Image preview
function updateImagePreview(url) {
	const preview = $('#lanz-image-preview');
	const img = $('#lanz-image-preview-img');
	if (url) {
		img.src = url;
		preview.classList.remove('hidden');
	} else {
		img.src = '';
		preview.classList.add('hidden');
	}
}

$('#lanz-image').addEventListener('input', (e) => {
	updateImagePreview(e.target.value.trim());
});

$('#lanz-image-preview-img').addEventListener('error', () => {
	$('#lanz-image-preview').classList.add('hidden');
});

// Custom select toggles
['lanz-brand', 'lanz-line', 'lanz-exclusive'].forEach((id) => {
	$(`#${id}`).addEventListener('change', (e) => {
		const wrap = $(`#${id}-custom-wrap`);
		if (wrap) wrap.classList.toggle('hidden', e.target.value !== '__custom');
	});
});

// Search
$('#lanz-search').addEventListener('input', () => {
	clearTimeout(lanzSearchTimeout);
	lanzSearchTimeout = setTimeout(() => loadLanzamientos(0), 300);
});

// New button
$('#lanz-new-btn').addEventListener('click', () => showLanzForm(null));

// Back button
$('#lanz-back-btn').addEventListener('click', showLanzList);

// Save
$('#lanz-save').addEventListener('click', async () => {
	const msgEl = $('#lanz-msg');
	const btn = $('#lanz-save');

	const brand = getSelectOrCustom('lanz-brand');
	const line = getSelectOrCustom('lanz-line');
	const exclusive = getSelectOrCustom('lanz-exclusive');

	const fields = {
		brand,
		currency: $('#lanz-currency').value || null,
		description: $('#lanz-description').value,
		exclusive: exclusive || null,
		features: lanzFeatures.length ? lanzFeatures : null,
		image_url: $('#lanz-image').value || null,
		launch_date: dateToTimestamp($('#lanz-launch-date').value),
		launch_date_precission: $('#lanz-launch-precision').value,
		line,
		model_code: $('#lanz-model-code').value || null,
		name: $('#lanz-name').value,
		official_link: $('#lanz-link').value || null,
		reserve_date: dateToTimestamp($('#lanz-reserve-date').value),
		reserve_date_precision: $('#lanz-reserve-precision').value,
		retail_price: $('#lanz-price').value ? parseFloat($('#lanz-price').value) : null,
		scale: $('#lanz-scale').value || null,
	};

	if (!fields.name || !fields.brand || !fields.line || !fields.description) {
		msgEl.innerHTML = '<div class="create-error">Nombre, Marca, Linea y Descripcion son obligatorios.</div>';
		return;
	}

	btn.disabled = true;
	const method = editingLanzId ? 'PUT' : 'POST';
	if (editingLanzId) fields.id = editingLanzId;

	const data = await api('lanzamientos', { method, body: fields });
	btn.disabled = false;

	if (!data) return;
	if (data.error) {
		msgEl.innerHTML = `<div class="create-error">${data.error}</div>`;
		return;
	}

	msgEl.innerHTML = `<div class="create-success">${editingLanzId ? 'Lanzamiento actualizado' : 'Lanzamiento creado'} correctamente.</div>`;
	setTimeout(() => { msgEl.innerHTML = ''; }, 3000);

	if (!editingLanzId) showLanzList();
});

// Delete
$('#lanz-delete').addEventListener('click', async () => {
	if (!editingLanzId) return;
	if (!confirm('Seguro que quieres eliminar este lanzamiento?')) return;

	const data = await api('lanzamientos', { method: 'DELETE', body: { id: editingLanzId } });
	if (!data) return;
	if (data.error) {
		$('#lanz-msg').innerHTML = `<div class="create-error">${data.error}</div>`;
		return;
	}
	showLanzList();
});

// Init
(async () => {
	const data = await api('dashboard');
	if (data) {
		showApp();
		$('#feedback-count').textContent = data.feedbackCount;
		$('#comments-count').textContent = data.commentsCount;
	} else {
		showLogin();
	}
})();
