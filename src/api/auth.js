import { request} from './client.js';
export const register = (email, password) =>
	request('/auth/register', { method: 'POST', body: { email, password }});
export const login = (email, password) =>
	request('/auth/login', { method: 'POST', form: { username: email, password }});
export const getMe = () => request('/auth/me');