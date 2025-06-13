import React, { useState, useCallback, useEffect } from 'react';

// Firebase Imports
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { onSnapshot, collection, doc, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
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

const MOCK_ROLES_LIST: Role[] = [ { id: 'ROLE-001', name: 'Admin', description: 'Manages the entire ShiftedOS platform.' }, { id: 'ROLE-002', name: 'Editor', description: 'Oversees projects, tasks, and content quality.' }, { id: 'ROLE-003', name: 'Script Writer', description: 'Focuses on creating and managing task content, especially scripts.' }, { id: 'ROLE-004', name: 'Viewer', description: 'Has read-only access to most platform data.' }, { id: 'ROLE-005', name: 'Finance', description: 'Manages financial data and budgeting.' }, { id: 'ROLE-006', name: 'Project Manager', description: 'Manages projects, timelines, and team assignments.' },];
const DEFAULT_THEME: ThemeColors = { mainBackground: '#F5ECE0', glassBg: 'rgba(255, 255, 255, 0.35)', mainAccent: '#336D82', secondaryAccent: '#5F99AE', highlight: '#693382', textPrimary: '#1F2937', textSecondary: '#6B7280',};

const App: React.FC = () => {
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

  const handleLogin = async (email: string, pass: string) => {
    setIsLoggingIn(true);
    setLoginError(undefined);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.error("Login failed:", error);
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

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = { ...notificationData, id: `NTF-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, timestamp: new Date().toISOString(), read: false, };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
  }, []);
  
  const getTasksForSelectedProject = useCallback(() => tasks.filter(task => task.projectId === selectedProjectId), [tasks, selectedProjectId]);
  
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div>
            <h1 className="text-2xl font-bold">Welcome, {currentUser?.name}</h1>
            <p>Your Role: {currentUser?.roleName}</p>
          </div>
        );
      case 'tasks':
        return <div>Projects and Tasks View</div>;
      // Add other view cases here...
      default:
        return <div>Select a view from the sidebar.</div>;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen bg-main-background"><p className="text-xl text-text-secondary animate-pulse">Loading ShiftedOS...</p></div>;
  }
  
  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} loginError={loginError} isLoading={isLoggingIn} />;
  }

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
    </div>
  );
};

export default App;