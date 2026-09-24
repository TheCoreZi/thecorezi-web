const { requireAuth } = require('./_lib/auth');
const { prepareImageUpload } = require('./_lib/image-upload');
const { supabase } = require('./_lib/supabase');

module.exports = async function handler(req, res) {
	if (!requireAuth(req)) {
		return res.status(401).json({ error: 'No autorizado' });
	}

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

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
};
