const { requireAuth } = require('./_lib/auth');
const { supabase } = require('./_lib/supabase');

module.exports = async function handler(req, res) {
	if (!requireAuth(req)) {
		return res.status(401).json({ error: 'No autorizado' });
	}

	const [feedback, comments, suggestions] = await Promise.all([
		supabase.from('seller_feedback').select('id', { count: 'exact', head: true }).eq('approved', false),
		supabase.from('curiosidad_comments').select('id', { count: 'exact', head: true }).eq('approved', false),
		supabase.from('seller_suggestions').select('id', { count: 'exact', head: true }),
	]);

	res.json({
		commentsCount: comments.count ?? 0,
		feedbackCount: feedback.count ?? 0,
		suggestionsCount: suggestions.count ?? 0,
	});
};
