import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskCard from './components/TaskCard';
import ProjectCard from './components/ProjectCard';
import Modal from './components/Modal';
import Button from './components/Button';
import SelectInput from './components/SelectInput';
import Tag from './components/Tag';
import { Task, TaskStatus, Division, ContentPillar, User, Notification, NotificationType, NotificationIconType, Project, ProjectStatus, Asset, AssetType, Role } from './types';
import { TASK_STATUS_OPTIONS, DIVISION_OPTIONS, CONTENT_PILLAR_OPTIONS, NASKAH_TEMPLATE, PROJECT_STATUS_OPTIONS, ASSET_TYPE_OPTIONS } from './constants';
import PlusIcon from './components/icons/PlusIcon';
import ProjectIcon from './components/icons/ProjectIcon';
import BellIcon from './components/icons/BellIcon';
import FolderIcon from './components/icons/FolderIcon';

// Import new views
import AnalyticsView from './components/AnalyticsView';
import FinanceView from './components/FinanceView';
import CrmView from './components/CrmView';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import OkrView from './components/OkrView';
import ReportView from './components/ReportView';
import ProfileView from './components/ProfileView';
import ProjectDetailView from './components/ProjectDetailView';
import AssetView from './components/AssetView';
import TeamView from './components/TeamView';
import LandingPage from './components/LandingPage';

// --- AI INITIALIZATION SECTION ---
import { GoogleGenerativeAI } from "@google/generative-ai";

// For Vite:
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// For Create React App (if you switch later):
// const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

export const ai = new GoogleGenerativeAI(apiKey);
// --- END OF AI SECTION ---


const API_SIMULATION_DELAY = 750; // ms

