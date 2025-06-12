
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: string; // Original role field, e.g., 'Admin', 'Editor'
  roleName?: string; // New: More specific role from a list, e.g., 'Lead Designer'
  avatarUrl?: string; // Optional
  bio?: string; // Optional
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
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  owner?: string; // User ID or name
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}


export interface Task {
  id: string;
  projectId: string; // ID of the parent project
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: string; // User NAME (was User ID or name, now specifically name for mock)
  startDate?: string; // Optional: ISO date string for Gantt chart start
  deadline?: string; // ISO date string
  duration?: number; // Optional: duration in days for Gantt
  divisionTag: Division;
  contentPillarTag: ContentPillar;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  // For future analytics integration
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
  collaborationHistory?: string[]; // Array of Task IDs
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO date string
  category: string;
  projectId?: string; // Optional: link to a project/task
}

export interface Budget {
  id: string;
  name: string;
  projectId?: string;
  allocatedAmount: number;
  spentAmount: number; // Calculated from expenses
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string; // Markdown supported conceptually
  category: string;
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
  unit: string; // e.g., %, $, items
  status: KeyResultStatus;
  objectiveId: string;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  keyResultIds: string[]; // Store IDs, KeyResult objects stored separately or fetched
  timeframe: string; // e.g., "Q3 2024"
  owner?: string; // User ID or name
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
  ASSET_CREATED = 'ASSET_CREATED', // New
  ASSET_DELETED = 'ASSET_DELETED', // New
}

export enum NotificationIconType {
  PLUS_CIRCLE = 'PLUS_CIRCLE',
  CHECK_CIRCLE = 'CHECK_CIRCLE',
  USER_CIRCLE = 'USER_CIRCLE',
  AT_SYMBOL = 'AT_SYMBOL',
  EYE = 'EYE',
  BELL = 'BELL', // For general or default
  EXCLAMATION_TRIANGLE = 'EXCLAMATION_TRIANGLE', // For warnings
  PROJECT = 'PROJECT', // For project related notifications
  FOLDER = 'FOLDER', // New for Assets
}

export interface Notification {
  id: string;
  type: NotificationType;
  iconType: NotificationIconType;
  message: string;
  timestamp: string; // ISO date string
  read: boolean;
  relatedItemId?: string; // e.g., Task ID or Project ID
  relatedItemType?: 'task' | 'project' | 'user' | 'asset'; // New
}

// New Types for Asset Inventory
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
  filePathOrUrl?: string; // Mocked, actual URL or path
  previewUrl?: string; // Mocked, URL for image/video preview
  tags?: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// New Type for Roles (Team Management)
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: string[]; // Placeholder for future permissions
}