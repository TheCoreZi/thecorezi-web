import { createClient } from '@supabase/supabase-js';
import { marked } from 'marked';
import { useState } from 'preact/hooks';

interface Props {
	serviceKey: string;
	supabaseUrl: string;
}

function toSlug(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

function renderMarkdown(content: string): string {
	return marked.parse(content, { async: false }) as string;
}

export default function CuriosidadesAdmin({ serviceKey, supabaseUrl }: Props) {
	const [content, setContent] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [saved, setSaved] = useState(false);
	const [saving, setSaving] = useState(false);
	const [slug, setSlug] = useState('');
	const [slugTouched, setSlugTouched] = useState(false);
	const [summary, setSummary] = useState('');
	const [title, setTitle] = useState('');

	const admin = createClient(supabaseUrl, serviceKey);

	function handleTitleChange(value: string) {
		setTitle(value);
		if (!slugTouched) setSlug(toSlug(value));
	}

	function handleSlugChange(value: string) {
		setSlugTouched(true);
		setSlug(value);
	}

	async function handlePublish() {
		if (!title || !slug || !summary || !imageUrl || !content) return;
		setSaving(true);

		const { error } = await admin
			.from('Curiosidades')
			.insert({ content, image_url: imageUrl, slug, summary, title });

		if (error) {
			alert(`Error: ${error.message}`);
		} else {
			setContent('');
			setImageUrl('');
			setSlug('');
			setSlugTouched(false);
			setSummary('');
			setTitle('');
			setSaved(true);
			setTimeout(() => setSaved(false), 3000);
		}
		setSaving(false);
	}

	const canPublish = title && slug && summary && imageUrl && content && !saving;

	return (
		<div class="admin-container">
			<div class="admin-header">
				<h1 class="admin-title">Nueva Curiosidad</h1>
			</div>

			{saved && <div class="curiosidades-admin-success">Curiosidad publicada correctamente.</div>}

			<div class="curiosidades-admin-layout">
				<div class="curiosidades-admin-form">
					<label class="curiosidades-admin-field">
						<span>Título</span>
						<input
							onInput={(e) => handleTitleChange((e.target as HTMLInputElement).value)}
							placeholder="¿Qué son los X-Zoids?"
							type="text"
							value={title}
						/>
					</label>

					<label class="curiosidades-admin-field">
						<span>Slug</span>
						<input
							onInput={(e) => handleSlugChange((e.target as HTMLInputElement).value)}
							placeholder="que-son-los-x-zoids"
							type="text"
							value={slug}
						/>
					</label>

					<label class="curiosidades-admin-field">
						<span>Summary</span>
						<input
							onInput={(e) => setSummary((e.target as HTMLInputElement).value)}
							placeholder="Breve descripción para el listado"
							type="text"
							value={summary}
						/>
					</label>

					<label class="curiosidades-admin-field">
						<span>Imagen URL</span>
						<input
							onInput={(e) => setImageUrl((e.target as HTMLInputElement).value)}
							placeholder="https://..."
							type="text"
							value={imageUrl}
						/>
					</label>

					<label class="curiosidades-admin-field">
						<span>Contenido (Markdown)</span>
						<textarea
							class="curiosidades-admin-textarea"
							onInput={(e) => setContent((e.target as HTMLTextAreaElement).value)}
							placeholder="Escribe el contenido en markdown..."
							value={content}
						/>
					</label>

					<button
						class="admin-btn admin-btn--approve curiosidades-admin-publish"
						disabled={!canPublish}
						onClick={handlePublish}
						type="button"
					>
						{saving ? 'Publicando...' : 'Publicar'}
					</button>
				</div>

				<div class="curiosidades-admin-preview">
					<h2 class="curiosidades-admin-preview-label">Preview</h2>
					<div class="news-detail">
						{title && <h1 class="news-detail-title">{title}</h1>}
						{summary && <p class="curiosidades-admin-preview-summary">{summary}</p>}
						<div class="news-detail-body">
							{imageUrl && <img alt="" class="news-detail-image" src={imageUrl} />}
							{content && (
								<div class="news-detail-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
