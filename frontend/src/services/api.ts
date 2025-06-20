import { auth } from '../firebase'; // Import your auth instance from your firebase.ts file

// !!! IMPORTANT: Replace this with your actual Cloud Run service URL !!!
const BASE_URL = 'https://shifted-os-backend-732920301940.asia-southeast2.run.app'; 

// --- HELPER FUNCTION ---
// This automatically gets the current user's token and creates the auth header.
const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated. Cannot make API call.");
  const token = await user.getIdToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};
//
// --- API FUNCTIONS ---

// PROJECTS
export const createProject = async (projectData: any) => {
  const response = await fetch(`${BASE_URL}/api/projects`, { method: 'POST', headers: await getAuthHeaders(), body: JSON.stringify(projectData) });
  if (!response.ok) throw new Error('Failed to create project');
  return response.json();
};
export const updateProject = async (id: string, projectData: any) => {
  const response = await fetch(`${BASE_URL}/api/projects/${id}`, { method: 'PUT', headers: await getAuthHeaders(), body: JSON.stringify(projectData) });
  if (!response.ok) throw new Error('Failed to update project');
  return response.json();
};
export const deleteProject = async (id: string) => {
  const response = await fetch(`${BASE_URL}/api/projects/${id}`, { method: 'DELETE', headers: await getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to delete project');
};

// TASKS
export const createTask = async (taskData: any) => {
  const response = await fetch(`${BASE_URL}/api/tasks`, { method: 'POST', headers: await getAuthHeaders(), body: JSON.stringify(taskData) });
  if (!response.ok) throw new Error('Failed to create task');
  return response.json();
};
export const updateTask = async (id: string, taskData: any) => {
  const response = await fetch(`${BASE_URL}/api/tasks/${id}`, { method: 'PUT', headers: await getAuthHeaders(), body: JSON.stringify(taskData) });
  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
};
export const deleteTask = async (id: string) => {
  const response = await fetch(`${BASE_URL}/api/tasks/${id}`, { method: 'DELETE', headers: await getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to delete task');
};
