
import React, { useState, useCallback } from 'react';
import { Collaborator } from '../types';
import Button from './Button';
import Modal from './Modal';
import PlusIcon from './icons/PlusIcon';
import UserIcon from './icons/UserIcon';
import Tag from './Tag';

const initialCollaborators: Collaborator[] = [
  { id: 'COL-001', name: 'Alice Wonderland', role: 'Graphic Designer', contactInfo: 'alice@example.com', rate: 'Rp. 1.125.000/hr', portfolioUrl: 'https://alice.design' },
  { id: 'COL-002', name: 'Bob The Builder', role: 'Videographer', contactInfo: 'bob@example.com', rate: 'Rp. 900.000/hr', portfolioUrl: 'https://bobfilms.com' },
];

const CrmView: React.FC = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(initialCollaborators);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newCollaborator, setNewCollaborator] = useState<Partial<Collaborator>>({
    name: '',
    role: '',
    contactInfo: '',
    rate: '',
    portfolioUrl: '',
  });
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCollaborator(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleOpenModal = (collaboratorToEdit?: Collaborator) => {
    if (collaboratorToEdit) {
      setEditingCollaborator(collaboratorToEdit);
      setNewCollaborator(collaboratorToEdit);
    } else {
      setEditingCollaborator(null);
      setNewCollaborator({ name: '', role: '', contactInfo: '', rate: '', portfolioUrl: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingCollaborator(null);
  }, []);

  const handleSaveCollaborator = useCallback(() => {
    if (!newCollaborator.name || !newCollaborator.role || !newCollaborator.contactInfo) {
      alert("Name, Role, and Contact Info are required.");
      return;
    }
    if (editingCollaborator) {
      setCollaborators(prev => prev.map(col => col.id === editingCollaborator.id ? { ...editingCollaborator, ...newCollaborator } as Collaborator : col));
    } else {
      const collaboratorToAdd: Collaborator = {
        id: `COL-${String(Date.now()).slice(-4)}`,
        ...newCollaborator,
      } as Collaborator;
      setCollaborators(prev => [collaboratorToAdd, ...prev]);
    }
    handleCloseModal();
  }, [newCollaborator, editingCollaborator, handleCloseModal]);

  const handleDeleteCollaborator = (collaboratorId: string) => {
    if (window.confirm("Are you sure you want to delete this collaborator?")) {
      setCollaborators(prev => prev.filter(col => col.id !== collaboratorId));
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary">Relations & Collaborators</h2>
        <Button onClick={() => handleOpenModal()} leftIcon={<PlusIcon className="w-5 h-5" />} size="md" className="w-full sm:w-auto">
          Add Collaborator
        </Button>
      </div>

      {collaborators.length === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-glass-depth text-center border border-gray-200"> {/* Enhanced shadow */}
         <p className="text-text-secondary">No collaborators added yet. Start building your network!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {collaborators.map(col => (
            <div key={col.id} className="bg-white p-4 sm:p-5 rounded-xl shadow-glass-depth hover:shadow-strong transition-shadow duration-200 border border-gray-200/50 flex flex-col justify-between"> {/* Enhanced shadow */}
              <div>
                <div className="flex items-center mb-3">
                  <UserIcon className="w-8 h-8 mr-3 text-main-accent flex-shrink-0" />
                  <div className="overflow-hidden">
                    <h3 className="text-md sm:text-lg font-semibold text-text-primary truncate" title={col.name}>{col.name}</h3>
                    <Tag text={col.role} color="main" size="sm" />
                  </div>
                </div>
                <p className="text-sm text-text-secondary mb-1 truncate"><strong>Contact:</strong> {col.contactInfo}</p>
                {col.rate && <p className="text-sm text-text-secondary mb-1 truncate"><strong>Rate:</strong> {col.rate}</p>}
                {col.portfolioUrl && <p className="text-sm text-text-secondary mb-3 truncate"><strong>Portfolio:</strong> <a href={col.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-main-accent hover:underline">{col.portfolioUrl}</a></p>}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => handleOpenModal(col)} size="sm" variant="ghost" className="flex-1 sm:flex-none">Edit</Button>
                <Button onClick={() => handleDeleteCollaborator(col.id)} size="sm" variant="danger" className="bg-transparent text-red-500 hover:bg-red-500/10 flex-1 sm:flex-none">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCollaborator ? "Edit Collaborator" : "Add New Collaborator"} size="lg">
        <form onSubmit={(e) => { e.preventDefault(); handleSaveCollaborator(); }} className="space-y-4">
          <div>
            <label htmlFor="collabName" className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
            <input type="text" name="name" id="collabName" value={newCollaborator.name || ''} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-text-secondary mb-1">Role/Specialty</label>
            <input type="text" name="role" id="role" value={newCollaborator.role || ''} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="e.g., Graphic Designer, Copywriter" />
          </div>
          <div>
            <label htmlFor="contactInfo" className="block text-sm font-medium text-text-secondary mb-1">Contact Info (Email/Phone)</label>
            <input type="text" name="contactInfo" id="contactInfo" value={newCollaborator.contactInfo || ''} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" />
          </div>
          <div>
            <label htmlFor="rate" className="block text-sm font-medium text-text-secondary mb-1">Rate (Optional)</label>
            <input type="text" name="rate" id="rate" value={newCollaborator.rate || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="e.g., Rp. 750.000/hr, Rp. 5.000.000/project" />
          </div>
          <div>
            <label htmlFor="portfolioUrl" className="block text-sm font-medium text-text-secondary mb-1">Portfolio URL (Optional)</label>
            <input type="url" name="portfolioUrl" id="portfolioUrl" value={newCollaborator.portfolioUrl || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="https://yourportfolio.com" />
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={handleCloseModal} className="w-full sm:w-auto">Cancel</Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">{editingCollaborator ? "Save Changes" : "Add Collaborator"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CrmView;