import React, { useState, useCallback, useEffect } from 'react';

// Firebase Imports
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { onSnapshot, collection, doc, getDoc } from "firebase/firestore";
import { auth, db } from './src/firebase';

// API Service Import
import * as api from './src/services/api';

// Component, Type, and Asset Imports
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
import PlusIcon from './components/icons/PlusIcon';
import ProjectIcon from './components/icons/ProjectIcon';
import BellIcon from './components/icons/BellIcon';
import FolderIcon from './components/icons/FolderIcon';
import { Task, TaskStatus, Division, ContentPillar, User, Notification, NotificationType, NotificationIconType, Project, ProjectStatus, AssetType, Role, ThemeColors, UserRole, AnalyticsConfig, TaskPriority } from './types';
import { TASK_STATUS_OPTIONS, DIVISION_OPTIONS, CONTENT_PILLAR_OPTIONS, NASKAH_TEMPLATE, PROJECT_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from './constants';


// Mock data for static UI elements
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({ name: '', description: '', status: ProjectStatus.PLANNING, budget: 0, proofOfWorkUrl: '' });
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({ title: '', description: '', status: TaskStatus.TODO, divisionTag: DIVISION_OPTIONS[0], contentPillarTag: CONTENT_PILLAR_OPTIONS[CONTENT_PILLAR_OPTIONS.length -1], projectId: '', assignee: '', priority: TaskPriority.MEDIUM });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [taskError, setTaskError] = useState<string | null>(null);
  const [isSavingProject, setIsSavingProject] = useState<boolean>(false);
  const [isSavingTask, setIsSavingTask] = useState<boolean>(false);


  // --- REAL-TIME DATA & AUTH ---
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setCurrentUser({ id: firebaseUser.uid, ...userDocSnap.data() } as User);
          setIsAuthenticated(true);
        } else { await signOut(auth); }
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubProjects = onSnapshot(collection(db, "projects"), (snap) => setProjects(snap.docs.map(d => ({id: d.id, ...d.data()})) as Project[]));
    const unsubTasks = onSnapshot(collection(db, "tasks"), (snap) => setTasks(snap.docs.map(d => ({id: d.id, ...d.data()})) as Task[]));
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => setUsers(snap.docs.map(d => ({id: d.id, ...d.data()})) as User[]));
    return () => { unsubProjects(); unsubTasks(); unsubUsers(); };
  }, [isAuthenticated]);


  // --- AUTH HANDLERS ---
  const handleLogin = async (email: string, pass: string) => {
    setIsLoggingIn(true);
    setLoginError(undefined);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      setLoginError('Invalid email or password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  // --- CRUD HANDLERS (Now fully connected to API service) ---
  const handleSaveProject = async () => {
    if (!newProject.name) {
      setProjectError("Project Name is required.");
      return;
    }
    setIsSavingProject(true);
    setProjectError(null);
    try {
      if (editingProject) {
        await api.updateProject(editingProject.id, newProject);
        addNotification({ type: NotificationType.PROJECT_UPDATED, iconType: NotificationIconType.PROJECT, message: `Project "${newProject.name}" updated.` });
      } else {
        await api.createProject(newProject);
        addNotification({ type: NotificationType.PROJECT_CREATED, iconType: NotificationIconType.PROJECT, message: `New project "${newProject.name}" created.` });
      }
      handleCloseProjectModal();
    } catch (error: any) {
      setProjectError(error.message || "An unexpected error occurred.");
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const projectToDelete = projects.find(p => p.id === projectId);
    if (window.confirm(`Are you sure you want to delete "${projectToDelete?.name}" and all its tasks?`)) {
      try {
        await api.deleteProject(projectId);
        addNotification({ type: NotificationType.GENERAL_INFO, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "Project deleted." });
      } catch (error) {
        console.error("Failed to delete project:", error);
        addNotification({ type: NotificationType.ERROR, iconType: NotificationIconType.EXCLAMATION_TRIANGLE, message: "Failed to delete project." });
      }
    }
  };

  const handleSaveTask = async () => {
    if (!newTask.title || !newTask.projectId) {
      setTaskError("Title and Project are required.");
      return;
    }
    setIsSavingTask(true);
    setTaskError(null);
    try {
      if (editingTask) {
        await api.updateTask(editingTask.id, newTask);
      } else {
        await api.createTask(newTask);
      }
      handleCloseTaskModal();
    } catch (error: any) {
      setTaskError(error.message || "An unexpected error occurred.");
    } finally {
      setIsSavingTask(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await api.deleteTask(taskId);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (taskToUpdate) {
        await api.updateTask(taskId, { ...taskToUpdate, status: newStatus });
      }
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  // --- PLACEHOLDER HANDLERS (Require Secure Backend Functions) ---
  const handleUpdateUserProfile = async (profile: Partial<User>) => { alert("Updating profiles requires a secure backend function."); };
  const handleAddNewUser = async (name: string, email: string, role: UserRole, pass: string) => { alert("Adding new users requires a secure backend function."); return false; };
  const handleEditUserRole = async (userId: string, newRole: UserRole) => { alert("Editing roles requires a secure backend function."); };
  
  // --- UTILITY & MODAL FUNCTIONS ---
  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = { ...notificationData, id: `NTF-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, timestamp: new Date().toISOString(), read: false, };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
  }, []);
  const getTasksForSelectedProject = useCallback(() => tasks.filter(task => task.projectId === selectedProjectId), [tasks, selectedProjectId]);
  const handleOpenProjectModal = (projectToEdit?: Project) => {
    setProjectError(null);
    if (projectToEdit) {
      setEditingProject(projectToEdit);
      setNewProject(projectToEdit);
    } else {
      setEditingProject(null);
      setNewProject({ name: '', description: '', status: ProjectStatus.PLANNING, startDate: new Date().toISOString().split('T')[0], budget: 0, proofOfWorkUrl: '' });
    }
    setIsProjectModalOpen(true);
  };
  const handleCloseProjectModal = useCallback(() => { setIsProjectModalOpen(false); setEditingProject(null); setNewProject({ name: '', description: '', status: ProjectStatus.PLANNING }); }, []);
  const handleOpenTaskModal = (taskToEdit?: Task) => {
    setTaskError(null);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setNewTask(taskToEdit);
    } else {
      setEditingTask(null);
      setNewTask({ title: '', description: '', status: TaskStatus.TODO, divisionTag: DIVISION_OPTIONS[0], contentPillarTag: CONTENT_PILLAR_OPTIONS[CONTENT_PILLAR_OPTIONS.length -1], projectId: selectedProjectId || '', assignee: '', priority: TaskPriority.MEDIUM });
    }
    setIsTaskModalOpen(true);
  };
  const handleCloseTaskModal = useCallback(() => { setIsTaskModalOpen(false); setEditingTask(null); setNewTask({ title: '', description: '', status: TaskStatus.TODO }); }, []);


  // --- THIS IS THE FINAL, FULL RENDER LOGIC ---
  const renderContent = () => {
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
          return ( <div> <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-3"> <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary">All Projects</h2> <Button onClick={() => handleOpenProjectModal()} variant="primary" leftIcon={<ProjectIcon className="w-5 h-5 mr-2" />} disabled={!(currentUser && [UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER].includes(currentUser.role))} title={!(currentUser && [UserRole.ADMIN, UserRole.EDITOR, UserRole.PROJECT_MANAGER].includes(currentUser.role)) ? "You don't have permission to add projects" : "Create a new project"}> New Project </Button> </div> {projects.length === 0 && !isLoading ? ( <div className="bg-white rounded-xl p-10 shadow-glass-depth text-center"> <p className="text-text-secondary text-lg">No projects yet. Create your first project!</p> </div> ) : ( <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"> {projects.map(project => ( <ProjectCard key={project.id} project={project} onViewTasks={() => setSelectedProjectId(project.id)} onEdit={() => handleOpenProjectModal(project)} onDelete={() => handleDeleteProject(project.id)} currentUserRole={currentUser?.role || UserRole.VIEWER} /> ))} </div> )} </div> );
        }
      case 'team': return <TeamView users={users} roles={MOCK_ROLES_LIST} currentUser={currentUser} onAddNewUser={handleAddNewUser} onEditUserRole={handleEditUserRole} />;
      case 'analytics': return <AnalyticsView initialConfig={DEFAULT_ANALYTICS_CONFIG} activeProjectsCount={projects.length} tasksCompletedCount={tasks.filter(t=>t.status === 'Done').length} totalContentViews={100} teamEngagement={"N/A"} />;
      case 'finance': return <FinanceView currentUser={currentUser} projects={projects} tasks={tasks} />;
      case 'profile': 
        return <ProfileView 
                  currentUser={currentUser} 
                  onUpdateProfile={handleUpdateUserProfile} 
                  onLogout={handleLogout} 
                  isLoading={isUpdatingProfile} 
                  error={profileError}
                />;
      case 'admin':
        return currentUser?.role === UserRole.ADMIN ? ( 
            <AdminView 
                currentTheme={DEFAULT_THEME}
                defaultTheme={DEFAULT_THEME}
                onThemeChange={()=>{}}
                mockUsers={users}
                mockProjects={projects}
                mockTasks={tasks}
                initialAnalyticsConfig={DEFAULT_ANALYTICS_CONFIG}
                onAnalyticsConfigChange={()=>{}}
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
                <p className="text-xl text-text-secondary">Viewing the '{activeView}' module.</p>
            </div>
        );
    }
  };


  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-main-background"><p className="text-xl text-text-secondary animate-pulse">Loading ShiftedOS...</p></div>;
  }
  
  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} loginError={loginError} isLoading={isLoggingIn} />;
  }

  // --- FINAL JSX with Full Layout including Modals ---
  return (
    <div className="flex h-screen bg-main-background text-text-primary overflow-hidden">
      <Sidebar 
        currentUser={currentUser}
        activeView={activeView} 
        setActiveView={setActiveView} 
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
        toggleDesktopSidebarCollapse={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
        onLogout={handleLogout}
      />
      <div className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ease-in-out ${isDesktopSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <Header 
          title={activeView.charAt(0).toUpperCase() + activeView.slice(1)}
          notifications={notifications}
          unreadNotificationCount={notifications.filter(n=>!n.read).length}
          onMarkAllNotificationsAsRead={() => setNotifications(prev => prev.map(n => ({...n, read: true})))}
          onMarkNotificationAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n))}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-glass-bg backdrop-blur-xl"> 
          {renderContent()}
        </main>
      </div>
      
      <Modal isOpen={isProjectModalOpen} onClose={handleCloseProjectModal} title={editingProject ? 'Edit Project' : 'Create New Project'}>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveProject(); }}>
             {projectError && <p className="text-red-500">{projectError}</p>}
             <fieldset disabled={isSavingProject}>
                <input type="text" name="name" value={newProject.name || ''} onChange={(e) => setNewProject(p => ({...p, name: e.target.value}))} placeholder="Project Name" required className="w-full mb-4 p-2 border rounded"/>
                <textarea name="description" value={newProject.description || ''} onChange={(e) => setNewProject(p => ({...p, description: e.target.value}))} placeholder="Description" className="w-full mb-4 p-2 border rounded"/>
                <Button type="submit" disabled={isSavingProject}>{isSavingProject ? 'Saving...' : 'Save Project'}</Button>
             </fieldset>
          </form>
       </Modal>
       
       <Modal isOpen={isTaskModalOpen} onClose={handleCloseTaskModal} title={editingTask ? 'Edit Task' : 'Create New Task'}>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveTask(); }}>
             {taskError && <p className="text-red-500">{taskError}</p>}
             <fieldset disabled={isSavingTask}>
                <input type="text" name="title" value={newTask.title || ''} onChange={(e) => setNewTask(t => ({...t, title: e.target.value}))} placeholder="Task Title" required className="w-full mb-4 p-2 border rounded"/>
                <Button type="submit" disabled={isSavingTask}>{isSavingTask ? 'Saving...' : 'Save Task'}</Button>
             </fieldset>
          </form>
       </Modal>
    </div>
  );
};

export default App;
