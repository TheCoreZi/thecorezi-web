import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'admin_token';
const MAX_AGE = 86400;

export function signToken(username) {
	return jwt.sign({ sub: username }, SECRET, { expiresIn: MAX_AGE });
}

export function verifyToken(token) {
	try {
		return jwt.verify(token, SECRET);
	} catch {
		return null;
	}
}

export function getTokenFromCookies(cookieHeader) {
	if (!cookieHeader) return null;
	const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
	return match ? match[1] : null;
}

export function requireAuth(req) {
	const token = getTokenFromCookies(req.headers.cookie);
	if (!token) return null;
	return verifyToken(token);
}

export function setCookie(token) {
	return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${MAX_AGE}`;
}

export function clearCookie() {
	return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}
