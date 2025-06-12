import { auth } from '../firebase'; // Import your auth instance

// This is the base URL of your deployed backend service.
// You must get this from your Cloud Run service details.
const BASE_URL = 'https://shifted-os-backend-xxxxxxxxxx-as.a.run.app'; 

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

// --- API FUNCTIONS ---

// PROJECTS
export const getProjects = async () => {
  const response = await fetch(`${BASE_URL}/api/projects`, { headers: await getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
};
export const createProject = async (projectData) => {
  const response = await fetch(`${BASE_URL}/api/projects`, { method: 'POST', headers: await getAuthHeaders(), body: JSON.stringify(projectData) });
  if (!response.ok) throw new Error('Failed to create project');
  return response.json();
};
export const updateProject = async (id, projectData) => {
  const response = await fetch(`${BASE_URL}/api/projects/${id}`, { method: 'PUT', headers: await getAuthHeaders(), body: JSON.stringify(projectData) });
  if (!response.ok) throw new Error('Failed to update project');
  return response.json();
};
export const deleteProject = async (id) => {
  const response = await fetch(`${BASE_URL}/api/projects/${id}`, { method: 'DELETE', headers: await getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to delete project');
};

// TASKS
export const getTasks = async () => {
    const response = await fetch(`${BASE_URL}/api/tasks`, { headers: await getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
};
export const createTask = async (taskData) => {
    const response = await fetch(`${BASE_URL}/api/tasks`, { method: 'POST', headers: await getAuthHeaders(), body: JSON.stringify(taskData) });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
};
export const updateTask = async (id, taskData) => {
    const response = await fetch(`${BASE_URL}/api/tasks/${id}`, { method: 'PUT', headers: await getAuthHeaders(), body: JSON.stringify(taskData) });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
};
export const deleteTask = async (id) => {
    const response = await fetch(`${BASE_URL}/api/tasks/${id}`, { method: 'DELETE', headers: await getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to delete task');
};

// USERS
export const getUsers = async () => {
    const response = await fetch(`${BASE_URL}/api/users`, { headers: await getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
};
// test