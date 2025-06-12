
import React, { useState, useCallback } from 'react';
import { Asset, AssetType } from '../types';
import { ASSET_TYPE_OPTIONS } from '../constants';
import Button from './Button';
import Modal from './Modal';
import PlusIcon from './icons/PlusIcon';
import AssetCard from './AssetCard';
import SelectInput from './SelectInput';

const initialAssets: Asset[] = [
  { id: 'ASSET-001', name: 'ShiftedOS Logo Full Color', type: AssetType.LOGO, description: 'Main company logo in SVG format, full color version.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['branding', 'logo', 'primary'] },
  { id: 'ASSET-002', name: 'Product Launch Video Teaser', type: AssetType.VIDEO, description: '30-second teaser video for the V2 platform launch.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['marketing', 'video', 'v2launch'] },
  { id: 'ASSET-003', name: 'Montserrat Font Family', type: AssetType.FONT, description: 'Complete Montserrat font family files (OTF).', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: ['typography', 'brand-assets'] },
];

const AssetView: React.FC<{ onAddNotification: (msg: string, type: AssetType) => void }> = ({ onAddNotification }) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    name: '',
    type: ASSET_TYPE_OPTIONS[0],
    description: '',
    tags: []
  });
  // Editing state can be added later if needed

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
     if (name === "tags") {
        setNewAsset(prev => ({ ...prev, tags: value.split(',').map(tag => tag.trim()).filter(tag => tag) }));
    } else {
        setNewAsset(prev => ({ ...prev, [name]: value as AssetType })); // Cast for type
    }
  }, []);

  const handleOpenModal = () => {
    setNewAsset({ name: '', type: ASSET_TYPE_OPTIONS[0], description: '', tags: [] });
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSaveAsset = useCallback(() => {
    if (!newAsset.name || !newAsset.type) {
      alert("Asset Name and Type are required.");
      return;
    }
    const now = new Date().toISOString();
    const assetToAdd: Asset = {
      id: `ASSET-${String(Date.now()).slice(-4)}`,
      createdAt: now,
      updatedAt: now,
      ...newAsset,
    } as Asset;
    setAssets(prev => [assetToAdd, ...prev]);
    onAddNotification(`Asset "${assetToAdd.name.substring(0,20)}..." created.`, assetToAdd.type);
    handleCloseModal();
  }, [newAsset, handleCloseModal, onAddNotification]);

  const handleDeleteAsset = useCallback((assetId: string) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      const assetToDelete = assets.find(a => a.id === assetId);
      setAssets(prev => prev.filter(asset => asset.id !== assetId));
      if (assetToDelete) {
        onAddNotification(`Asset "${assetToDelete.name.substring(0,20)}..." deleted.`, assetToDelete.type);
      }
    }
  }, [assets, onAddNotification]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary">Asset Inventory</h2>
        <Button onClick={handleOpenModal} leftIcon={<PlusIcon className="w-5 h-5" />} size="md" className="w-full sm:w-auto">
          Add New Asset
        </Button>
      </div>

      {assets.length === 0 ? (
         <div className="bg-white rounded-xl p-8 shadow-glass-depth text-center border border-gray-200">
            <p className="text-text-secondary">No assets found. Start adding your digital resources!</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {assets.map(asset => (
            <AssetCard key={asset.id} asset={asset} onDelete={handleDeleteAsset} />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add New Asset" size="lg">
        <form onSubmit={(e) => { e.preventDefault(); handleSaveAsset(); }} className="space-y-4">
          <div>
            <label htmlFor="assetName" className="block text-sm font-medium text-text-secondary mb-1">Asset Name</label>
            <input type="text" name="name" id="assetName" value={newAsset.name || ''} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" />
          </div>
          <SelectInput
            label="Asset Type"
            name="type"
            value={newAsset.type || ASSET_TYPE_OPTIONS[0]}
            onChange={handleInputChange}
            options={ASSET_TYPE_OPTIONS.map(opt => ({ value: opt, label: opt }))}
            className="bg-white"
          />
          <div>
            <label htmlFor="assetDescription" className="block text-sm font-medium text-text-secondary mb-1">Description (Optional)</label>
            <textarea name="description" id="assetDescription" value={newAsset.description || ''} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white"></textarea>
          </div>
           <div>
            <label htmlFor="assetTags" className="block text-sm font-medium text-text-secondary mb-1">Tags (comma-separated)</label>
            <input type="text" name="tags" id="assetTags" value={newAsset.tags?.join(', ') || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="e.g., branding, video, social-media"/>
          </div>
          <p className="text-xs text-text-secondary">Note: File upload functionality is a backend feature. This mock UI collects metadata.</p>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={handleCloseModal} className="w-full sm:w-auto">Cancel</Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">Add Asset</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AssetView;
