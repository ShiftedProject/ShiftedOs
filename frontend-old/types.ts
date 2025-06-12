
export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  IN_REVIEW = 'In Review',
  BLOCKED = 'Blocked',
  DONE = 'Done',
  PUBLISHED = 'Published'
}

export enum Division {
  SHIFTPECT = 'ShiftPect',
  SHIFTED = 'ShiftEd',
  SHIFTLIFE = 'ShiftLife',
  SHIFTFACT = 'ShiftFact',
  MANAGEMENT = 'Management',
  GENERAL = 'General'
}

export enum ContentPillar {
  PERSPEKTIF = 'Perspektif',
  REFLEKSI = 'Refleksi',
  CERITA_ANALOGI = 'Cerita & Analogi',
  DATA_FENOMENA = 'Data & Fenomena',
  DIALOG = 'Dialog',
  NONE = 'N/A'
}

export enum UserRole {
  ADMIN = 'Admin',
  EDITOR = 'Editor',
  SCRIPT_WRITER = 'Script Writer',
  VIEWER = 'Viewer',
  FINANCE = 'Finance',
  PROJECT_MANAGER = 'Project Manager', // Added PROJECT_MANAGER role
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole; 
  roleName?: string; 
  avatarUrl?: string; 
  bio?: string; 
  password?: string; 
}

export enum ProjectStatus {
  PLANNING = 'Planning',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold',
  CANCELLED = 'Cancelled'
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string; 
  endDate?: string; 
  owner?: string; 
  budget?: number; 
  proofOfWorkUrl?: string; 
  createdAt: string; 
  updatedAt: string; 
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
}

export interface Task {
  id:string;
  projectId: string; 
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: string; 
  startDate?: string; 
  deadline?: string; 
  duration?: number; 
  priority?: TaskPriority; 
  divisionTag: Division;
  contentPillarTag: ContentPillar;
  createdAt: string; 
  updatedAt: string; 
  views?: number;
  likes?: number;
  engagementRate?: number;
}

export interface Collaborator {
  id: string;
  name: string;
  role: string;
  contactInfo: string;
  rate?: string;
  portfolioUrl?: string;
  collaborationHistory?: string[]; 
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; 
  category: string;
  projectId?: string; 
}

export interface Budget {
  id: string;
  name: string;
  projectId?: string;
  allocatedAmount: number;
  spentAmount: number; 
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string; 
  category: string;
  documentUrl?: string; 
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export enum KeyResultStatus {
  ON_TRACK = 'On Track',
  AT_RISK = 'At Risk',
  ACHIEVED = 'Achieved',
  MISSED = 'Missed',
  NOT_STARTED = 'Not Started'
}

export interface KeyResult {
  id: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string; 
  status: KeyResultStatus;
  objectiveId: string;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  keyResultIds: string[]; 
  timeframe: string; 
  owner?: string; 
  createdAt: string;
}

export enum NotificationType {
  TASK_CREATED = 'TASK_CREATED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  MENTION = 'MENTION',
  REVIEW_REQUESTED = 'REVIEW_REQUESTED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  DEADLINE_APPROACHING = 'DEADLINE_APPROACHING',
  GENERAL_INFO = 'GENERAL_INFO',
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
  PROJECT_STATUS_CHANGED = 'PROJECT_STATUS_CHANGED',
  ASSET_CREATED = 'ASSET_CREATED', 
  ASSET_DELETED = 'ASSET_DELETED', 
}

export enum NotificationIconType {
  PLUS_CIRCLE = 'PLUS_CIRCLE',
  CHECK_CIRCLE = 'CHECK_CIRCLE',
  USER_CIRCLE = 'USER_CIRCLE',
  AT_SYMBOL = 'AT_SYMBOL',
  EYE = 'EYE',
  BELL = 'BELL', 
  EXCLAMATION_TRIANGLE = 'EXCLAMATION_TRIANGLE', 
  PROJECT = 'PROJECT', 
  FOLDER = 'FOLDER', 
}

export interface Notification {
  id: string;
  type: NotificationType;
  iconType: NotificationIconType;
  message: string;
  timestamp: string; 
  read: boolean;
  relatedItemId?: string; 
  relatedItemType?: 'task' | 'project' | 'user' | 'asset'; 
}

export enum AssetType {
  IMAGE = 'Image',
  VIDEO = 'Video',
  DOCUMENT = 'Document',
  TEMPLATE = 'Template',
  FONT = 'Font',
  LOGO = 'Logo',
  OTHER = 'Other'
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  description?: string;
  filePathOrUrl?: string; 
  previewUrl?: string; 
  tags?: string[];
  createdAt: string; 
  updatedAt: string; 
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: string[]; 
}

export interface ThemeColors {
  mainBackground: string;
  glassBg: string;
  mainAccent: string;
  secondaryAccent: string;
  highlight: string;
  textPrimary: string;
  textSecondary: string;
}

export interface AnalyticsMetricConfig {
  id: string;
  label: string;
  isVisible: boolean;
}

export interface AnalyticsConfig {
  metricVisibility: Record<string, boolean>; 
  chartType: 'Bar Chart' | 'Line Chart' | 'Pie Chart' | 'None';
}

export type ReportTemplateType = 'task_progress' | 'financial_summary' | 'team_productivity' | 'content_performance';

export interface ReportCriteria {
  template: ReportTemplateType | '';
  startDate: string;
  endDate: string;
  projectId: string | 'all'; 
}

export interface GeneratedReportData {
  title: string;
  criteria: ReportCriteria;
  generatedAt: string;
  summary?: Record<string, string | number>;
  dataRows?: Record<string, any>[]; 
  message?: string; 
}