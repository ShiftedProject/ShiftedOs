
import React from 'react';
import { TaskStatus, Division, ContentPillar, NotificationIconType, ProjectStatus, AssetType, TaskPriority } from './types'; // Added TaskPriority

// Import Notification Icons
import PlusCircleIcon from './components/icons/PlusCircleIcon';
import CheckCircleIcon from './components/icons/CheckCircleIcon';
import UserCircleIcon from './components/icons/UserCircleIcon';
import AtSymbolIcon from './components/icons/AtSymbolIcon';
import EyeIcon from './components/icons/EyeIcon';
import BellIcon from './components/icons/BellIcon';
import ExclamationTriangleIcon from './components/icons/ExclamationTriangleIcon';
import ProjectIcon from './components/icons/ProjectIcon';
import FolderIcon from './components/icons/FolderIcon'; // New


export const TASK_STATUS_OPTIONS: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.BLOCKED,
  TaskStatus.DONE,
  TaskStatus.PUBLISHED,
];

export const PROJECT_STATUS_OPTIONS: ProjectStatus[] = [
  ProjectStatus.PLANNING,
  ProjectStatus.ACTIVE,
  ProjectStatus.ON_HOLD,
  ProjectStatus.COMPLETED,
  ProjectStatus.CANCELLED,
];

export const DIVISION_OPTIONS: Division[] = [
  Division.SHIFTPECT,
  Division.SHIFTED,
  Division.SHIFTLIFE,
  Division.SHIFTFACT,
  Division.MANAGEMENT,
  Division.GENERAL,
];

export const CONTENT_PILLAR_OPTIONS: ContentPillar[] = [
  ContentPillar.PERSPEKTIF,
  ContentPillar.REFLEKSI,
  ContentPillar.CERITA_ANALOGI,
  ContentPillar.DATA_FENOMENA,
  ContentPillar.DIALOG,
  ContentPillar.NONE,
];

export const TASK_PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: TaskPriority.LOW, label: 'Low' },
  { value: TaskPriority.MEDIUM, label: 'Medium' },
  { value: TaskPriority.HIGH, label: 'High' },
  { value: TaskPriority.URGENT, label: 'Urgent' },
];

export const NASKAH_TEMPLATE_HOOK = `**🔥 HOOK (0-3 detik):**\n\n`;
export const NASKAH_TEMPLATE_ISI = `**💡 ISI (Konten Utama):**\n\n`;
export const NASKAH_TEMPLATE_CLOSING = `**🎬 CLOSING (Ringkasan/Pesan Kunci):**\n\n`;
export const NASKAH_TEMPLATE_CTA = `**🚀 CTA (Call to Action):**\n\n`;
export const NASKAH_TEMPLATE = `${NASKAH_TEMPLATE_HOOK}${NASKAH_TEMPLATE_ISI}${NASKAH_TEMPLATE_CLOSING}${NASKAH_TEMPLATE_CTA}`;

export const NOTIFICATION_ICON_MAP: Record<NotificationIconType, React.FC<{ className?: string }>> = {
  [NotificationIconType.PLUS_CIRCLE]: PlusCircleIcon,
  [NotificationIconType.CHECK_CIRCLE]: CheckCircleIcon,
  [NotificationIconType.USER_CIRCLE]: UserCircleIcon,
  [NotificationIconType.AT_SYMBOL]: AtSymbolIcon,
  [NotificationIconType.EYE]: EyeIcon,
  [NotificationIconType.BELL]: BellIcon,
  [NotificationIconType.EXCLAMATION_TRIANGLE]: ExclamationTriangleIcon,
  [NotificationIconType.PROJECT]: ProjectIcon,
  [NotificationIconType.FOLDER]: FolderIcon, // New mapping for FolderIcon
};

export const ASSET_TYPE_OPTIONS: AssetType[] = [
  AssetType.IMAGE,
  AssetType.VIDEO,
  AssetType.DOCUMENT,
  AssetType.TEMPLATE,
  AssetType.FONT,
  AssetType.LOGO,
  AssetType.OTHER,
];