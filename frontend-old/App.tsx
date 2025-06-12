import React, { useState, useCallback, useEffect } from 'react';

// --- CHANGE 1: Import all necessary Firebase modules ---
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getDocs, onSnapshot, doc, getDoc } from "firebase/firestore";
import { auth, db } from './src/firebase'; // This imports the connection you set up

// Component Imports
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProjectCard from './components/ProjectCard';
import Modal from './components/Modal';
import Button from './components/Button';
import SelectInput from './components/SelectInput';
import Tag from './components/Tag';
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

// Icon Imports
import PlusIcon from './components/icons/PlusIcon';
import ProjectIcon from './components/icons/ProjectIcon';
import BellIcon from './components/icons/BellIcon';
import FolderIcon from './components/icons/FolderIcon';

// Type and Constant Imports
import { Task, TaskStatus, Division, ContentPillar, User, Notification, NotificationType, NotificationIconType, Project, ProjectStatus, AssetType, Role, ThemeColors, UserRole, AnalyticsConfig, TaskPriority } from './types';
import { TASK_STATUS_OPTIONS, DIVISION_OPTIONS, CONTENT_PILLAR_OPTIONS, NASKAH_TEMPLATE, PROJECT_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from './constants';


// MOCK DATA - Kept for non-Firestore dropdowns and reference
const MOCK_ROLES_LIST: Role[] = [ { id: 'ROLE-001', name: 'Admin', description: 'Manages the entire ShiftedOS platform.' }, { id: 'ROLE-002', name: 'Editor', description: 'Oversees projects, tasks, and content quality.' }, { id: 'ROLE-003', name: 'Script Writer', description: 'Focuses on creating and managing task content, especially scripts.' }, { id: 'ROLE-004', name: 'Viewer', description: 'Has read-only access to most platform data.' }, { id: 'ROLE-005', name: 'Finance', description: 'Manages financial data and budgeting.' }, { id: 'ROLE-006', name: 'Project Manager', description: 'Manages projects, timelines, and team assignments.' },];
const DEFAULT_THEME: ThemeColors = { mainBackground: '#F5ECE0', glassBg: 'rgba(255, 255, 255, 0.35)', mainAccent: '#336D82', secondaryAccent: '#5F99AE', highlight: '#693382', textPrimary: '#1F2937', textSecondary: '#6B7280',};
const DEFAULT_ANALYTICS_CONFIG: AnalyticsConfig = { metricVisibility: { activeProjects: true, tasksCompleted: true, totalContentViews: true, teamEngagement: true, }, chartType: 'Bar Chart',};


const App: React.FC = () => {
  // --- STATE DECLARATIONS ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [activeView, setActiveView] = useState<string>('dashboard'); 
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- CHANGE 2: Initialize state with empty arrays, not mock data ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // The rest of the state declarations
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({ name: '', description: '', status: ProjectStatus.PLANNING, budget: 0, proofOfWorkUrl: '' });
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({ title: '', description: '', status: TaskStatus.TODO, divisionTag: DIVISION_OPTIONS[0], contentPillarTag: CONTENT_PILLAR_OPTIONS[CONTENT_PILLAR_OPTIONS.length -1], projectId: '', assignee: '', priority: TaskPriority.MEDIUM });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES_LIST);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeColors>(DEFAULT_THEME);
  const [analyticsConfig, setAnalyticsConfig] = useState<AnalyticsConfig>(DEFAULT_ANALYTICS_CONFIG);


  // --- CHANGE 3: Add useEffect to fetch live data from Firestore ---
  useEffect(() => {
    // This hook runs whenever the user's authentication state changes
    if (isAuthenticated && currentUser) {
      setIsLoading(true);
      
      // This function fetches data that doesn't need to be real-time
      const fetchStaticData = async () => {
        try {
          const projectsQuery = getDocs(collection(db, "projects"));
          const usersQuery = getDocs(collection(db, "users"));
          
          const [projectsSnapshot, usersSnapshot] = await Promise.all([projectsQuery, usersQuery]);

          const projectsList = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
          const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
          
          setProjects(projectsList);
          setUsers(usersList);

        } catch (error) {
          console.error("Failed to fetch static data:", error);
          addNotification({ type: NotificationType.ERROR, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "Could not load projects or user data." });
        }
      };

      // Set up a real-time listener for the tasks collection for live updates
      const tasksQuery = collection(db, "tasks");
      const unsubscribeTasks = onSnapshot(tasksQuery, (querySnapshot) => {
        const tasksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[];
        setTasks(tasksList);
        setIsLoading(false); // We consider loading finished after the first real-time update of tasks
      }, (error) => {
        console.error("Error listening to tasks:", error);
        addNotification({ type: NotificationType.ERROR, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "Could not load tasks." });
        setIsLoading(false);
      });

      fetchStaticData();

      // This is a cleanup function. It runs when the user logs out.
      return () => unsubscribeTasks();
    } else {
        // If user logs out, clear all data
        setProjects([]);
        setTasks([]);
        setUsers([]);
    }
  }, [isAuthenticated, currentUser]);


  // --- CHANGE 4: Replace mock authentication with real Firebase Auth ---
  const handleLogin = async (email: string, pass: string) => {
    setIsLoggingIn(true);
    setLoginError(undefined);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;

      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setCurrentUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: userData.name,
          role: userData.role,
          roleName: userData.roleName,
          bio: userData.bio,
          avatarUrl: userData.avatarUrl,
        } as User);
        setIsAuthenticated(true);
        setActiveView('dashboard');
        addNotification({
          type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.BELL,
          message: `Welcome back, ${userData.name || 'User'}!`,
        });
      } else {
        await signOut(auth); // Important: Log out user from Auth if they have no DB record
        throw new Error("User profile not found in database. Please contact an admin.");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.code === 'auth/invalid-credential') {
        setLoginError('Invalid email or password.');
      } else {
        setLoginError(error.message);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setCurrentUser(null);
      setActiveView('dashboard');
      setSelectedProjectId(null);
      setNotifications([]);
    } catch (error) {
      console.error("Logout failed:", error);
      addNotification({type: NotificationType.ERROR, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "Logout failed."});
    }
  };

  
  // --- CHANGE 5: Temporarily disable all "write" functions by showing an alert ---
  const handleUpdateUserProfile = async (updatedProfile: Partial<User>) => alert("Feature not connected yet: Update User Profile");
  const handleSaveProject = async () => alert("Feature not connected yet: Save Project");
  const handleDeleteProject = async (projectIdToDelete: string) => alert("Feature not connected yet: Delete Project");
  const handleSaveTask = async () => alert("Feature not connected yet: Save Task");
  const handleDeleteTask = async (taskId: string) => alert("Feature not connected yet: Delete Task");
  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => alert("Feature not connected yet: Update Task Status");
  const handleAddNewUser = async (name: string, email: string, role: UserRole, pass: string) => { alert("Feature not connected yet: Add New User"); return false; };
  const handleEditUserRole = async (userId: string, newRole: UserRole) => alert("Feature not connected yet: Edit User Role");
  

  // --- The rest of your file (utility functions and JSX) remains largely the same. ---
  // --- It will now use the live data from the 'projects', 'tasks', and 'currentUser' state. ---
  
  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = { ...notificationData, id: `NTF-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, timestamp: new Date().toISOString(), read: false, };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
  }, []);
  const handleMarkNotificationAsRead = useCallback((id: string) => { setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)); }, []);
  const handleMarkAllNotificationsAsRead = useCallback(() => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); }, []);
  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const handleProjectInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "budget") { setNewProject(prev => ({ ...prev, [name]: parseFloat(value) || 0 })); } 
    else { setNewProject(prev => ({ ...prev, [name]: value })); }
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
  
  const handleTaskInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value as TaskStatus | Division | ContentPillar | TaskPriority }));
    if (name === "contentPillarTag" && value === ContentPillar.PERSPEKTIF) { if (newTask.divisionTag === Division.SHIFTFACT && currentUser?.role !== UserRole.VIEWER) { setNewTask(prev => ({...prev, description: NASKAH_TEMPLATE})); } } 
    else if (name === "divisionTag" && newTask.contentPillarTag === ContentPillar.PERSPEKTIF) { if (value === Division.SHIFTFACT && currentUser?.role !== UserRole.VIEWER) { setNewTask(prev => ({...prev, description: NASKAH_TEMPLATE})); } else if (newTask.description === NASKAH_TEMPLATE) { setNewTask(prev => ({...prev, description: ''})); } }
  }, [newTask, currentUser?.role]);

  const handleOpenTaskModal = (taskToEdit?: Task) => {
    if (!currentUser || currentUser.role === UserRole.VIEWER) { addNotification({type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "Viewers cannot manage tasks."}); return; }
    if (currentUser.role === UserRole.FINANCE && (!taskToEdit || taskToEdit.assignee !== currentUser.name) ) { if (!taskToEdit) { addNotification({type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "Finance role can only manage tasks assigned to them."}); return; } }
    setTaskError(null);
    if (taskToEdit) { setEditingTask(taskToEdit); setNewTask({...taskToEdit, priority: taskToEdit.priority || TaskPriority.MEDIUM}); } 
    else { setEditingTask(null); setNewTask({ title: '', description: '', status: TaskStatus.TODO, divisionTag: DIVISION_OPTIONS[0], contentPillarTag: CONTENT_PILLAR_OPTIONS[CONTENT_PILLAR_OPTIONS.length -1], projectId: selectedProjectId || projects[0]?.id || '', assignee: '', startDate: new Date().toISOString().split('T')[0], duration: 5, priority: TaskPriority.MEDIUM, }); }
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setNewTask({ title: '', description: '', status: TaskStatus.TODO, divisionTag: DIVISION_OPTIONS[0], contentPillarTag: CONTENT_PILLAR_OPTIONS[CONTENT_PILLAR_OPTIONS.length -1], projectId: '', assignee: '', priority: TaskPriority.MEDIUM });
    setTaskError(null);
  }, []);

  const getTasksForSelectedProject = useCallback(() => tasks.filter(task => task.projectId === selectedProjectId), [tasks, selectedProjectId]);
  const handleAssetNotification = useCallback((message: string, assetType: AssetType) => { addNotification({ type: NotificationType.ASSET_CREATED, iconType: NotificationIconType.FOLDER, message: message, relatedItemType: 'asset', }); }, [addNotification]);
  
  const renderContent = () => {
    if (isLoading || isLoggingIn) {
        return <div className="flex justify-center items-center h-full"><p className="text-xl text-text-secondary animate-pulse">Loading Workspace...</p></div>;
    }
    
    switch (activeView) {
      case 'dashboard':
        const activeProjectsCount = projects.filter(p => p.status === ProjectStatus.ACTIVE).length;
        const tasksDueSoonCount = tasks.filter(t => { if (!t.deadline) return false; const deadlineDate = new Date(t.deadline); const today = new Date(); const threeDaysFromNow = new Date(); threeDaysFromNow.setDate(today.getDate() + 3); return deadlineDate <= threeDaysFromNow && t.status !== TaskStatus.DONE && t.status !== TaskStatus.PUBLISHED; }).length;
        return ( <div className="space-y-6"> <div className="bg-white p-6 sm:p-8 rounded-xl shadow-glass-depth border border-gray-200/50"> <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary mb-2"> Welcome back, <span className="text-main-accent">{currentUser?.name?.split(' ')[0] || 'User'}</span>! </h1> <p className="text-text-secondary">Here's a quick overview of your ShiftedOS workspace. Your role: <Tag text={currentUser?.role || ''} color="highlight" size="sm" /> </p> </div> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"> <div className="bg-white p-5 rounded-xl shadow-glass-depth border border-gray-200/50 cursor-pointer hover:shadow-strong transition-shadow" onClick={() => { setActiveView('tasks'); setSelectedProjectId(null); }}> <div className="flex items-center text-main-accent mb-2"> <ProjectIcon className="w-7 h-7 mr-3" /> <h3 className="text-lg font-semibold">Active Projects</h3> </div> <p className="text-3xl font-bold text-text-primary">{activeProjectsCount}</p> <p className="text-xs text-text-secondary mt-1">View All Projects &rarr;</p> </div> <div className="bg-white p-5 rounded-xl shadow-glass-depth border border-gray-200/50 cursor-pointer hover:shadow-strong transition-shadow" onClick={() => { setActiveView('tasks'); setSelectedProjectId(null); }}> <div className="flex items-center text-highlight mb-2"> <BellIcon className="w-7 h-7 mr-3" /> <h3 className="text-lg font-semibold">Tasks Due Soon</h3> </div> <p className="text-3xl font-bold text-text-primary">{tasksDueSoonCount}</p> <p className="text-xs text-text-secondary mt-1">Manage Upcoming Deadlines &rarr;</p> </div> <div className={`bg-white p-5 rounded-xl shadow-glass-depth border border-gray-200/50 transition-shadow ${currentUser && [UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.PROJECT_MANAGER].includes(currentUser.role) ? 'cursor-pointer hover:shadow-strong' : 'opacity-70 cursor-not-allowed'}`} onClick={() => currentUser && [UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.PROJECT_MANAGER].includes(currentUser.role) && handleOpenTaskModal()} title={!(currentUser && [UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.PROJECT_MANAGER].includes(currentUser.role)) ? "Not allowed to add tasks" : "Quickly create a new task"}> <div className="flex items-center text-secondary-accent mb-2"> <PlusIcon className="w-7 h-7 mr-3" /> <h3 className="text-lg font-semibold">Quick Add Task</h3> </div> <p className="text-text-secondary">Quickly create a new task.</p> <p className="text-xs text-text-secondary mt-1">Add to a Project &rarr;</p> </div> </div> </div> );
      case 'tasks':
        if (selectedProjectId) {
          const currentProject = projects.find(p => p.id === selectedProjectId);
          const projectTasks = getTasksForSelectedProject();
          if (!currentProject) { return ( <div className="bg-white rounded-xl p-10 shadow-glass-depth text-center"> <p className="text-text-secondary text-lg">Project not found.</p> <Button variant="ghost" size="sm" onClick={() => setSelectedProjectId(null)} className="mt-4"> &larr; Back to Projects </Button> </div> ); }
          return ( <ProjectDetailView project={currentProject} tasks={projectTasks} onBackToProjects={() => setSelectedProjectId(null)} /> );
        } else {
          return ( <div> <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-3"> <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary">All Projects</h2> </div> {projects.length === 0 ? ( <div className="bg-white rounded-xl p-10 shadow-glass-depth text-center"> <p className="text-text-secondary text-lg">No projects yet. Create your first project!</p> </div> ) : ( <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"> {projects.map(project => ( <ProjectCard key={project.id} project={project} onViewTasks={() => setSelectedProjectId(project.id)} onEdit={() => handleOpenProjectModal(project)} onDelete={() => handleDeleteProject(project.id)} currentUserRole={currentUser?.role || UserRole.VIEWER} /> ))} </div> )} </div> );
        }
      case 'assets': return <AssetView onAddNotification={handleAssetNotification} />;
      case 'team': return <TeamView users={users} roles={roles} currentUser={currentUser} onAddNewUser={handleAddNewUser} onEditUserRole={handleEditUserRole} />;
      case 'analytics': return ( <AnalyticsView initialConfig={analyticsConfig} activeProjectsCount={projects.filter(p => p.status === ProjectStatus.ACTIVE).length} tasksCompletedCount={tasks.filter(t => t.status === TaskStatus.DONE || t.status === TaskStatus.PUBLISHED).length} totalContentViews={25600} teamEngagement={"85%"} /> );
      case 'finance': return <FinanceView currentUser={currentUser} projects={projects} tasks={tasks} />;
      case 'crm': return <CrmView />;
      case 'knowledge': return <KnowledgeBaseView />;
      case 'okr': return <OkrView />;
      case 'reports': return <ReportView projects={projects} tasks={tasks} users={users} currentUser={currentUser} />;
      case 'profile': return <ProfileView currentUser={currentUser} onUpdateProfile={handleUpdateUserProfile} onLogout={handleLogout} isLoading={isUpdatingProfile} error={profileError} />;
      case 'admin': return currentUser?.role === UserRole.ADMIN ? ( <AdminView currentTheme={currentTheme} defaultTheme={DEFAULT_THEME} onThemeChange={() => {}} mockUsers={users} mockProjects={projects} mockTasks={tasks} initialAnalyticsConfig={analyticsConfig} onAnalyticsConfigChange={setAnalyticsConfig} onAddNewUser={handleAddNewUser} onEditUserRole={handleEditUserRole} rolesList={MOCK_ROLES_LIST} /> ) : ( <div className="bg-white rounded-xl p-10 shadow-glass-depth text-center"> <p className="text-xl text-text-secondary">Access Denied. This area is for administrators only.</p> </div> );
      default: return ( <div className="bg-white rounded-xl p-10 shadow-glass-depth text-center"> <p className="text-xl text-text-secondary">Select a module to get started.</p> </div> );
    }
  };

  const getHeaderTitle = () => {
    if (activeView === 'tasks') { if (selectedProjectId) { const project = projects.find(p => p.id === selectedProjectId); return project ? `${project.name}` : 'Project Details'; } return 'Projects'; }
    const item = [ { id: 'dashboard', label: 'Dashboard' }, { id: 'assets', label: 'Asset Inventory' }, { id: 'team', label: 'Team Management' }, { id: 'analytics', label: 'Analytics & Insights' }, { id: 'finance', label: 'Finance & Budgeting' }, { id: 'crm', label: 'Relations & Collaborators' }, { id: 'knowledge', label: 'Knowledge Base' }, { id: 'okr', label: 'Objectives & OKRs' }, { id: 'reports', label: 'Report Builder' }, { id: 'profile', label: 'User Profile'}, { id: 'admin', label: 'Admin Panel'}, ].find(i => i.id === activeView);
    return item ? item.label : 'ShiftedOS';
  }

  const getHeaderPrimaryAction = () => { if (!currentUser) return undefined; const role = currentUser.role; if (activeView === 'tasks') { if (selectedProjectId) { if ([UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.PROJECT_MANAGER].includes(role)) { return () => handleOpenTaskModal(); } } else { if ([UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER].includes(role)) { return () => handleOpenProjectModal(); } } } return undefined; };
  const getHeaderPrimaryActionLabel = () => { if (!currentUser) return undefined; const role = currentUser.role; if (activeView === 'tasks') { if (selectedProjectId) { if ([UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.PROJECT_MANAGER].includes(role)) return 'New Task'; } else { if ([UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER].includes(role)) return 'New Project'; } } return undefined; };
  const getHeaderPrimaryActionIcon = () => { if (!currentUser) return undefined; const role = currentUser.role; if (activeView === 'tasks') { if (selectedProjectId) { if ([UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.PROJECT_MANAGER].includes(role)) return <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />; } else { if ([UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER].includes(role)) return <ProjectIcon className="w-4 h-4 sm:w-5 sm:h-5" />; } } return undefined; }
  const isPrimaryActionEnabledForCurrentUser = () => { if(!currentUser) return false; const role = currentUser.role; if (activeView === 'tasks') { if (selectedProjectId) { return [UserRole.ADMIN, UserRole.EDITOR, UserRole.SCRIPT_WRITER, UserRole.PROJECT_MANAGER].includes(role); } else { return [UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER].includes(role); } } return false; };

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const toggleDesktopSidebarCollapse = () => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed);

  const handleLoginAsRole = (role: UserRole) => { /* Mock function, no longer needed */ };
  
  if (!isAuthenticated) {
    return ( <LandingPage onLogin={handleLogin} onQuickLoginAsRole={handleLoginAsRole} loginError={loginError} isLoading={isLoggingIn} /> );
  }
  
  const userOptionsForTaskModal = users.filter(user => user.role !== UserRole.VIEWER).map(user => ({ value: user.name, label: `${user.name} (${user.role})` }));
  const getTaskStatusOptionsForCurrentUser = (task?: Task | null): {value: TaskStatus, label: string}[] => { if (!currentUser) return []; if ([UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER].includes(currentUser.role)) { return TASK_STATUS_OPTIONS.map(s => ({value: s, label: s})); } if (currentUser.role === UserRole.SCRIPT_WRITER) { if (task && (task.status === TaskStatus.DONE || task.status === TaskStatus.PUBLISHED)) { return [{value: task.status, label: task.status}]; } return [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW, TaskS.BLOCKED].map(s => ({value: s, label: s})); } if (currentUser.role === UserRole.FINANCE && task && task.assignee === currentUser.name) { if (task && (task.status === TaskStatus.DONE || task.status === TaskStatus.PUBLISHED)) { return [{value: task.status, label: task.status}]; } return [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.BLOCKED, TaskStatus.DONE].map(s => ({value: s, label: s})); } return task ? [{value: task.status, label: task.status}] : []; };

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
      <div className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ease-in-out ${isDesktopSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
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
      {/* Modals are left here for future wiring */}
      {/* Task Modal is very long, so it's omitted for brevity but would go here */}
      {/* Project Modal is very long, so it's omitted for brevity but would go here */}
    </div>
  );
};

export default App;