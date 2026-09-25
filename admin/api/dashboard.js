const { requireAuth } = require('./_lib/auth');
const { prepareImageUpload } = require('./_lib/image-upload');
const { supabase } = require('./_lib/supabase');

module.exports = async function handler(req, res) {
	if (!requireAuth(req)) {
		return res.status(401).json({ error: 'No autorizado' });
	}
	if (req.method === 'POST') return createImageUpload(req, res);
	if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

	const [feedback, comments, sellers, suggestions] = await Promise.all([
		supabase.from('seller_feedback').select('id', { count: 'exact', head: true }).eq('approved', false),
		supabase.from('curiosidad_comments').select('id', { count: 'exact', head: true }).eq('approved', false),
		supabase.from('sellers').select('id', { count: 'exact', head: true }),
		supabase.from('seller_suggestions').select('id', { count: 'exact', head: true }),
	]);

	res.json({
		commentsCount: comments.count ?? 0,
		feedbackCount: feedback.count ?? 0,
		sellersCount: sellers.count ?? 0,
		suggestionsCount: suggestions.count ?? 0,
	});
};

async function createImageUpload(req, res) {
	try {
		const { bucket, path } = prepareImageUpload(req.body);
		const storage = supabase.storage.from(bucket);
		const { data, error } = await storage.createSignedUploadUrl(path, { upsert: false });
		if (error) return res.status(400).json({ error: error.message });

		const { data: publicUrlData } = storage.getPublicUrl(path);
		return res.json({ publicUrl: publicUrlData.publicUrl, signedUrl: data.signedUrl });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
}
