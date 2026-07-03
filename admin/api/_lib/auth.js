const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'admin_token';
const MAX_AGE = 86400;

function signToken(username) {
	return jwt.sign({ sub: username }, process.env.JWT_SECRET, { expiresIn: MAX_AGE });
}

function verifyToken(token) {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch {
		return null;
	}
}

function getTokenFromCookies(cookieHeader) {
	if (!cookieHeader) return null;
	const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
	return match ? match[1] : null;
}

function requireAuth(req) {
	const token = getTokenFromCookies(req.headers.cookie);
	if (!token) return null;
	return verifyToken(token);
}

function setCookie(token) {
	return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${MAX_AGE}`;
}

function clearCookie() {
	return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

module.exports = { clearCookie, requireAuth, setCookie, signToken };
