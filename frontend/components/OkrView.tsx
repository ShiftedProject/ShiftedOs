
import React, { useState, useCallback } from 'react';
import { Objective, KeyResult, KeyResultStatus } from '../types';
import Button from './Button';
import Modal from './Modal';
import PlusIcon from './icons/PlusIcon';
import SelectInput from './SelectInput';
import Tag from './Tag';

const initialObjectives: Objective[] = [
  { 
    id: 'OBJ-001', 
    title: 'Increase Q3 User Engagement', 
    description: 'Boost overall user activity and interaction on the platform.', 
    keyResultIds: ['KR-001', 'KR-002'], 
    timeframe: 'Q3 2024', 
    createdAt: new Date().toISOString(),
    owner: 'Marketing Team'
  },
];

const initialKeyResults: KeyResult[] = [
  { id: 'KR-001', objectiveId: 'OBJ-001', description: 'Increase daily active users by 20%', targetValue: 20, currentValue: 5, unit: '%', status: KeyResultStatus.AT_RISK },
  { id: 'KR-002', objectiveId: 'OBJ-001', description: 'Achieve an average session duration of 5 minutes', targetValue: 5, currentValue: 3.5, unit: 'minutes', status: KeyResultStatus.ON_TRACK },
];

const KEY_RESULT_STATUS_OPTIONS = Object.values(KeyResultStatus).map(s => ({value: s, label: s}));

