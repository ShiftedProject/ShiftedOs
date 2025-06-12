import React, { useState, useCallback } from 'react';
import { Expense, User, UserRole, Project, Task } from '../types'; // Added Project, Task
import Button from './Button';
import Modal from './Modal';
import PlusIcon from './icons/PlusIcon';
import SelectInput from './SelectInput'; // Corrected import path

// Dummy formatRupiah if not provided, replace with actual implementation
const formatRupiah = (amount: number): string => {
  if (typeof amount !== 'number') return 'Rp. 0';
  return `Rp. ${amount.toLocaleString('id-ID')}`;
};


const initialExpenses: Expense[] = [
  { id: 'EXP-001', description: 'Software Subscription (Design Tool)', amount: 750000, date: '2024-07-15', category: 'Software', projectId: 'PROJ-001' },
  { id: 'EXP-002', description: 'Freelancer Payment (Content Writing)', amount: 2500000, date: '2024-07-20', category: 'Services', projectId: 'PROJ-002' },
  { id: 'EXP-003', description: 'Team Event Catering', amount: 1500000, date: '2024-08-05', category: 'Team Building', projectId: 'PROJ-001' },
];

interface FinanceViewProps {
  currentUser: User | null;
  projects: Project[]; // Added
  tasks: Task[];     // Added (though not directly used for expense summary yet)
}

const FinanceView: React.FC<FinanceViewProps> = ({ currentUser, projects }) => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: '',
    projectId: '',
  });
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const canModifyFinance = currentUser && (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.FINANCE);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
  }, []);

  const handleOpenModal = (expenseToEdit?: Expense) => {
    if (!canModifyFinance) {
        alert("You don't have permission to modify financial data.");
        return;
    }
    if (expenseToEdit) {
      setEditingExpense(expenseToEdit);
      setNewExpense({...expenseToEdit, date: expenseToEdit.date.split('T')[0]}); 
    } else {
      setEditingExpense(null);
      setNewExpense({
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        category: '',
        projectId: projects[0]?.id || '', // Default to first project or empty
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingExpense(null);
  }, []);

  const handleSaveExpense = useCallback(() => {
    if (!canModifyFinance) return;
    if (!newExpense.description || (newExpense.amount !== undefined && newExpense.amount <= 0) || !newExpense.category || !newExpense.date) {
      alert("Please fill all required fields for the expense, and ensure amount is greater than 0.");
      return;
    }
    if (editingExpense) {
      setExpenses(prev => prev.map(exp => exp.id === editingExpense.id ? { ...editingExpense, ...newExpense } as Expense : exp));
    } else {
      const expenseToAdd: Expense = {
        id: `EXP-${String(Date.now()).slice(-4)}`,
        ...newExpense,
      } as Expense;
      setExpenses(prev => [expenseToAdd, ...prev]);
    }
    handleCloseModal();
  }, [newExpense, editingExpense, handleCloseModal, canModifyFinance]);
  
  const handleDeleteExpense = (expenseId: string) => {
    if (!canModifyFinance) {
        alert("You don't have permission to delete financial data.");
        return;
    }
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
    }
  };

  const getProjectBudgetSummary = () => {
    return projects.map(project => {
      const projectExpenses = expenses.filter(exp => exp.projectId === project.id);
      const totalSpent = projectExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      return {
        ...project,
        totalSpent,
        remainingBudget: project.budget ? project.budget - totalSpent : (project.budget === 0 ? 0 : undefined),
      };
    });
  };

  const projectBudgetSummaries = getProjectBudgetSummary();

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary">Finance & Budgeting</h2>
        {canModifyFinance && (
            <Button onClick={() => handleOpenModal()} leftIcon={<PlusIcon className="w-5 h-5" />} size="md" className="w-full sm:w-auto">
            Log Expense
            </Button>
        )}
      </div>

      {/* Project Budget Overview */}
      <div className="mb-8 bg-white p-4 sm:p-6 rounded-xl shadow-glass-depth">
        <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">Project Budgets Overview</h3>
        {projectBudgetSummaries.length === 0 ? (
          <p className="text-text-secondary">No projects with budget information.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Project</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Budget</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Spent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Remaining</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projectBudgetSummaries.map(summary => (
                  <tr key={summary.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary font-medium">{summary.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">{summary.budget !== undefined ? formatRupiah(summary.budget) : 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">{formatRupiah(summary.totalSpent)}</td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${summary.remainingBudget !== undefined && summary.remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {summary.remainingBudget !== undefined ? formatRupiah(summary.remainingBudget) : (summary.budget !== undefined ? formatRupiah(0) : 'N/A')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>


      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-glass-depth"> 
        <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">Recent Expenses</h3>
        {expenses.length === 0 ? (
           <div className="bg-main-background rounded-lg p-6 shadow-md text-center border border-gray-200">
            <p className="text-text-secondary">No expenses logged yet.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Project</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Amount</th>
                  {canModifyFinance && <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">{new Date(expense.date).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-4 whitespace-normal text-sm text-text-primary max-w-xs break-words">{expense.description}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">{expense.category}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">{projects.find(p => p.id === expense.projectId)?.name || 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary font-medium">{formatRupiah(expense.amount)}</td>
                    {canModifyFinance && (
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button onClick={() => handleOpenModal(expense)} variant="ghost" size="sm" className="w-full sm:w-auto">Edit</Button>
                            <Button onClick={() => handleDeleteExpense(expense.id)} variant="danger" size="sm" className="w-full sm:w-auto">Delete</Button>
                        </div>
                        </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {canModifyFinance && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingExpense ? "Edit Expense" : "Log New Expense"} size="lg">
            <form onSubmit={(e) => { e.preventDefault(); handleSaveExpense(); }} className="space-y-4">
            <div>
                <label htmlFor="expenseDescription" className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                <input type="text" name="description" id="expenseDescription" value={newExpense.description || ''} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                <label htmlFor="amount" className="block text-sm font-medium text-text-secondary mb-1">Amount (Rp.)</label>
                <input type="number" name="amount" id="amount" value={newExpense.amount || ''} onChange={handleInputChange} required min="1" step="1" className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" />
                </div>
                <div>
                <label htmlFor="date" className="block text-sm font-medium text-text-secondary mb-1">Date</label>
                <input type="date" name="date" id="date" value={newExpense.date || ''} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                    <input type="text" name="category" id="category" value={newExpense.category || ''} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-main-accent focus:border-main-accent bg-white" placeholder="e.g., Software, Marketing" />
                </div>
                <SelectInput
                    label="Related Project (Optional)"
                    name="projectId"
                    value={newExpense.projectId || ''}
                    onChange={handleInputChange}
                    options={[{value: '', label: 'None'}, ...projects.map(p => ({value: p.id, label: p.name}))]}
                    className="bg-white"
                />
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <Button type="button" variant="ghost" onClick={handleCloseModal} className="w-full sm:w-auto">Cancel</Button>
                <Button type="submit" variant="primary" className="w-full sm:w-auto">{editingExpense ? "Save Changes" : "Log Expense"}</Button>
            </div>
            </form>
        </Modal>
      )}
    </div>
  );
};

export default FinanceView;