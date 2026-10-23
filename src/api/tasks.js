import { request } from './client.js';
export const getTasks = (status) =>
	request(status ? `/tasks?status=${status}` : '/tasks');
export const createTask = (data) =>
	request('/tasks', { method: 'POST', body: data });
export const updateTask = (id, data) =>
	request(`/tasks/${id}`, { method: 'PATCH', body: data });
export const deleteTask = (id) =>
	request(`/tasks/${id}`, { method: 'DELETE' });