const initialProjectsData: Project[] = [
  { id: 'PROJ-001', name: 'ShiftedOS Platform V2 Launch', description: 'Complete development and launch V2 of the ShiftedOS platform.', status: ProjectStatus.ACTIVE, startDate: '2024-07-01', endDate: '2024-09-30', owner: 'Product Team', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'PROJ-002', name: 'Q4 Content Marketing Campaign', description: 'Plan and execute content marketing strategy for Q4.', status: ProjectStatus.PLANNING, startDate: '2024-10-01', endDate: '2024-12-31', owner: 'Marketing Team', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'PROJ-003', name: 'Client Onboarding System', description: 'Develop a new system for onboarding new clients smoothly.', status: ProjectStatus.ON_HOLD, startDate: '2024-06-15', endDate: '2024-08-30', owner: 'Sales & Ops', createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
];

const initialTasksData: Task[] = [
  { id: 'SP-001', projectId: 'PROJ-001', title: 'Design Homepage Mockups', description: 'Create detailed mockups for the new homepage, focusing on UX and modern aesthetics. Include mobile and desktop views.', status: TaskStatus.IN_PROGRESS, assignee: 'Jane Doe', startDate: '2024-07-05', deadline: '2024-07-15', duration: 10, divisionTag: Division.SHIFTPECT, contentPillarTag: ContentPillar.NONE, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString(), views: 1200, likes: 85, engagementRate: 7.1 },
  { id: 'SP-002', projectId: 'PROJ-001', title: 'Develop Authentication Module', description: 'Implement user login, registration, and password recovery functionalities.', status: TaskStatus.TODO, assignee: 'John Smith', startDate: '2024-07-16', deadline: '2024-07-30', duration: 15, divisionTag: Division.SHIFTED, contentPillarTag: ContentPillar.NONE, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'SP-003', projectId: 'PROJ-002', title: 'Write Blog Post: "Future of AI"', description: 'Draft a 1000-word blog post on the future implications of AI in creative industries. Include research and expert quotes.', status: TaskStatus.IN_REVIEW, startDate: '2024-10-02', deadline: '2024-10-10', duration: 7, divisionTag: Division.SHIFTFACT, contentPillarTag: ContentPillar.PERSPEKTIF, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'SP-004', projectId: 'PROJ-001', title: 'User Testing for V2 Beta', description: 'Organize and conduct user testing sessions for the V2 beta release.', status: TaskStatus.TODO, assignee: 'Alice Wonderland', startDate: '2024-08-01', deadline: '2024-08-10', duration: 5, divisionTag: Division.MANAGEMENT, contentPillarTag: ContentPillar.NONE, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'SP-005', projectId: 'PROJ-001', title: 'API Integration for Analytics', description: 'Integrate third-party analytics API.', status: TaskStatus.DONE, assignee: 'John Smith', startDate: '2024-08-11', deadline: '2024-08-25', duration: 10, divisionTag: Division.SHIFTED, contentPillarTag: ContentPillar.NONE, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'SP-006', projectId: 'PROJ-002', title: 'Plan Social Media Calendar', description: 'Outline content for all social media platforms for October.', status: TaskStatus.TODO, assignee: 'Marketing Team', startDate: '2024-10-05', deadline: '2024-10-15', duration: 8, divisionTag: Division.SHIFTLIFE, contentPillarTag: ContentPillar.DIALOG, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const MOCK_ADMIN_USER: User = {
  id: 'USR-001',
  name: 'Admin User',
  email: 'admin@shiftedos.com',
  role: 'Administrator',
  roleName: 'System Administrator',
  bio: 'Overseeing the ShiftedOS platform and ensuring smooth operations. Passionate about productivity and creative workflows.',
  avatarUrl: undefined
};

const MOCK_USERS_LIST: User[] = [
  MOCK_ADMIN_USER,
  { id: 'USR-002', name: 'Jane Doe', email: 'jane@shiftedos.com', role: 'Designer', roleName: 'Lead Designer', avatarUrl: `https://i.pravatar.cc/150?u=jane` },
  { id: 'USR-003', name: 'John Smith', email: 'john@shiftedos.com', role: 'Developer', roleName: 'Senior Developer', avatarUrl: `https://i.pravatar.cc/150?u=john` },
  { id: 'USR-004', name: 'Alice Wonderland', email: 'alice@shiftedos.com', role: 'Manager', roleName: 'Project Manager', avatarUrl: `https://i.pravatar.cc/150?u=alice` },
];

const MOCK_ROLES_LIST: Role[] = [
    { id: 'ROLE-001', name: 'System Administrator', description: 'Manages the entire ShiftedOS platform.' },
    { id: 'ROLE-002', name: 'Project Manager', description: 'Oversees projects and timelines.' },
    { id: 'ROLE-003', name: 'Lead Designer', description: 'Responsible for UI/UX design leadership.' },
    { id: 'ROLE-004', name: 'Senior Developer', description: 'Leads development efforts.' },
    { id: 'ROLE-005', name: 'Content Creator', description: 'Creates and manages content.' },
];


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [activeView, setActiveView] = useState<string>('dashboard');

  const [projects, setProjects] = useState<Project[]>(initialProjectsData);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '', description: '', status: ProjectStatus.PLANNING,
  });
  const [isSavingProject, setIsSavingProject] = useState<boolean>(false);
  const [projectError, setProjectError] = useState<string | null>(null);


  const [tasks, setTasks] = useState<Task[]>(initialTasksData);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '', description: '', status: TaskStatus.TODO, divisionTag: DIVISION_OPTIONS[0], contentPillarTag: CONTENT_PILLAR_OPTIONS[CONTENT_PILLAR_OPTIONS.length -1], projectId: '', assignee: '',
  });
  const [isSavingTask, setIsSavingTask] = useState<boolean>(false);
  const [taskError, setTaskError] = useState<string | null>(null);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>(MOCK_USERS_LIST);
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES_LIST);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);


  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `NTF-<span class="math-inline">\{Date\.now\(\)\}\-</span>{Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
  }, []);

  const handleMarkNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const handleMarkAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const handleLogin = async (email: string, pass: string) => {
    setIsLoggingIn(true);
    setLoginError(undefined);
    await new Promise(resolve => setTimeout(resolve, API_SIMULATION_DELAY)); // Simulate API call

    const userToLogin = MOCK_USERS_LIST.find(u => u.email === email);
    if (userToLogin && pass === 'password') {
      setIsAuthenticated(true);
      setCurrentUser(userToLogin);
      setActiveView('dashboard');
      addNotification({
        type: NotificationType.GENERAL_INFO,
        iconType: NotificationIconType.BELL,
        message: `Welcome back, ${userToLogin.name}!`,
      });
    } else {
      setLoginError('Invalid email or password.');
    }
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    // Simulate API call for logout if necessary
    await new Promise(resolve => setTimeout(resolve, API_SIMULATION_DELAY / 2));
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveView('dashboard');
    setSelectedProjectId(null);
    setNotifications([]);
  };

  const handleUpdateUserProfile = async (updatedProfile: Partial<User>) => {
    if (currentUser) {
      setIsUpdatingProfile(true);
      setProfileError(null);
      await new Promise(resolve => setTimeout(resolve, API_SIMULATION_DELAY)); // Simulate API call
      try {
        // Simulate potential API error
        // if (Math.random() < 0.2) throw new Error("Failed to update profile. Please try again.");

        const updatedUser = { ...currentUser, ...updatedProfile } as User;
        setCurrentUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        addNotification({
          type: NotificationType.GENERAL_INFO,
          iconType: NotificationIconType.USER_CIRCLE,
          message: 'Your profile has been updated.',
        });
      } catch (error: any) {
        setProfileError(error.message || "An unexpected error occurred.");
      } finally {
        setIsUpdatingProfile(false);
      }
    }
  };

  const handleProjectInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleOpenProjectModal = (projectToEdit?: Project) => {
    setProjectError(null);
    if (projectToEdit) {
      setEditingProject(projectToEdit);
      setNewProject(projectToEdit);
    } else {
      setEditingProject(null);
      setNewProject({ name: '', description: '', status: ProjectStatus.PLANNING, startDate: new Date().toISOString().split('T')[0] });
    }
    setIsProjectModalOpen(true);
  };

  const handleCloseProjectModal = useCallback(() => {
    setIsProjectModalOpen(false);
    setEditingProject(null);
    setNewProject({ name: '', description: '', status: ProjectStatus.PLANNING });
    setProjectError(null);
  }, []);

  const handleSaveProject = async () => {
    if (!newProject.name) {
      setProjectError("Project Name is required.");
      return;
    }
    setIsSavingProject(true);
    setProjectError(null);
    await new Promise(resolve => setTimeout(resolve, API_SIMULATION_DELAY));

    try {
      // if (Math.random() < 0.2) throw new Error("Simulated API error: Could not save project.");
      const now = new Date().toISOString();
      if (editingProject) {
        const updatedProject = { ...editingProject, ...newProject, updatedAt: now } as Project;
        setProjects(prevProjects => prevProjects.map(p => p.id === editingProject.id ? updatedProject : p));
        addNotification({
          type: NotificationType.PROJECT_UPDATED, iconType: NotificationIconType.PROJECT,
          message: `Project "${updatedProject.name.substring(0,20)}..." updated.`,
          relatedItemId: updatedProject.id, relatedItemType: 'project'
        });
      } else {
        const projectToAdd: Project = {
          id: `PROJ-${String(Date.now()).slice(-4)}`, createdAt: now, updatedAt: now, ...newProject,
        } as Project;
        setProjects(prevProjects => [projectToAdd, ...prevProjects]);
        addNotification({
          type: NotificationType.PROJECT_CREATED, iconType: NotificationIconType.PROJECT,
          message: `New project "${projectToAdd.name.substring(0,20)}..." created.`,
          relatedItemId: projectToAdd.id, relatedItemType: 'project'
        });
      }
      handleCloseProjectModal();
    } catch (error: any) {
      setProjectError(error.message || "An unexpected error occurred saving the project.");
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleDeleteProject = async (projectIdToDelete: string) => {
    if (window.confirm("Are you sure you want to delete this project and all its tasks? This action cannot be undone.")) {
      // Simulate API call for deletion
      await new Promise(resolve => setTimeout(resolve, API_SIMULATION_DELAY));
      const projectToDelete = projects.find(p => p.id === projectIdToDelete);
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectIdToDelete));
      setTasks(prevTasks => prevTasks.filter(t => t.projectId !== projectIdToDelete));
      if (selectedProjectId === projectIdToDelete) {
        setSelectedProjectId(null);
      }
      if (projectToDelete) {
        addNotification({
          type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE,
          message: `Project "${projectToDelete.name.substring(0,20)}..." and its tasks were deleted.`,
        });
      }
    }
  };


  const handleTaskInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));

    if (name === "contentPillarTag" && value === ContentPillar.PERSPEKTIF) {
      const currentTaskData = editingTask || newTask;
      const project = projects.find(p => p.id === currentTaskData.projectId);
      if (project && newTask.divisionTag === Division.SHIFTFACT) {
        setNewTask(prev => ({...prev, description: NASKAH_TEMPLATE}));
      }
    } else if (name === "divisionTag" && newTask.contentPillarTag === ContentPillar.PERSPEKTIF) {
       const currentTaskData = editingTask || newTask;
       const project = projects.find(p => p.id === currentTaskData.projectId);
       if (project && value === Division.SHIFTFACT) {
         setNewTask(prev => ({...prev, description: NASKAH_TEMPLATE}));
       } else if (newTask.description === NASKAH_TEMPLATE) {
         setNewTask(prev => ({...prev, description: ''}));
       }
    }
  }, [newTask, editingTask, projects]);

  const handleOpenTaskModal = (taskToEdit?: Task) => {
    setTaskError(null);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setNewTask(taskToEdit);
    } else {
      setEditingTask(null);
      setNewTask({
        title: '', description: '', status: TaskStatus.TODO, divisionTag: DIVISION_OPTIONS[0],
        contentPillarTag: CONTENT_PILLAR_OPTIONS[CONTENT_PILLAR_OPTIONS.length -1],
        projectId: selectedProjectId || projects[0]?.id || '',
        assignee: '', startDate: new Date().toISOString().split('T')[0], duration: 5,
      });
    }
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setNewTask({ title: '', description: '', status: TaskStatus.TODO, divisionTag: DIVISION_OPTIONS[0], contentPillarTag: CONTENT_PILLAR_OPTIONS[CONTENT_PILLAR_OPTIONS.length -1], projectId: '', assignee: '' });
    setTaskError(null);
  }, []);

  const handleSaveTask = async () => {
    if (!newTask.title || !newTask.projectId) {
      setTaskError("Title and Project are required for a task.");
      return;
    }
    setIsSavingTask(true);
    setTaskError(null);
    await new Promise(resolve => setTimeout(resolve, API_SIMULATION_DELAY));

    try {
      // if (Math.random() < 0.2) throw new Error("Simulated API error: Could not save task.");
      const now = new Date().toISOString();
      let assignedUserName = newTask.assignee;

      if (editingTask) {
        const updatedTask = { ...editingTask, ...newTask, assignee: assignedUserName, updatedAt: now } as Task;
        setTasks(prevTasks => prevTasks.map(t => t.id === editingTask.id ? updatedTask : t));

        if (editingTask.status !== updatedTask.status) {
          addNotification({
            type: NotificationType.STATUS_CHANGED, iconType: NotificationIconType.BELL,
            message: `Task "${updatedTask.title.substring(0,20)}..." status changed to ${updatedTask.status}.`,
            relatedItemId: updatedTask.id, relatedItemType: 'task'
          });
        }
        if (updatedTask.status === TaskStatus.PUBLISHED && editingTask.status !== TaskStatus.PUBLISHED) {
          addNotification({
            type: NotificationType.TASK_COMPLETED, iconType: NotificationIconType.CHECK_CIRCLE,
            message: `Task "${updatedTask.title.substring(0,20)}..." has been published!`,
            relatedItemId: updatedTask.id, relatedItemType: 'task'
          });
        }
        if (editingTask.assignee !== updatedTask.assignee && updatedTask.assignee) {
          addNotification({
              type: NotificationType.TASK_ASSIGNED, iconType: NotificationIconType.USER_CIRCLE,
              message: `Task "${updatedTask.title.substring(0,15)}..." assigned to ${updatedTask.assignee}.`,
              relatedItemId: updatedTask.id, relatedItemType: 'task'
          });
        }
      } else {
        const taskToAdd: Task = {
          id: `SP-${String(Date.now()).slice(-4)}`, ...newTask,
          assignee: assignedUserName, createdAt: now, updatedAt: now,
        } as Task;
        setTasks(prevTasks => [taskToAdd, ...prevTasks]);
        addNotification({
          type: NotificationType.TASK_CREATED, iconType: NotificationIconType.PLUS_CIRCLE,
          message: `New task "${taskToAdd.title.substring(0,20)}..." created.`,
          relatedItemId: taskToAdd.id, relatedItemType: 'task'
        });
        if (taskToAdd.assignee) {
          addNotification({
              type: NotificationType.TASK_ASSIGNED, iconType: NotificationIconType.USER_CIRCLE,
              message: `Task "${taskToAdd.title.substring(0,15)}..." assigned to ${taskToAdd.assignee}.`,
              relatedItemId: taskToAdd.id, relatedItemType: 'task'
          });
        }
      }
      handleCloseTaskModal();
    } catch (error: any) {
      setTaskError(error.message || "An unexpected error occurred saving the task.");
    } finally {
      setIsSavingTask(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
        await new Promise(resolve => setTimeout(resolve, API_SIMULATION_DELAY)); // Simulate API call
        const taskToDelete = tasks.find(t => t.id === taskId);
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
         if (taskToDelete) {
           addNotification({
            type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE,
            message: `Task "${taskToDelete.title.substring(0,20)}..." was deleted.`,
          });
        }
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (taskToUpdate) {
      // Optimistic update:
      const oldTasks = tasks;
      const updatedTaskOptimistic = { ...taskToUpdate, status: newStatus, updatedAt: new Date().toISOString() };
      setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? updatedTaskOptimistic : t));

      await new Promise(resolve => setTimeout(resolve, API_SIMULATION_DELAY)); // Simulate API call
      try {
        // if (Math.random() < 0.2) throw new Error("Failed to update task status."); // Simulate error

        // If API call successful, notification logic:
        let notificationMessage = `Task "${updatedTaskOptimistic.title.substring(0,20)}..." status updated to ${newStatus}.`;
        let iconType = NotificationIconType.BELL;

        if (newStatus === TaskStatus.IN_REVIEW) {
          notificationMessage = `Task "${updatedTaskOptimistic.title.substring(0,20)}..." is now In Review.`;
          iconType = NotificationIconType.EYE;
        } else if (newStatus === TaskStatus.PUBLISHED) {
          notificationMessage = `Task "${updatedTaskOptimistic.title.substring(0,20)}..." has been Approved & Published!`;
          iconType = NotificationIconType.CHECK_CIRCLE;
        } else if (newStatus === TaskStatus.IN_PROGRESS && taskToUpdate.status === TaskStatus.IN_REVIEW) {
          notificationMessage = `Changes requested for task "${updatedTaskOptimistic.title.substring(0,20)}...". Back to In Progress.`;
          iconType = NotificationIconType.EXCLAMATION_TRIANGLE;
        }
        addNotification({
          type: NotificationType.STATUS_CHANGED, iconType: iconType, message: notificationMessage,
          relatedItemId: taskId, relatedItemType: 'task'
        });
      } catch (error) {
        // Revert UI on error
        setTasks(oldTasks);
        addNotification({
          type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE,
          message: `Failed to update status for "${taskToUpdate.title.substring(0,20)}...".`,
        });
      }
    }
  };

  const getTasksForSelectedProject = useCallback(() => {
    if (!selectedProjectId) return [];
    return tasks.filter(task => task.projectId === selectedProjectId);
  }, [tasks, selectedProjectId]);

  const handleAssetNotification = useCallback((message: string, assetType: AssetType) => {
      addNotification({
          type: NotificationType.ASSET_CREATED, iconType: NotificationIconType.FOLDER,
          message: message, relatedItemType: 'asset',
      });
  }, [addNotification]);


  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        const activeProjectsCount = projects.filter(p => p.status === ProjectStatus.ACTIVE).length;
        const tasksDueSoonCount = tasks.filter(t => {
            if (!t.deadline) return false;
            const deadlineDate = new Date(t.deadline);
            const today = new Date();
            const threeDaysFromNow = new Date();
            threeDaysFromNow.setDate(today.getDate() + 3);
            return deadlineDate <= threeDaysFromNow && t.status !== TaskStatus.DONE && t.status !== TaskStatus.PUBLISHED;
        }).length;

        return (
            <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-glass-depth border border-gray-200/50">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary mb-2">
                        Welcome back, <span className="text-main-accent">{currentUser?.name?.split(' ')[0] || 'User'}</span>!
                    </h1>
                    <p className="text-text-secondary">Here's a quick overview of your ShiftedOS workspace.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                     <div
                        className="bg-white p-5 rounded-xl shadow-glass-depth border border-gray-200/50 cursor-pointer hover:shadow-strong transition-shadow"
                        onClick={() => { setActiveView('tasks'); setSelectedProjectId(null); }}
                    >
                        <div className="flex items-center text-main-accent mb-2">
                            <ProjectIcon className="w-7 h-7 mr-3" />
                            <h3 className="text-lg font-semibold">Active Projects</h3>
                        </div>
                        <p className="text-3xl font-bold text-text-primary">{activeProjectsCount}</p>
                        <p className="text-xs text-text-secondary mt-1">View All Projects &rarr;</p>
                    </div>
                     <div
                        className="bg-white p-5 rounded-xl shadow-glass-depth border border-gray-200/50 cursor-pointer hover:shadow-strong transition-shadow"
                        onClick={() => { setActiveView('tasks'); setSelectedProjectId(null); }}
                    >
                        <div className="flex items-center text-highlight mb-2">
                            <BellIcon className="w-7 h-7 mr-3" />
                            <h3 className="text-lg font-semibold">Tasks Due Soon</h3>
                        </div>
                        <p className="text-3xl font-bold text-text-primary">{tasksDueSoonCount}</p>
                        <p className="text-xs text-text-secondary mt-1">Manage Upcoming Deadlines &rarr;</p>
                    </div>
                     <div
                        className="bg-white p-5 rounded-xl shadow-glass-depth border border-gray-200/50 cursor-pointer hover:shadow-strong transition-shadow"
                        onClick={() => handleOpenTaskModal()}
                    >
                        <div className="flex items-center text-secondary-accent mb-2">
                            <PlusIcon className="w-7 h-7 mr-3" />
                            <h3 className="text-lg font-semibold">Quick Add Task</h3>
                        </div>
                        <p className="text-text-secondary">Quickly create a new task.</p>
                        <p className="text-xs text-text-secondary mt-1">Add to a Project &rarr;</p>
                    </div>
                </div>
            </div>
        );
      case 'tasks':
        if (selectedProjectId) {
          const currentProject = projects.find(p => p.id === selectedProjectId);
          const projectTasks = getTasksForSelectedProject();
          if (!currentProject) {
            return (
              <div className="bg-white rounded-xl p-10 shadow-glass-depth text-center">
                <p className="text-text-secondary text-lg">Project not found.</p>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProjectId(null)} className="mt-4">
                  &larr; Back to Projects
                </Button>
              </div>
            );
          }
          return (
            <ProjectDetailView
                project={currentProject}
                tasks={projectTasks}
                onBackToProjects={() => setSelectedProjectId(null)}
            />
          );
        } else {
          return (
            <div>
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary">All Projects</h2>
              </div>
              {projects.length === 0 ? (
                 <div className="bg-white rounded-xl p-10 shadow-glass-depth text-center">
                    <p className="text-text-secondary text-lg">No projects yet. Create your first project!</p>
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {projects.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onViewTasks={() => setSelectedProjectId(project.id)}
                      onEdit={() => handleOpenProjectModal(project)}
                      onDelete={handleDeleteProject}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        }
      case 'assets': return <AssetView onAddNotification={handleAssetNotification} />;
      case 'team': return <TeamView users={users} roles={roles} />;
      case 'analytics': return <AnalyticsView />;
      case 'finance': return <FinanceView />;
      case 'crm': return <CrmView />;
      case 'knowledge': return <KnowledgeBaseView />;
      case 'okr': return <OkrView />;
      case 'reports': return <ReportView />;
      case 'profile':
        return <ProfileView
                  currentUser={currentUser}
                  onUpdateProfile={handleUpdateUserProfile}
                  onLogout={handleLogout}
                  isLoading={isUpdatingProfile}
                  error={profileError}
                />;
      default:
         return (
            <div className="bg-white rounded-xl p-10 shadow-glass-depth text-center">
                <p className="text-xl text-text-secondary">Select a module to get started.</p>
            </div>
        );
    }
  };

  const getHeaderTitle = () => {
    if (activeView === 'tasks') {
      if (selectedProjectId) {
        const project = projects.find(p => p.id === selectedProjectId);
        return project ? `${project.name}` : 'Project Details';
      }
      return 'Projects';
    }
    const item = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'assets', label: 'Asset Inventory' },
        { id: 'team', label: 'Team Management' },
        { id: 'analytics', label: 'Analytics & Insights' },
        { id: 'finance', label: 'Finance & Budgeting' },
        { id: 'crm', label: 'Relations & Collaborators' },
        { id: 'knowledge', label: 'Knowledge Base' },
        { id: 'okr', label: 'Objectives & OKRs' },
        { id: 'reports', label: 'Report Builder' },
        { id: 'profile', label: 'User Profile'},
    ].find(i => i.id === activeView);
    return item ? item.label : 'ShiftedOS';
  }

  const getHeaderPrimaryAction = () => {
    if (activeView === 'tasks') {
      return selectedProjectId ? () => handleOpenTaskModal() : () => handleOpenProjectModal();
    }
    if (activeView === 'assets') {
      return undefined;
    }
    if (['dashboard', 'team', 'analytics', 'finance', 'crm', 'knowledge', 'okr', 'reports', 'profile'].includes(activeView)) {
        return undefined;
    }
    return undefined;
  };

  const getHeaderPrimaryActionLabel = () => {
    if (activeView === 'tasks') {
      return selectedProjectId ? 'New Task' : 'New Project';
    }
    return getHeaderPrimaryAction() ? 'Action' : undefined;
  };

  const getHeaderPrimaryActionIcon = () => {
     if (activeView === 'tasks' && !selectedProjectId) {
      return <ProjectIcon className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
    if (activeView === 'tasks' && selectedProjectId) {
        return <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
    return getHeaderPrimaryAction() ? <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" /> : undefined;
  }


  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const toggleDesktopSidebarCollapse = () => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed);

  useEffect(() => {
    if (isAuthenticated) {
      setActiveView('dashboard');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} loginError={loginError} isLoading={isLoggingIn} />;
  }

  const userOptionsForTaskModal = users.map(user => ({ value: user.name, label: user.name }));


  return (
    <div className="flex h-screen bg-main-background text-text-primary overflow-hidden">
      <Sidebar
        activeView={activeView}
        setActiveView={(viewId) => { setActiveView(viewId); setSelectedProjectId(null); }}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
        toggleDesktopSidebarCollapse={toggleDesktopSidebarCollapse}
      />
      <div className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ease-in-out
                      ${isDesktopSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <Header
          title={getHeaderTitle()}
          onPrimaryAction={getHeaderPrimaryAction()}
          primaryActionButtonLabel={getHeaderPrimaryActionLabel()}
          primaryActionIcon={getHeaderPrimaryActionIcon()}
          onToggleSidebar={toggleMobileSidebar}
          isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
          notifications={notifications}
          unreadNotificationCount={unreadNotificationCount}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-glass-bg backdrop-blur-xl">
          {renderContent()}
        </main>
      </div>

      {/* Task Modal */}
      <Modal isOpen={isTaskModalOpen && (activeView === 'tasks' || activeView === 'dashboard')} onClose={handleCloseTaskModal} title={editingTask ? 'Edit Task' : 'Create New Task'} size="xl">
        <form onSubmit={(e) => { e.preventDefault(); handleSaveTask(); }} className="space-y-4 md:space-y-6">
          {taskError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">{taskError}</div>}
          <fieldset disabled={isSavingTask}>
            <SelectInput
              label="Project" name="projectId" value={newTask.projectId || ''} onChange={handleTaskInputChange}
              options={projects.map(p => ({ value: p.id, label: p.name }))} required
              className="bg-white" placeholder="Select a project"
            />
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">Task Title</label>
              <input type="text" name="title" id="title" value={newTask.title || ''} onChange={handleTaskInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="Enter task title"/>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Task Description</label>
              <textarea name="description" id="description" value={newTask.description || ''} onChange={handleTaskInputChange} rows={newTask.divisionTag === Division.SHIFTFACT && newTask.contentPillarTag === ContentPillar.PERSPEKTIF ? 10 : 4} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="Enter task description"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <SelectInput label="Status" name="status" value={newTask.status || TaskStatus.TODO} onChange={handleTaskInputChange} options={TASK_STATUS_OPTIONS.map(s => ({ value: s, label: s }))} className="bg-white"/>
              <SelectInput
                  label="Assignee" name="assignee" value={newTask.assignee || ''} onChange={handleTaskInputChange}
                  options={[{value: '', label: 'Unassigned'}, ...userOptionsForTaskModal]} className="bg-white" placeholder="Select an assignee"
              />
              <SelectInput label="Division Tag" name="divisionTag" value={newTask.divisionTag || ''} onChange={handleTaskInputChange} options={DIVISION_OPTIONS.map(d => ({ value: d, label: d }))} className="bg-white"/>
              <SelectInput label="Content Pillar Tag" name="contentPillarTag" value={newTask.contentPillarTag || ''} onChange={handleTaskInputChange} options={CONTENT_PILLAR_OPTIONS.map(p => ({ value: p, label: p }))} className="bg-white"/>
              <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary mb-1">Start Date</label>
                  <input type="date" name="startDate" id="startDate" value={newTask.startDate ? newTask.startDate.split('T')[0] : ''} onChange={handleTaskInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white"/>
              </div>
              <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-text-secondary mb-1">Deadline</label>
                  <input type="date" name="deadline" id="deadline" value={newTask.deadline ? newTask.deadline.split('T')[0] : ''} onChange={handleTaskInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white"/>
              </div>
              <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-text-secondary mb-1">Duration (days)</label>
                  <input type="number" name="duration" id="duration" value={newTask.duration || ''} onChange={handleTaskInputChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="Est. days for Gantt"/>
              </div>
            </div>
          </fieldset>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={handleCloseTaskModal} className="w-full sm:w-auto" disabled={isSavingTask}>Cancel</Button>
            <Button type="submit" variant="primary" leftIcon={isSavingTask ? null : <PlusIcon className="w-4 h-4" />} className="w-full sm:w-auto" disabled={isSavingTask}>
              {isSavingTask ? 'Saving...' : (editingTask ? 'Save Changes' : 'Create Task')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Project Modal */}
      <Modal isOpen={isProjectModalOpen && (activeView === 'tasks' || activeView === 'dashboard')} onClose={handleCloseProjectModal} title={editingProject ? 'Edit Project' : 'Create New Project'} size="lg">
        <form onSubmit={(e) => { e.preventDefault(); handleSaveProject(); }} className="space-y-4 md:space-y-6">
          {projectError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">{projectError}</div>}
          <fieldset disabled={isSavingProject}>
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-text-secondary mb-1">Project Name</label>
              <input type="text" name="name" id="projectName" value={newProject.name || ''} onChange={handleProjectInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="Enter project name"/>
            </div>
            <div>
              <label htmlFor="projectDescription" className="block text-sm font-medium text-text-secondary mb-1">Description</label>
              <textarea name="description" id="projectDescription" value={newProject.description || ''} onChange={handleProjectInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="Enter project description"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <SelectInput label="Status" name="status" value={newProject.status || ProjectStatus.PLANNING} onChange={handleProjectInputChange} options={PROJECT_STATUS_OPTIONS.map(s => ({ value: s, label: s }))} className="bg-white"/>
              <div>
                  <label htmlFor="projectOwner" className="block text-sm font-medium text-text-secondary mb-1">Owner</label>
                  <input type="text" name="owner" id="projectOwner" value={newProject.owner || ''} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="Project owner name or team"/>
              </div>
              <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary mb-1">Start Date</label>
                  <input type="date" name="startDate" id="startDate" value={newProject.startDate ? newProject.startDate.split('T')[0] : ''} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white"/>
              </div>
              <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-text-secondary mb-1">End Date</label>
                  <input type="date" name="endDate" id="endDate" value={newProject.endDate ? newProject.endDate.split('T')[0] : ''} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white"/>
              </div>
            </div>
          </fieldset>
           <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={handleCloseProjectModal} className="w-full sm:w-auto" disabled={isSavingProject}>Cancel</Button>
            <Button type="submit" variant="primary" leftIcon={isSavingProject ? null :<ProjectIcon className="w-4 h-4" />} className="w-full sm:w-auto" disabled={isSavingProject}>
              {isSavingProject ? 'Saving...' : (editingProject ? 'Save Changes' : 'Create Project')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default App;