import React, { useState, useCallback, useEffect } from 'react';

// Firebase Imports
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { onSnapshot, collection, doc, getDoc } from "firebase/firestore";
import { auth, db } from './src/firebase';

// API Service Import
import * as api from './src/services/api';

// CORRECTED: Component paths are now relative to the root 'frontend' folder
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

// CORRECTED: Type and Constant paths are also relative to the root 'frontend' folder
import { Task, TaskStatus, Division, ContentPillar, User, Notification, NotificationType, NotificationIconType, Project, ProjectStatus, AssetType, Role, ThemeColors, UserRole, AnalyticsConfig, TaskPriority } from './types';
import { TASK_STATUS_OPTIONS, DIVISION_OPTIONS, CONTENT_PILLAR_OPTIONS, NASKAH_TEMPLATE, PROJECT_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from './constants';


// Mock data for static UI elements
const MOCK_ROLES_LIST: Role[] = [ { id: 'ROLE-001', name: 'Admin', description: 'Manages the entire ShiftedOS platform.' }, { id: 'ROLE-002', name: 'Editor', description: 'Oversees projects, tasks, and content quality.' }, { id: 'ROLE-003', name: 'Script Writer', description: 'Focuses on creating and managing task content, especially scripts.' }, { id: 'ROLE-004', name: 'Viewer', description: 'Has read-only access to most platform data.' }, { id: 'ROLE-005', name: 'Finance', description: 'Manages financial data and budgeting.' }, { id: 'ROLE-006', name: 'Project Manager', description: 'Manages projects, timelines, and team assignments.' },];
const DEFAULT_THEME: ThemeColors = { mainBackground: '#F5ECE0', glassBg: 'rgba(255, 255, 255, 0.35)', mainAccent: '#336D82', secondaryAccent: '#5F99AE', highlight: '#693382', textPrimary: '#1F2937', textSecondary: '#6B7280',};
const DEFAULT_ANALYTICS_CONFIG: AnalyticsConfig = { metricVisibility: { activeProjects: true, tasksCompleted: true, totalContentViews: true, teamEngagement: true, }, chartType: 'Bar Chart',};


const App: React.FC = () => {
  // State declarations...
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
  
  // Real-time auth and data fetching...
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setCurrentUser({ id: firebaseUser.uid, ...userDocSnap.data() } as User);
          setIsAuthenticated(true);
        } else {
          await signOut(auth);
        }
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

  // Authentication handlers...
  const handleLogin = async (email: string, pass: string) => { /* ... as previously defined ... */ };
  const handleLogout = async () => { /* ... as previously defined ... */ };
  
  // CRUD handlers...
  const handleSaveProject = async () => { /* ... as previously defined ... */ };
  const handleDeleteProject = async (projectId: string) => { /* ... as previously defined ... */ };
  const handleSaveTask = async () => { /* ... as previously defined ... */ };
  const handleDeleteTask = async (taskId: string) => { /* ... as previously defined ... */ };
  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => { /* ... as previously defined ... */ };

  // Other handlers and utility functions...
  const addNotification = useCallback(() => {}, []);
  const getTasksForSelectedProject = useCallback(() => tasks.filter(task => task.projectId === selectedProjectId), [tasks, selectedProjectId]);


  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-full"><p className="text-xl text-text-secondary animate-pulse">Loading Workspace...</p></div>;
    }
    // This is the full render logic that shows different views
    switch (activeView) {
      case 'dashboard':
        return <div>Dashboard Content Here</div>;
      case 'tasks':
        if (selectedProjectId) {
            const currentProject = projects.find(p => p.id === selectedProjectId);
            if (!currentProject) return <div>Project Not Found</div>;
            return <ProjectDetailView project={currentProject} tasks={getTasksForSelectedProject()} onBackToProjects={() => setSelectedProjectId(null)} />;
        }
        return (
            <div>
                <h2 className="text-2xl font-bold mb-4">Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map(p => <ProjectCard key={p.id} project={p} onViewTasks={() => setSelectedProjectId(p.id)} />)}
                </div>
            </div>
        );
      // Add other cases for 'team', 'analytics', etc.
      default:
        return <div>Select a view</div>;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-main-background"><p className="text-xl text-text-secondary animate-pulse">Loading ShiftedOS...</p></div>;
  }
  
  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} loginError={loginError} isLoading={isLoggingIn} />;
  }

  // --- THIS IS THE FINAL, FULL LAYOUT ---
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
      />
      <div className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ease-in-out ${isDesktopSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <Header 
          title="Dashboard" // Example title
          notifications={notifications}
          unreadNotificationCount={notifications.filter(n=>!n.read).length}
          onMarkAllNotificationsAsRead={() => {}}
          onMarkNotificationAsRead={() => {}}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-glass-bg backdrop-blur-xl"> 
          {renderContent()}
        </main>
      </div>
      {/* Your Modals would go here */}
    </div>
  );
};

export default App;
