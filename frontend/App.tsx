import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskCard from './components/TaskCard';
import ProjectCard from './components/ProjectCard'; 
import Modal from './components/Modal';
import Button from './components/Button';
import SelectInput from './components/SelectInput';
import Tag from './components/Tag';
import { Task, TaskStatus, Division, ContentPillar, User, Notification, NotificationType, NotificationIconType, Project, ProjectStatus, Asset, AssetType, Role, ThemeColors, UserRole, AnalyticsConfig, TaskPriority } from './types';
import { TASK_STATUS_OPTIONS, DIVISION_OPTIONS, CONTENT_PILLAR_OPTIONS, NASKAH_TEMPLATE, PROJECT_STATUS_OPTIONS, ASSET_TYPE_OPTIONS, TASK_PRIORITY_OPTIONS } from './constants';
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
import AdminView from './components/AdminView';

const API_SIMULATION_DELAY = 750; // ms

const initialProjectsData: Project[] = [
  { id: 'PROJ-001', name: 'ShiftedOS Platform V2 Launch', description: 'Complete development and launch V2 of the ShiftedOS platform.', status: ProjectStatus.ACTIVE, startDate: '2024-07-01', endDate: '2024-09-30', owner: 'Product Team', budget: 50000000, proofOfWorkUrl: 'https://example.com/shiftedos-v2-design-docs', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'PROJ-002', name: 'Q4 Content Marketing Campaign', description: 'Plan and execute content marketing strategy for Q4.', status: ProjectStatus.PLANNING, startDate: '2024-10-01', endDate: '2024-12-31', owner: 'Marketing Team', budget: 25000000, proofOfWorkUrl: '', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'PROJ-003', name: 'Client Onboarding System', description: 'Develop a new system for onboarding new clients smoothly.', status: ProjectStatus.ON_HOLD, startDate: '2024-06-15', endDate: '2024-08-30', owner: 'Sales & Ops', proofOfWorkUrl: 'https://example.com/client-onboarding-flowchart', createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
];

const initialTasksData: Task[] = [
  { id: 'SP-001', projectId: 'PROJ-001', title: 'Design Homepage Mockups', description: 'Create detailed mockups for the new homepage, focusing on UX and modern aesthetics. Include mobile and desktop views.', status: TaskStatus.IN_PROGRESS, assignee: 'Jane Doe (Editor)', startDate: '2024-07-05', deadline: '2024-07-15', duration: 10, priority: TaskPriority.HIGH, divisionTag: Division.SHIFTPECT, contentPillarTag: ContentPillar.NONE, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString(), views: 1200, likes: 85, engagementRate: 7.1 },
  { id: 'SP-002', projectId: 'PROJ-001', title: 'Develop Authentication Module', description: 'Implement user login, registration, and password recovery functionalities.', status: TaskStatus.TODO, assignee: 'John Smith (Developer)', startDate: '2024-07-16', deadline: '2024-07-30', duration: 15, priority: TaskPriority.URGENT, divisionTag: Division.SHIFTED, contentPillarTag: ContentPillar.NONE, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'SP-003', projectId: 'PROJ-002', title: 'Write Blog Post: "Future of AI"', description: 'Draft a 1000-word blog post on the future implications of AI in creative industries. Include research and expert quotes.', status: TaskStatus.IN_REVIEW, assignee: 'Alice Wonderland (Script Writer)', startDate: '2024-10-02', deadline: '2024-10-10', duration: 7, priority: TaskPriority.MEDIUM, divisionTag: Division.SHIFTFACT, contentPillarTag: ContentPillar.PERSPEKTIF, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'SP-004', projectId: 'PROJ-001', title: 'User Testing for V2 Beta', description: 'Organize and conduct user testing sessions for the V2 beta release.', status: TaskStatus.TODO, assignee: 'Jane Doe (Editor)', startDate: '2024-08-01', deadline: '2024-08-10', duration: 5, priority: TaskPriority.HIGH, divisionTag: Division.MANAGEMENT, contentPillarTag: ContentPillar.NONE, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const MOCK_ADMIN_USER: User = {
  id: 'USR-001', name: 'Admin User', email: 'admin@shiftedos.com', role: UserRole.ADMIN, roleName: 'System Administrator',
  bio: 'Overseeing the ShiftedOS platform.', avatarUrl: undefined
};

const getInitialUsers = (): User[] => {
  try {
    const storedUsers = localStorage.getItem('shiftedOSMockUsers');
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
  } catch (e) {
    console.error("Failed to load users from localStorage", e);
  }
  return [
    MOCK_ADMIN_USER,
    { id: 'USR-002', name: 'Jane Doe', email: 'editor@shiftedos.com', role: UserRole.EDITOR, roleName: 'Lead Editor', avatarUrl: `https://i.pravatar.cc/150?u=jane` },
    { id: 'USR-003', name: 'John Smith', email: 'dev@shiftedos.com', role: UserRole.VIEWER, roleName: 'Senior Developer', avatarUrl: `https://i.pravatar.cc/150?u=john` },
    { id: 'USR-004', name: 'Alice Wonderland', email: 'script@shiftedos.com', role: UserRole.SCRIPT_WRITER, roleName: 'Head Script Writer', avatarUrl: `https://i.pravatar.cc/150?u=alice` },
    { id: 'USR-005', name: 'Bob The Viewer', email: 'viewer@shiftedos.com', role: UserRole.VIEWER, roleName: 'Stakeholder', avatarUrl: `https://i.pravatar.cc/150?u=bob` },
    { id: 'USR-006', name: 'Charlie Finance', email: 'finance@shiftedos.com', role: UserRole.FINANCE, roleName: 'Finance Officer', avatarUrl: `https://i.pravatar.cc/150?u=charlie` },
    { id: 'USR-007', name: 'Peter Manager', email: 'pm@shiftedos.com', role: UserRole.PROJECT_MANAGER, roleName: 'Project Manager', avatarUrl: `https://i.pravatar.cc/150?u=peter` },
  ];
};


const MOCK_ROLES_LIST: Role[] = [
    { id: 'ROLE-001', name: 'Admin', description: 'Manages the entire ShiftedOS platform.' },
    { id: 'ROLE-002', name: 'Editor', description: 'Oversees projects, tasks, and content quality.' },
    { id: 'ROLE-003', name: 'Script Writer', description: 'Focuses on creating and managing task content, especially scripts.' },
    { id: 'ROLE-004', name: 'Viewer', description: 'Has read-only access to most platform data.' },
    { id: 'ROLE-005', name: 'Finance', description: 'Manages financial data and budgeting.' },
    { id: 'ROLE-006', name: 'Project Manager', description: 'Manages projects, timelines, and team assignments.' },
];

const DEFAULT_THEME: ThemeColors = {
  mainBackground: '#F5ECE0', glassBg: 'rgba(255, 255, 255, 0.35)', mainAccent: '#336D82',
  secondaryAccent: '#5F99AE', highlight: '#693382', textPrimary: '#1F2937', textSecondary: '#6B7280',
};

const DEFAULT_ANALYTICS_CONFIG: AnalyticsConfig = {
  metricVisibility: {
    activeProjects: true,
    tasksCompleted: true,
    totalContentViews: true,
    teamEngagement: true,
  },
  chartType: 'Bar Chart',
};


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
    name: '', description: '', status: ProjectStatus.PLANNING, budget: 0, proofOfWorkUrl: '',
  });
  const [isSavingProject, setIsSavingProject] = useState<boolean>(false);
  const [projectError, setProjectError] = useState<string | null>(null);


  const [tasks, setTasks] = useState<Task[]>(initialTasksData);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '', description: '', status: TaskStatus.TODO, divisionTag: DIVISION_OPTIONS[0], contentPillarTag: CONTENT_PILLAR_OPTIONS[CONTENT_PILLAR_OPTIONS.length -1], projectId: '', assignee: '', priority: TaskPriority.MEDIUM,
  });
  const [isSavingTask, setIsSavingTask] = useState<boolean>(false);
  const [taskError, setTaskError] = useState<string | null>(null);
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>(getInitialUsers());
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES_LIST);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  
  const [currentTheme, setCurrentTheme] = useState<ThemeColors>(DEFAULT_THEME);
  const [analyticsConfig, setAnalyticsConfig] = useState<AnalyticsConfig>(DEFAULT_ANALYTICS_CONFIG);

  const [dynamicActiveProjectsCount, setDynamicActiveProjectsCount] = useState<number>(0);
  const [dynamicTasksCompletedCount, setDynamicTasksCompletedCount] = useState<number>(0);
  const [dynamicTotalContentViews, setDynamicTotalContentViews] = useState<number>(0);
  const [dynamicTeamEngagement, setDynamicTeamEngagement] = useState<string>("0%");


  useEffect(() => {
    // Set body class based on authentication state for different global styles
    if (isAuthenticated) {
      document.body.className = 'app-body';
    } else {
      document.body.className = 'landing-page-body';
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setDynamicActiveProjectsCount(projects.filter(p => p.status === ProjectStatus.ACTIVE).length);
    setDynamicTasksCompletedCount(tasks.filter(t => t.status === TaskStatus.DONE || t.status === TaskStatus.PUBLISHED).length);
    setDynamicTotalContentViews(25600); 
    setDynamicTeamEngagement("85%"); 
  }, [projects, tasks]);


  const applyTheme = useCallback((theme: ThemeColors) => {
    const root = document.documentElement;
    root.style.setProperty('--color-main-background', theme.mainBackground);
    root.style.setProperty('--color-glass-bg', theme.glassBg);
    root.style.setProperty('--color-main-accent', theme.mainAccent);
    root.style.setProperty('--color-secondary-accent', theme.secondaryAccent);
    root.style.setProperty('--color-highlight', theme.highlight);
    root.style.setProperty('--color-text-primary', theme.textPrimary);
    root.style.setProperty('--color-text-secondary', theme.textSecondary);
    
    setCurrentTheme(theme);
    localStorage.setItem('shiftedOSTheme', JSON.stringify(theme));
  }, []);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('shiftedOSTheme');
      if (storedTheme) {
        const parsedTheme = JSON.parse(storedTheme);
        setCurrentTheme(parsedTheme); 
      }
      const storedAnalyticsConfig = localStorage.getItem('shiftedOSAnalyticsConfig');
      if (storedAnalyticsConfig) {
        setAnalyticsConfig(JSON.parse(storedAnalyticsConfig));
      }

    } catch (e) {
      console.error("Failed to load settings from localStorage in App.tsx", e);
      applyTheme(DEFAULT_THEME); 
    }
  }, [applyTheme]);


  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `NTF-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
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
    await new Promise(resolve => setTimeout(resolve, API_SIMULATION_DELAY)); 
    
    const authenticatedUserFromMock = users.find(u => u.email === email);
    
    if (authenticatedUserFromMock && pass === 'password') { 
      const userWithRole: User = { ...authenticatedUserFromMock };
      setCurrentUser(userWithRole);
      setIsAuthenticated(true);
      setActiveView('dashboard'); 
      addNotification({
        type: NotificationType.GENERAL_INFO,
        iconType: NotificationIconType.BELL,
        message: `Welcome back, ${userWithRole.name}! Your role: ${userWithRole.role}.`,
      });
    } else {
      setLoginError('Invalid email or password.');
    }
    setIsLoggingIn(false);
  };
  
  const handleLoginAsRole = async (role: UserRole) => {
    setIsLoggingIn(true);
    setLoginError(undefined);
    await new Promise(resolve => setTimeout(resolve, API_SIMULATION_DELAY / 2)); 

    const userForRole = users.find(u => u.role === role);

    if (userForRole) {
      setCurrentUser(userForRole);
      setIsAuthenticated(true);
      setActiveView('dashboard');
      addNotification({
        type: NotificationType.GENERAL_INFO,
        iconType: NotificationIconType.BELL,
        message: `Logged in as ${userForRole.name} (${userForRole.role}).`,
      });
    } else {
      setLoginError(`Could not find a mock user for the role: ${role}.`);
    }
    setIsLoggingIn(false);
  };


  const handleLogout = async () => {
    await new Promise(resolve => setTimeout(resolve, API_SIMULATION_DELAY / 2));
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveView('dashboard'); // This will be handled by LandingPage logic now
    setSelectedProjectId(null); 
    setNotifications([]);
  };

  const handleUpdateUserProfile = async (updatedProfile: Partial<User>) => {
    if (currentUser) {
      setIsUpdatingProfile(true);
      setProfileError(null);
      await new Promise(resolve => setTimeout(resolve, API_SIMULATION_DELAY)); 
      try {
        const { role, ...restOfProfile } = updatedProfile; 
        const updatedUser = { ...currentUser, ...restOfProfile } as User;
        setCurrentUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        localStorage.setItem('shiftedOSMockUsers', JSON.stringify(users.map(u => u.id === updatedUser.id ? updatedUser : u)));
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
    if (name === "budget") {
        setNewProject(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
        setNewProject(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleOpenProjectModal = (projectToEdit?: Project) => {
    if (currentUser?.role !== UserRole.ADMIN && currentUser?.role !== UserRole.EDITOR && currentUser?.role !== UserRole.PROJECT_MANAGER) {
        addNotification({type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "You don't have permission to manage projects."});
        return;
    }
    setProjectError(null);
    if (projectToEdit) {
      setEditingProject(projectToEdit);
      setNewProject({...projectToEdit, budget: projectToEdit.budget || 0, proofOfWorkUrl: projectToEdit.proofOfWorkUrl || ''});
    } else {
      setEditingProject(null);
      setNewProject({ name: '', description: '', status: ProjectStatus.PLANNING, startDate: new Date().toISOString().split('T')[0], budget: 0, proofOfWorkUrl: '' });
    }
    setIsProjectModalOpen(true);
  };

  const handleCloseProjectModal = useCallback(() => {
    setIsProjectModalOpen(false);
    setEditingProject(null);
    setNewProject({ name: '', description: '', status: ProjectStatus.PLANNING, budget: 0, proofOfWorkUrl: '' });
    setProjectError(null);
  }, []);

  const handleSaveProject = async () => {
    if (currentUser?.role !== UserRole.ADMIN && currentUser?.role !== UserRole.EDITOR && currentUser?.role !== UserRole.PROJECT_MANAGER) {
        setProjectError("Permission denied.");
        return;
    }
    if (!newProject.name) {
      setProjectError("Project Name is required.");
      return;
    }
    setIsSavingProject(true);
    setProjectError(null);
    await new Promise(resolve => setTimeout(resolve, API_SIMULATION_DELAY));

    try {
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
     if (currentUser?.role !== UserRole.ADMIN && currentUser?.role !== UserRole.EDITOR && currentUser?.role !== UserRole.PROJECT_MANAGER) {
        addNotification({type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "You don't have permission to delete projects."});
        return;
    }
    if (window.confirm("Are you sure you want to delete this project and all its tasks? This action cannot be undone.")) {
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

  const handleAddNewUser = async (name: string, email: string, role: UserRole, pass: string) => {
    if (!currentUser || (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.PROJECT_MANAGER)) {
      addNotification({type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "Only Admins or Project Managers can add new users."});
      return false;
    }
    if (!name || !email || !role || !pass) {
      addNotification({type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "All fields are required to add a new user."});
      return false; 
    }
    if (users.find(u => u.email === email)) {
      addNotification({type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: `User with email ${email} already exists.`});
      return false;
    }

    await new Promise(resolve => setTimeout(resolve, API_SIMULATION_DELAY));

    const newUser: User = {
      id: `USR-${String(Date.now()).slice(-5)}`,
      name,
      email,
      role,
      roleName: MOCK_ROLES_LIST.find(r => r.name === role)?.name || role,
      avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
      password: pass, 
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('shiftedOSMockUsers', JSON.stringify(updatedUsers));

    addNotification({
      type: NotificationType.GENERAL_INFO, 
      iconType: NotificationIconType.USER_CIRCLE,
      message: `New user "${name}" added with role ${role}.`,
    });
    return true;
  };

  const handleEditUserRole = async (userId: string, newRole: UserRole) => {
    if (!currentUser || (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.PROJECT_MANAGER)) {
        addNotification({type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "Only Admins or Project Managers can change user roles."});
        return;
    }
    const userToUpdate = users.find(u => u.id === userId);
    if (userToUpdate && userToUpdate.email === MOCK_ADMIN_USER.email && currentUser.email !== MOCK_ADMIN_USER.email) {
        addNotification({type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "The primary Admin role cannot be changed by other users."});
        return;
    }
    if (userToUpdate && userToUpdate.email === MOCK_ADMIN_USER.email && newRole !== UserRole.ADMIN) {
        addNotification({type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "The primary Admin user must remain an Admin."});
        return;
    }


    await new Promise(resolve => setTimeout(resolve, API_SIMULATION_DELAY));
    
    if (userToUpdate) {
        const updatedUsers = users.map(u => 
            u.id === userId ? { ...u, role: newRole, roleName: MOCK_ROLES_LIST.find(r => r.name === newRole)?.name || newRole } : u
        );
        setUsers(updatedUsers);
        localStorage.setItem('shiftedOSMockUsers', JSON.stringify(updatedUsers));
        addNotification({
            type: NotificationType.GENERAL_INFO,
            iconType: NotificationIconType.USER_CIRCLE,
            message: `User ${userToUpdate.name}'s role updated to ${newRole}.`
        });
    }
  };


  const handleTaskInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value as TaskStatus | Division | ContentPillar | TaskPriority }));

    if (name === "contentPillarTag" && value === ContentPillar.PERSPEKTIF) { 
      if (newTask.divisionTag === Division.SHIFTFACT && currentUser?.role !== UserRole.VIEWER) { 
        setNewTask(prev => ({...prev, description: NASKAH_TEMPLATE}));
      }
    } else if (name === "divisionTag" && newTask.contentPillarTag === ContentPillar.PERSPEKTIF) {
       if (value === Division.SHIFTFACT && currentUser?.role !== UserRole.VIEWER) {
         setNewTask(prev => ({...prev, description: NASKAH_TEMPLATE}));
       } else if (newTask.description === NASKAH_TEMPLATE) { 
         setNewTask(prev => ({...prev, description: ''}));
       }
    }
  }, [newTask, editingTask, currentUser?.role]);

  const handleOpenTaskModal = (taskToEdit?: Task) => {
    if (!currentUser || currentUser.role === UserRole.VIEWER) {
        addNotification({type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "Viewers cannot manage tasks."});
        return;
    }
    if (currentUser.role === UserRole.FINANCE && (!taskToEdit || taskToEdit.assignee !== currentUser.name) ) {
         addNotification({type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "Finance role can only manage tasks assigned to them."});
        if (!taskToEdit) return; 
    }

    setTaskError(null);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setNewTask({...taskToEdit, priority: taskToEdit.priority || TaskPriority.MEDIUM});
    } else {
      setEditingTask(null);
      setNewTask({ 
        title: '', description: '', status: TaskStatus.TODO, divisionTag: DIVISION_OPTIONS[0], 
        contentPillarTag: CONTENT_PILLAR_OPTIONS[CONTENT_PILLAR_OPTIONS.length -1], 
        projectId: selectedProjectId || projects[0]?.id || '', 
        assignee: '', startDate: new Date().toISOString().split('T')[0], duration: 5, 
        priority: TaskPriority.MEDIUM, 
      });
    }
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setNewTask({ title: '', description: '', status: TaskStatus.TODO, divisionTag: DIVISION_OPTIONS[0], contentPillarTag: CONTENT_PILLAR_OPTIONS[CONTENT_PILLAR_OPTIONS.length -1], projectId: '', assignee: '', priority: TaskPriority.MEDIUM });
    setTaskError(null);
  }, []);

  const handleSaveTask = async () => {
    if (!currentUser || currentUser.role === UserRole.VIEWER) {
        setTaskError("Permission denied.");
        return;
    }
    if (currentUser.role === UserRole.FINANCE && editingTask?.assignee !== currentUser.name && !editingTask) {
        setTaskError("Finance role can only manage tasks assigned to them.");
        return;
    }
    if (!newTask.title || !newTask.projectId) { 
      setTaskError("Title and Project are required for a task."); 
      return;
    }
    setIsSavingTask(true);
    setTaskError(null);
    await new Promise(resolve => setTimeout(resolve, API_SIMULATION_DELAY));

    try {
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
          priority: newTask.priority || TaskPriority.MEDIUM, 
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
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!currentUser || currentUser.role === UserRole.VIEWER || 
        (currentUser.role === UserRole.SCRIPT_WRITER && taskToDelete?.status !== TaskStatus.TODO && taskToDelete?.status !== TaskStatus.IN_PROGRESS) ||
        (currentUser.role === UserRole.FINANCE && taskToDelete?.assignee !== currentUser.name)
    ) {
        addNotification({type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "You don't have permission to delete this task."});
        return;
    }
    if (window.confirm("Are you sure you want to delete this task?")) {
        await new Promise(resolve => setTimeout(resolve, API_SIMULATION_DELAY)); 
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
    if (!currentUser || !taskToUpdate || currentUser.role === UserRole.VIEWER) {
        addNotification({type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "Permission denied or task not found."});
        return;
    }
    if (currentUser.role === UserRole.SCRIPT_WRITER && ![TaskStatus.IN_REVIEW, TaskStatus.IN_PROGRESS, TaskStatus.TODO, TaskStatus.BLOCKED].includes(newStatus)) {
        addNotification({type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "Script Writers cannot move tasks to this status."});
        return;
    }
    if (currentUser.role === UserRole.FINANCE && taskToUpdate.assignee !== currentUser.name && ![TaskStatus.DONE, TaskStatus.BLOCKED].includes(newStatus)) { 
         addNotification({type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "Finance role has limited status update capabilities."});
        return;
    }


    const oldTasks = tasks; 
    const updatedTaskOptimistic = { ...taskToUpdate, status: newStatus, updatedAt: new Date().toISOString() };
    setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? updatedTaskOptimistic : t));

    await new Promise(resolve => setTimeout(resolve, API_SIMULATION_DELAY)); 
    try {
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
      setTasks(oldTasks);
      addNotification({
        type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE,
        message: `Failed to update status for "${taskToUpdate.title.substring(0,20)}...".`,
      });
    }
  };
  
  const getTasksForSelectedProject = useCallback(() => {
    if (!selectedProjectId) return [];
    return tasks.filter(task => task.projectId === selectedProjectId);
  }, [tasks, selectedProjectId]);
  
  const handleAssetNotification = useCallback((message: string, assetType: AssetType) => {
      addNotification({
          type: NotificationType.ASSET_CREATED, 
          iconType: NotificationIconType.FOLDER, 
          message: message,
          relatedItemType: 'asset',
      });
  }, [addNotification]);


  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        const dashboardActiveProjectsCount = projects.filter(p => p.status === ProjectStatus.ACTIVE).length;
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
                    <p className="text-text-secondary">Here's a quick overview of your ShiftedOS workspace. Your role: <Tag text={currentUser?.role || ''} color="highlight" size="sm" />
                    </p>
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
                        <p className="text-3xl font-bold text-text-primary">{dashboardActiveProjectsCount}</p>
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
                        className={`bg-white p-5 rounded-xl shadow-glass-depth border border-gray-200/50 transition-shadow 
                                    ${currentUser && [UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.PROJECT_MANAGER].includes(currentUser.role) ? 'cursor-pointer hover:shadow-strong' : 'opacity-70 cursor-not-allowed'}`}
                        onClick={() => currentUser && [UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.PROJECT_MANAGER].includes(currentUser.role) && handleOpenTaskModal()}
                        title={!(currentUser && [UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.PROJECT_MANAGER].includes(currentUser.role)) ? "Not allowed to add tasks" : "Quickly create a new task"}
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
                      currentUserRole={currentUser?.role || UserRole.VIEWER}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        }
      case 'assets': return <AssetView onAddNotification={handleAssetNotification} />;
      case 'team': return <TeamView users={users} roles={roles} currentUser={currentUser} onAddNewUser={handleAddNewUser} onEditUserRole={handleEditUserRole} />;
      case 'analytics': 
        return (
            <AnalyticsView 
                initialConfig={analyticsConfig}
                activeProjectsCount={dynamicActiveProjectsCount}
                tasksCompletedCount={dynamicTasksCompletedCount}
                totalContentViews={dynamicTotalContentViews}
                teamEngagement={dynamicTeamEngagement}
            />
        );
      case 'finance': return <FinanceView currentUser={currentUser} projects={projects} tasks={tasks} />;
      case 'crm': return <CrmView />;
      case 'knowledge': return <KnowledgeBaseView />;
      case 'okr': return <OkrView />;
      case 'reports': return <ReportView projects={projects} tasks={tasks} users={users} currentUser={currentUser} />;
      case 'profile': 
        return <ProfileView 
                  currentUser={currentUser} 
                  onUpdateProfile={handleUpdateUserProfile} 
                  onLogout={handleLogout} 
                  isLoading={isUpdatingProfile} 
                  error={profileError}
                />;
      case 'admin':
        return currentUser?.email === MOCK_ADMIN_USER.email ? ( 
            <AdminView 
                currentTheme={currentTheme}
                defaultTheme={DEFAULT_THEME}
                onThemeChange={applyTheme}
                mockUsers={users}
                mockProjects={projects}
                mockTasks={tasks}
                initialAnalyticsConfig={analyticsConfig}
                onAnalyticsConfigChange={setAnalyticsConfig}
                onAddNewUser={handleAddNewUser}
                onEditUserRole={handleEditUserRole}
                rolesList={MOCK_ROLES_LIST}
            />
        ) : (
            <div className="bg-white rounded-xl p-10 shadow-glass-depth text-center">
                <p className="text-xl text-text-secondary">Access Denied. This area is for administrators only.</p>
            </div>
        );
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
        { id: 'dashboard', label: 'Dashboard' }, { id: 'assets', label: 'Asset Inventory' },
        { id: 'team', label: 'Team Management' }, { id: 'analytics', label: 'Analytics & Insights' },
        { id: 'finance', label: 'Finance & Budgeting' }, { id: 'crm', label: 'Relations & Collaborators' },
        { id: 'knowledge', label: 'Knowledge Base' }, { id: 'okr', label: 'Objectives & OKRs' },
        { id: 'reports', label: 'Report Builder' }, { id: 'profile', label: 'User Profile'}, 
        { id: 'admin', label: 'Admin Panel'},
    ].find(i => i.id === activeView);
    return item ? item.label : 'ShiftedOS';
  }

  const getHeaderPrimaryAction = () => {
    if (!currentUser) return undefined;
    const role = currentUser.role;

    if (activeView === 'tasks') {
        if (selectedProjectId) { 
            if ([UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.PROJECT_MANAGER].includes(role)) {
                return () => handleOpenTaskModal();
            }
        } else { 
            if ([UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER].includes(role)) {
                return () => handleOpenProjectModal();
            }
        }
    }
    return undefined; 
  };

  const getHeaderPrimaryActionLabel = () => {
    if (!currentUser) return undefined;
    const role = currentUser.role;
     if (activeView === 'tasks') {
        if (selectedProjectId) {
            if ([UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.PROJECT_MANAGER].includes(role)) return 'New Task';
        } else {
            if ([UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER].includes(role)) return 'New Project';
        }
    }
    return undefined; 
  };
  
  const getHeaderPrimaryActionIcon = () => {
     if (!currentUser) return undefined;
     const role = currentUser.role;
     if (activeView === 'tasks') {
        if (selectedProjectId) {
            if ([UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.PROJECT_MANAGER].includes(role)) return <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />;
        } else {
            if ([UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER].includes(role)) return <ProjectIcon className="w-4 h-4 sm:w-5 sm:h-5" />;
        }
    }
    return undefined;
  }
  
  const isPrimaryActionEnabledForCurrentUser = () => {
    if(!currentUser) return false;
    const role = currentUser.role;
    if (activeView === 'tasks') {
        if (selectedProjectId) {
            return [UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.PROJECT_MANAGER].includes(role);
        } else {
            return [UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER].includes(role);
        }
    }
    return false; 
  };


  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const toggleDesktopSidebarCollapse = () => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed);

  useEffect(() => {
    if (isAuthenticated && activeView === 'login') { 
      setActiveView('dashboard'); 
    }
  }, [isAuthenticated, activeView]);

  if (!isAuthenticated) {
    return (
      <LandingPage 
        onLogin={handleLogin} 
        onQuickLoginAsRole={handleLoginAsRole} 
        loginError={loginError} 
        isLoading={isLoggingIn} 
      />
    );
  }
  
  const userOptionsForTaskModal = users
    .filter(user => user.role !== UserRole.VIEWER) 
    .map(user => ({ value: user.name, label: `${user.name} (${user.role})` })); 

  const getTaskStatusOptionsForCurrentUser = (task?: Task | null): {value: TaskStatus, label: string}[] => {
    if (!currentUser) return [];
    if ([UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER].includes(currentUser.role)) {
      return TASK_STATUS_OPTIONS.map(s => ({value: s, label: s})); 
    }
    if (currentUser.role === UserRole.SCRIPT_WRITER) {
      if (task && (task.status === TaskStatus.DONE || task.status === TaskStatus.PUBLISHED)) { 
        return [{value: task.status, label: task.status}]; 
      }
      return [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW, TaskStatus.BLOCKED].map(s => ({value: s, label: s}));
    }
    if (currentUser.role === UserRole.FINANCE && task && task.assignee === currentUser.name) {
       if (task && (task.status === TaskStatus.DONE || task.status === TaskStatus.PUBLISHED)) {
        return [{value: task.status, label: task.status}];
      }
      return [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.BLOCKED, TaskStatus.DONE].map(s => ({value: s, label: s}));
    }
    return task ? [{value: task.status, label: task.status}] : [];
  };


  return (
    <div className="flex h-screen bg-main-background text-text-primary overflow-hidden">
      <Sidebar 
        activeView={activeView} 
        setActiveView={(viewId) => { setActiveView(viewId); setSelectedProjectId(null); }} 
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
        toggleDesktopSidebarCollapse={toggleDesktopSidebarCollapse}
        currentUser={currentUser}
      />
      <div className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ease-in-out 
                      ${isDesktopSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <Header 
          title={getHeaderTitle()} 
          onPrimaryAction={getHeaderPrimaryAction()} 
          primaryActionButtonLabel={getHeaderPrimaryActionLabel()}
          primaryActionIcon={getHeaderPrimaryActionIcon()}
          isPrimaryActionEnabled={isPrimaryActionEnabledForCurrentUser()}
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

      <Modal isOpen={isTaskModalOpen && (activeView === 'tasks' || activeView === 'dashboard')} onClose={handleCloseTaskModal} title={editingTask ? 'Edit Task' : 'Create New Task'} size="xl">
        <form onSubmit={(e) => { e.preventDefault(); handleSaveTask(); }} className="space-y-4 md:space-y-6">
          {taskError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">{taskError}</div>}
          <fieldset disabled={isSavingTask || !currentUser || currentUser.role === UserRole.VIEWER || (currentUser.role === UserRole.FINANCE && editingTask?.assignee !== currentUser.name && !editingTask) }>
            <SelectInput
              label="Project" name="projectId" value={newTask.projectId || ''} onChange={handleTaskInputChange}
              options={projects.map(p => ({ value: p.id, label: p.name }))} required
              className="bg-white" placeholder="Select a project"
              disabled={ (currentUser?.role === UserRole.SCRIPT_WRITER && !!editingTask) || (currentUser?.role === UserRole.FINANCE && !!editingTask)}
            />
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">Task Title</label>
              <input type="text" name="title" id="title" value={newTask.title || ''} onChange={handleTaskInputChange} required 
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="Enter task title"
                     disabled={currentUser?.role === UserRole.FINANCE && editingTask?.assignee !== currentUser.name}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Task Description</label>
              <textarea name="description" id="description" value={newTask.description || ''} onChange={handleTaskInputChange} rows={newTask.divisionTag === Division.SHIFTFACT && newTask.contentPillarTag === ContentPillar.PERSPEKTIF ? 6 : 3} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="Describe the task..."
                        disabled={currentUser?.role === UserRole.FINANCE && editingTask?.assignee !== currentUser.name}
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <SelectInput label="Priority" name="priority" value={newTask.priority || TaskPriority.MEDIUM} onChange={handleTaskInputChange}
                           options={TASK_PRIORITY_OPTIONS} className="bg-white"
                           disabled={currentUser?.role === UserRole.FINANCE && editingTask?.assignee !== currentUser.name}
              />
              <SelectInput label="Status" name="status" value={newTask.status || ''} onChange={handleTaskInputChange} 
                           options={getTaskStatusOptionsForCurrentUser(editingTask || newTask as Task)} 
                           className="bg-white" 
                           disabled={currentUser?.role === UserRole.SCRIPT_WRITER && (newTask.status === TaskStatus.DONE || newTask.status === TaskStatus.PUBLISHED)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectInput label="Assignee" name="assignee" value={newTask.assignee || ''} onChange={handleTaskInputChange} options={userOptionsForTaskModal} placeholder="Unassigned" 
                           className="bg-white"
                           disabled={currentUser?.role === UserRole.SCRIPT_WRITER && !!editingTask && editingTask.assignee !== currentUser.name && editingTask.assignee !== ''} 
              />
               <SelectInput label="Division Tag" name="divisionTag" value={newTask.divisionTag || ''} onChange={handleTaskInputChange} options={DIVISION_OPTIONS.map(d => ({value: d, label: d}))} 
                           className="bg-white" disabled={currentUser?.role === UserRole.FINANCE && editingTask?.assignee !== currentUser.name} />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectInput label="Content Pillar" name="contentPillarTag" value={newTask.contentPillarTag || ''} onChange={handleTaskInputChange} options={CONTENT_PILLAR_OPTIONS.map(p => ({value: p, label: p}))} 
                           className="bg-white" disabled={currentUser?.role === UserRole.FINANCE && editingTask?.assignee !== currentUser.name} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary mb-1">Start Date</label>
                <input type="date" name="startDate" id="startDate" value={newTask.startDate || ''} onChange={handleTaskInputChange} 
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white"
                       disabled={currentUser?.role === UserRole.FINANCE && editingTask?.assignee !== currentUser.name}
                />
              </div>
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-text-secondary mb-1">Deadline</label>
                <input type="date" name="deadline" id="deadline" value={newTask.deadline || ''} onChange={handleTaskInputChange} 
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white"
                       disabled={currentUser?.role === UserRole.FINANCE && editingTask?.assignee !== currentUser.name}
                />
              </div>
               <div>
                <label htmlFor="duration" className="block text-sm font-medium text-text-secondary mb-1">Est. Duration (days)</label>
                <input type="number" name="duration" id="duration" value={newTask.duration || ''} onChange={handleTaskInputChange} min="0" 
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white"
                       disabled={currentUser?.role === UserRole.FINANCE && editingTask?.assignee !== currentUser.name}
                />
              </div>
            </div>
          </fieldset>
          <div className="pt-5 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <Button type="button" variant="ghost" onClick={handleCloseTaskModal} disabled={isSavingTask} className="w-full sm:w-auto">Cancel</Button>
            <Button type="submit" variant="primary" 
                    disabled={isSavingTask || !currentUser || currentUser.role === UserRole.VIEWER || (currentUser.role === UserRole.FINANCE && editingTask?.assignee !== currentUser.name && !editingTask)} 
                    className="w-full sm:w-auto">
              {isSavingTask ? 'Saving...' : (editingTask ? 'Save Changes' : 'Create Task')}
            </Button>
          </div>
        </form>
      </Modal>

       <Modal isOpen={isProjectModalOpen && activeView === 'tasks'} onClose={handleCloseProjectModal} title={editingProject ? 'Edit Project' : 'Create New Project'} size="lg">
        <form onSubmit={(e) => { e.preventDefault(); handleSaveProject(); }} className="space-y-4">
           {projectError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">{projectError}</div>}
          <fieldset disabled={isSavingProject || (currentUser && ![UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER].includes(currentUser.role))}>
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-text-secondary mb-1">Project Name</label>
              <input type="text" name="name" id="projectName" value={newProject.name || ''} onChange={handleProjectInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white"/>
            </div>
            <div>
              <label htmlFor="projectDescription" className="block text-sm font-medium text-text-secondary mb-1">Description</label>
              <textarea name="description" id="projectDescription" value={newProject.description || ''} onChange={handleProjectInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white"></textarea>
            </div>
             <div>
              <label htmlFor="proofOfWorkUrl" className="block text-sm font-medium text-text-secondary mb-1">Proof of Work URL (Optional)</label>
              <input type="url" name="proofOfWorkUrl" id="proofOfWorkUrl" value={newProject.proofOfWorkUrl || ''} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="https://example.com/proof"/>
            </div>
            { (currentUser && [UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER, UserRole.FINANCE].includes(currentUser.role)) &&
                <div>
                    <label htmlFor="projectBudget" className="block text-sm font-medium text-text-secondary mb-1">Budget (Rp)</label>
                    <input 
                        type="number" name="budget" id="projectBudget" value={newProject.budget || ''} 
                        onChange={handleProjectInputChange} min="0" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white"
                        disabled={currentUser?.role === UserRole.FINANCE} 
                    />
                </div>
            }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <SelectInput label="Status" name="status" value={newProject.status || ''} onChange={handleProjectInputChange} options={PROJECT_STATUS_OPTIONS.map(s => ({value: s, label: s}))} className="bg-white" />
               <div>
                  <label htmlFor="projectOwner" className="block text-sm font-medium text-text-secondary mb-1">Owner (Team/User)</label>
                  <input type="text" name="owner" id="projectOwner" value={newProject.owner || ''} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="e.g., Marketing Team"/>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="projectStartDate" className="block text-sm font-medium text-text-secondary mb-1">Start Date</label>
                <input type="date" name="startDate" id="projectStartDate" value={newProject.startDate || ''} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white"/>
              </div>
              <div>
                <label htmlFor="projectEndDate" className="block text-sm font-medium text-text-secondary mb-1">End Date</label>
                <input type="date" name="endDate" id="projectEndDate" value={newProject.endDate || ''} onChange={handleProjectInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white"/>
              </div>
            </div>
          </fieldset>
          <div className="pt-5 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <Button type="button" variant="ghost" onClick={handleCloseProjectModal} disabled={isSavingProject} className="w-full sm:w-auto">Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSavingProject || (currentUser && ![UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER].includes(currentUser.role))} className="w-full sm:w-auto">
              {isSavingProject ? 'Saving...' : (editingProject ? 'Save Changes' : 'Create Project')}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default App;