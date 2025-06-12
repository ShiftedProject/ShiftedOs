
import React from 'react';
import { Asset, AssetType } from '../types';
import Button from './Button';
import Tag from './Tag';
import PhotoIcon from './icons/PhotoIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';
import VideoCameraIcon from './icons/VideoCameraIcon';
import SparklesIcon from './icons/SparklesIcon'; // For Font, Template, Other
import FolderIcon from './icons/FolderIcon'; // For Logo

interface AssetCardProps {
  asset: Asset;
  onDelete: (assetId: string) => void;
  // onEdit might be added later
}

const AssetTypeIcon: React.FC<{ type: AssetType, className?: string }> = ({ type, className = "w-10 h-10 text-main-accent" }) => {
  switch (type) {
    case AssetType.IMAGE: return <PhotoIcon className={className} />;
    case AssetType.VIDEO: return <VideoCameraIcon className={className} />;
    case AssetType.DOCUMENT:
    case AssetType.TEMPLATE: return <DocumentTextIcon className={className} />;
    case AssetType.FONT: return <SparklesIcon className={className} />;
    case AssetType.LOGO: return <FolderIcon className={className} />; // Using Folder for Logo
    case AssetType.OTHER: return <SparklesIcon className={className} />;
    default: return <FolderIcon className={className} />;
  }
};

const AssetCard: React.FC<AssetCardProps> = ({ asset, onDelete }) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl shadow-glass-depth hover:shadow-strong transition-shadow duration-200 border border-gray-200/50 flex flex-col justify-between">
      <div>
        <div className="flex items-start mb-3">
          <div className="mr-4 flex-shrink-0">
            <AssetTypeIcon type={asset.type} />
          </div>
          <div className="flex-grow overflow-hidden">
            <h3 className="text-md sm:text-lg font-semibold text-text-primary truncate" title={asset.name}>{asset.name}</h3>
            <Tag text={asset.type} color="secondary" size="sm" />
          </div>
        </div>
        <p className="text-sm text-text-secondary mb-2 h-10 overflow-hidden line-clamp-2">{asset.description || "No description."}</p>
        {asset.tags && asset.tags.length > 0 && (
          <div className="mb-2 max-h-10 overflow-y-auto">
            {asset.tags.map(tag => <Tag key={tag} text={tag} color="highlight" size="sm" className="mr-1 mb-1"/>)}
          </div>
        )}
        <p className="text-xs text-gray-400">Created: {new Date(asset.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={() => onDelete(asset.id)} size="sm" variant="danger" className="bg-transparent text-red-500 hover:bg-red-500/10">Delete</Button>
      </div>
    </div>
  );
};

export default AssetCard;
