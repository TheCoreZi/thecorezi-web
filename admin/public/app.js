const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

let currentTab = 'dashboard';
let feedbackPage = 0;
let commentsPage = 0;

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
	['dashboard', 'feedback', 'comments', 'curiosidades', 'noticias'].forEach((t) => {
		$(`#tab-${t}`).classList.toggle('hidden', t !== tab);
	});

	if (tab === 'feedback') loadFeedback(0);
	if (tab === 'comments') loadComments(0);
}

async function loadDashboard() {
	const data = await api('dashboard');
	if (!data) return;
	$('#feedback-count').textContent = data.feedbackCount;
	$('#comments-count').textContent = data.commentsCount;
}

function renderTable(items, columns, actions) {
	if (items.length === 0) return '<div class="empty">No hay items pendientes.</div>';

	const header = columns.map((c) => `<th>${c.label}</th>`).join('') + '<th>Acciones</th>';
	const rows = items.map((item) => {
		const cells = columns.map((c) => {
			const val = item[c.key] ?? '';
			const cls = c.class ? ` class="${c.class}"` : '';
			return `<td${cls}>${val}</td>`;
		}).join('');
		const btns = `<td class="actions">
			<button class="btn btn-approve" data-id="${item.id}" data-action="approve">Aprobar</button>
			<button class="btn btn-delete" data-id="${item.id}" data-action="delete">Eliminar</button>
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

	container.innerHTML = renderTable(data.items, columns) + renderPagination(page, data.total, 25);

	container.querySelectorAll('.btn-approve, .btn-delete').forEach((btn) => {
		btn.addEventListener('click', () => handleAction('feedback', btn));
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

// Slug auto-generation
$('#cur-title').addEventListener('input', (e) => {
	const slug = e.target.value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
	$('#cur-slug').value = slug;
});

// Publish curiosidad
$('#cur-publish').addEventListener('click', async () => {
	const msgEl = $('#curiosidad-msg');
	const btn = $('#cur-publish');
	const fields = {
		content: $('#cur-content').value,
		image_url: $('#cur-image').value,
		slug: $('#cur-slug').value,
		summary: $('#cur-summary').value,
		title: $('#cur-title').value,
	};

	if (!fields.title || !fields.summary || !fields.image_url || !fields.content) {
		msgEl.innerHTML = '<div class="create-error">Todos los campos son obligatorios.</div>';
		return;
	}

	btn.disabled = true;
	const data = await api('curiosidades', { method: 'POST', body: fields });
	btn.disabled = false;

	if (!data) return;
	if (data.error) {
		msgEl.innerHTML = `<div class="create-error">${data.error}</div>`;
		return;
	}

	msgEl.innerHTML = '<div class="create-success">Curiosidad publicada correctamente.</div>';
	$('#cur-title').value = '';
	$('#cur-slug').value = '';
	$('#cur-summary').value = '';
	$('#cur-image').value = '';
	$('#cur-content').value = '';
	setTimeout(() => { msgEl.innerHTML = ''; }, 3000);
});

// Publish noticia
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
	const data = await api('noticias', { method: 'POST', body: fields });
	btn.disabled = false;

	if (!data) return;
	if (data.error) {
		msgEl.innerHTML = `<div class="create-error">${data.error}</div>`;
		return;
	}

	msgEl.innerHTML = '<div class="create-success">Noticia publicada correctamente.</div>';
	$('#news-title').value = '';
	$('#news-summary').value = '';
	$('#news-image').value = '';
	$('#news-link').value = '';
	$('#news-content').value = '';
	setTimeout(() => { msgEl.innerHTML = ''; }, 3000);
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