const OkrView: React.FC = () => {
  const [objectives, setObjectives] = useState<Objective[]>(initialObjectives);
  const [keyResults, setKeyResults] = useState<KeyResult[]>(initialKeyResults);
  
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState<boolean>(false);
  const [newObjective, setNewObjective] = useState<Partial<Objective>>({ title: '', description: '', timeframe: '' });
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);

  const [isKrModalOpen, setIsKrModalOpen] = useState<boolean>(false);
  const [newKr, setNewKr] = useState<Partial<KeyResult>>({ description: '', targetValue: 0, currentValue: 0, unit: '', status: KeyResultStatus.NOT_STARTED });
  const [editingKr, setEditingKr] = useState<KeyResult | null>(null);
  const [currentObjectiveIdForKr, setCurrentObjectiveIdForKr] = useState<string | null>(null);

  const handleObjectiveInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewObjective(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleKrInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewKr(prev => ({ ...prev, [name]: (name === 'targetValue' || name === 'currentValue') ? parseFloat(value) : value }));
  }, []);

  const handleOpenObjectiveModal = (objectiveToEdit?: Objective) => {
    if (objectiveToEdit) {
      setEditingObjective(objectiveToEdit);
      setNewObjective(objectiveToEdit);
    } else {
      setEditingObjective(null);
      setNewObjective({ title: '', description: '', timeframe: '' });
    }
    setIsObjectiveModalOpen(true);
  };
  const handleCloseObjectiveModal = useCallback(() => setIsObjectiveModalOpen(false), []);

  const handleOpenKrModal = (objId: string, krToEdit?: KeyResult) => {
    setCurrentObjectiveIdForKr(objId);
    if (krToEdit) {
      setEditingKr(krToEdit);
      setNewKr(krToEdit);
    } else {
      setEditingKr(null);
      setNewKr({ description: '', targetValue: 0, currentValue: 0, unit: '', status: KeyResultStatus.NOT_STARTED, objectiveId: objId });
    }
    setIsKrModalOpen(true);
  };
  const handleCloseKrModal = useCallback(() => setIsKrModalOpen(false), []);
  
  const handleSaveObjective = useCallback(() => {
    if (!newObjective.title || !newObjective.timeframe) {
      alert("Title and Timeframe are required for an objective.");
      return;
    }
    const now = new Date().toISOString();
    if (editingObjective) {
      setObjectives(prev => prev.map(obj => obj.id === editingObjective.id ? { ...editingObjective, ...newObjective, createdAt: obj.createdAt } as Objective : obj));
    } else {
      const objectiveToAdd: Objective = {
        id: `OBJ-${String(Date.now()).slice(-4)}`,
        keyResultIds: [],
        createdAt: now,
        ...newObjective,
      } as Objective;
      setObjectives(prev => [objectiveToAdd, ...prev]);
    }
    handleCloseObjectiveModal();
  }, [newObjective, editingObjective, handleCloseObjectiveModal]);

  const handleSaveKr = useCallback(() => {
    if (!newKr.description || !newKr.unit || !currentObjectiveIdForKr) {
        alert("Description and Unit are required for a Key Result.");
        return;
    }
    if (editingKr) {
        setKeyResults(prevKrs => prevKrs.map(kr => kr.id === editingKr.id ? { ...editingKr, ...newKr } as KeyResult : kr));
    } else {
        const krToAdd: KeyResult = {
            id: `KR-${String(Date.now()).slice(-4)}`,
            objectiveId: currentObjectiveIdForKr,
            ...newKr,
        } as KeyResult;
        setKeyResults(prevKrs => [krToAdd, ...prevKrs]);
        setObjectives(prevObjs => prevObjs.map(obj => 
            obj.id === currentObjectiveIdForKr ? { ...obj, keyResultIds: [...obj.keyResultIds, krToAdd.id] } : obj
        ));
    }
    handleCloseKrModal();
  }, [newKr, editingKr, currentObjectiveIdForKr, handleCloseKrModal]);

  const getKrsForObjective = (objectiveId: string): KeyResult[] => {
    return keyResults.filter(kr => kr.objectiveId === objectiveId);
  };
  
  const getProgress = (current: number, target: number) => {
    if (target === 0 && current === 0) return 0;
    if (target === 0 && current > 0) return 100;
    return Math.min(Math.max((current / target) * 100, 0), 100);
  };
  
  const getStatusColor = (status: KeyResultStatus) => {
    switch(status) {
        case KeyResultStatus.ON_TRACK: return 'bg-green-500';
        case KeyResultStatus.AT_RISK: return 'bg-yellow-500';
        case KeyResultStatus.ACHIEVED: return 'bg-blue-500';
        case KeyResultStatus.MISSED: return 'bg-red-500';
        case KeyResultStatus.NOT_STARTED: return 'bg-gray-400';
        default: return 'bg-gray-300';
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary">Objectives & Key Results (OKRs)</h2>
        <Button onClick={() => handleOpenObjectiveModal()} leftIcon={<PlusIcon className="w-5 h-5" />} size="md" className="w-full sm:w-auto">
          New Objective
        </Button>
      </div>

      {objectives.length === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-glass-depth text-center border border-gray-200"> {/* Enhanced shadow */}
            <p className="text-text-secondary">No objectives set yet. Define your strategic goals!</p>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {objectives.map(obj => (
            <div key={obj.id} className="bg-white p-4 sm:p-6 rounded-xl shadow-glass-depth"> {/* Enhanced shadow */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-3 gap-2">
                <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-text-primary">{obj.title} <span className="text-sm font-normal text-text-secondary">({obj.timeframe})</span></h3>
                    <p className="text-sm text-text-secondary mt-0.5">{obj.description}</p>
                    {obj.owner && <p className="text-xs text-main-accent mt-1">Owner: {obj.owner}</p>}
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <Button onClick={() => handleOpenObjectiveModal(obj)} variant="ghost" size="sm" className="w-full sm:w-auto">Edit Obj</Button>
                    <Button onClick={() => handleOpenKrModal(obj.id)} leftIcon={<PlusIcon className="w-4 h-4"/>} variant="secondary" size="sm" className="w-full sm:w-auto">Add KR</Button>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                {getKrsForObjective(obj.id).map(kr => {
                   const progress = getProgress(kr.currentValue, kr.targetValue);
                   return (
                    <div key={kr.id} className="border border-gray-200 p-3 sm:p-4 rounded-lg bg-main-background/30">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1 gap-1">
                            <p className="text-sm font-medium text-text-primary flex-1 break-words">{kr.description}</p>
                            <Tag text={kr.status} className={`${getStatusColor(kr.status)} text-white`} size="sm"/>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 mb-1">
                            <div className={`${getStatusColor(kr.status)} h-2 sm:h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between text-xs text-text-secondary gap-1">
                            <span>{kr.currentValue} {kr.unit}</span>
                            <span>Target: {kr.targetValue} {kr.unit} ({progress.toFixed(0)}%)</span>
                            <Button onClick={() => handleOpenKrModal(obj.id, kr)} variant="ghost" size="sm" className="p-0 h-auto text-xs self-start sm:self-center">Edit KR</Button>
                        </div>
                    </div>
                   );
                })}
                {getKrsForObjective(obj.id).length === 0 && <p className="text-sm text-text-secondary text-center py-2">No Key Results added for this objective yet.</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isObjectiveModalOpen} onClose={handleCloseObjectiveModal} title={editingObjective ? "Edit Objective" : "Create New Objective"} size="lg">
        <form onSubmit={(e) => { e.preventDefault(); handleSaveObjective(); }} className="space-y-4">
          <div>
            <label htmlFor="objTitle" className="block text-sm font-medium text-text-secondary mb-1">Objective Title</label>
            <input type="text" name="title" id="objTitle" value={newObjective.title || ''} onChange={handleObjectiveInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" />
          </div>
          <div>
            <label htmlFor="objDescription" className="block text-sm font-medium text-text-secondary mb-1">Description (Optional)</label>
            <textarea name="description" id="objDescription" value={newObjective.description || ''} onChange={handleObjectiveInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white"></textarea>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="timeframe" className="block text-sm font-medium text-text-secondary mb-1">Timeframe</label>
              <input type="text" name="timeframe" id="timeframe" value={newObjective.timeframe || ''} onChange={handleObjectiveInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="e.g., Q3 2024, H1 2025"/>
            </div>
            <div>
              <label htmlFor="owner" className="block text-sm font-medium text-text-secondary mb-1">Owner (Optional)</label>
              <input type="text" name="owner" id="owner" value={newObjective.owner || ''} onChange={handleObjectiveInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="e.g., Marketing Team, John Doe"/>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={handleCloseObjectiveModal} className="w-full sm:w-auto">Cancel</Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">{editingObjective ? "Save Changes" : "Create Objective"}</Button>
          </div>
        </form>
      </Modal>

       <Modal isOpen={isKrModalOpen} onClose={handleCloseKrModal} title={editingKr ? "Edit Key Result" : "Add New Key Result"} size="lg">
        <form onSubmit={(e) => { e.preventDefault(); handleSaveKr(); }} className="space-y-4">
          <div>
            <label htmlFor="krDescription" className="block text-sm font-medium text-text-secondary mb-1">Key Result Description</label>
            <input type="text" name="description" id="krDescription" value={newKr.description || ''} onChange={handleKrInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="currentValue" className="block text-sm font-medium text-text-secondary mb-1">Current Value</label>
              <input type="number" name="currentValue" id="currentValue" value={newKr.currentValue === undefined ? '' : newKr.currentValue} onChange={handleKrInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" />
            </div>
            <div>
              <label htmlFor="targetValue" className="block text-sm font-medium text-text-secondary mb-1">Target Value</label>
              <input type="number" name="targetValue" id="targetValue" value={newKr.targetValue === undefined ? '' : newKr.targetValue} onChange={handleKrInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" />
            </div>
             <div>
              <label htmlFor="unit" className="block text-sm font-medium text-text-secondary mb-1">Unit</label>
              <input type="text" name="unit" id="unit" value={newKr.unit || ''} onChange={handleKrInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="e.g., %, $, items" />
            </div>
          </div>
          <SelectInput
              label="Status"
              name="status"
              value={newKr.status || KeyResultStatus.NOT_STARTED}
              onChange={handleKrInputChange}
              options={KEY_RESULT_STATUS_OPTIONS}
              className="bg-white"
            />
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={handleCloseKrModal} className="w-full sm:w-auto">Cancel</Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">{editingKr ? "Save Changes" : "Add Key Result"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OkrView;