
import React, { useState } from 'react';
import { User, Role as RoleType, UserRole } from '../types';
import UserIcon from './icons/UserIcon';
import Tag from './Tag';
import Button from './Button';
import SelectInput from './SelectInput';
import PlusIcon from './icons/PlusIcon';

interface TeamViewProps {
  users: User[];
  roles: RoleType[];
  currentUser: User | null;
  onAddNewUser: (name: string, email: string, role: UserRole, pass: string) => Promise<boolean>;
  onEditUserRole: (userId: string, newRole: UserRole) => void;
}

const TeamView: React.FC<TeamViewProps> = ({ users, roles, currentUser, onAddNewUser, onEditUserRole }) => {
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>(UserRole.VIEWER);
  const [newUserPassword, setNewUserPassword] = useState('');
  const [addUserMessage, setAddUserMessage] = useState<string | null>(null);
  const [isSubmittingNewUser, setIsSubmittingNewUser] = useState(false);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUserNewRole, setEditingUserNewRole] = useState<UserRole | null>(null);

  const canManageTeam = currentUser && (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.PROJECT_MANAGER);
  const roleOptions = Object.values(UserRole).map(role => ({ value: role, label: role }));

  const handleUserAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingNewUser(true);
    setAddUserMessage(null);
    const success = await onAddNewUser(newUserName, newUserEmail, newUserRole, newUserPassword);
    if (success) {
      setAddUserMessage("User added successfully!");
      setNewUserName('');
      setNewUserEmail('');
      setNewUserRole(UserRole.VIEWER);
      setNewUserPassword('');
      setIsAddingUser(false); // Close form on success
    } else {
      setAddUserMessage("Failed to add user. Email might already exist or invalid data.");
    }
    setIsSubmittingNewUser(false);
    setTimeout(() => setAddUserMessage(null), 4000);
  };

  const handleSaveUserRoleChange = (userId: string, newRole: UserRole | null) => {
    if (userId && newRole) {
      // Prevent changing the primary admin's role
      const userToEdit = users.find(u => u.id === userId);
      if (userToEdit && userToEdit.email === 'admin@shiftedos.com' && newRole !== UserRole.ADMIN) {
        alert("The primary Admin user's role cannot be changed from Admin.");
        setEditingUserNewRole(UserRole.ADMIN); // Reset dropdown if they tried to change it
        return;
      }
      onEditUserRole(userId, newRole);
      setEditingUserId(null);
      setEditingUserNewRole(null);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary">Team Management</h2>
        {canManageTeam && !isAddingUser && (
          <Button onClick={() => setIsAddingUser(true)} leftIcon={<PlusIcon className="w-5 h-5" />} size="md">
            Add New User
          </Button>
        )}
      </div>

      {isAddingUser && canManageTeam && (
        <div className="mb-8 p-4 sm:p-6 bg-white rounded-xl shadow-glass-depth border border-gray-200/50">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Add New Mock User</h3>
          <form onSubmit={handleUserAddSubmit} className="space-y-3">
            {addUserMessage && <p className={`text-sm p-2 rounded-md ${addUserMessage.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{addUserMessage}</p>}
            <input type="text" placeholder="Full Name" value={newUserName} onChange={e => setNewUserName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-main-accent focus:border-main-accent"/>
            <input type="email" placeholder="Email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-main-accent focus:border-main-accent"/>
            <SelectInput name="newUserRole" label="Role" value={newUserRole} onChange={e => setNewUserRole(e.target.value as UserRole)} options={roleOptions} className="bg-white focus:ring-main-accent focus:border-main-accent" />
            <input type="password" placeholder="Password (mock)" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-main-accent focus:border-main-accent"/>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button type="submit" variant="primary" size="md" disabled={isSubmittingNewUser} className="w-full sm:w-auto">
                {isSubmittingNewUser ? 'Adding...' : 'Add User'}
              </Button>
              <Button type="button" variant="ghost" size="md" onClick={() => setIsAddingUser(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl sm:text-2xl font-semibold text-text-primary mb-4">Team Members</h3>
        {users.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-glass-depth text-center border border-gray-200">
            <p className="text-text-secondary">No users to display.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {users.map(user => (
              <div key={user.id} className="bg-white p-4 rounded-xl shadow-glass-depth border border-gray-200/50">
                <div className="flex items-center space-x-3 mb-3">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover"/>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="w-7 h-7 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-text-primary truncate" title={user.name}>{user.name}</p>
                    <p className="text-xs text-text-secondary truncate" title={user.email}>{user.email}</p>
                  </div>
                </div>
                {editingUserId === user.id && canManageTeam ? (
                    <div className="space-y-2">
                         <SelectInput 
                            name="editUserRole" 
                            label="Change Role"
                            value={editingUserNewRole || user.role} 
                            onChange={e => setEditingUserNewRole(e.target.value as UserRole)} 
                            options={roleOptions.filter(r => !(user.email === 'admin@shiftedos.com' && r.value !== UserRole.ADMIN))} // Prevent changing admin from admin
                            className="bg-white text-sm py-1 focus:ring-main-accent focus:border-main-accent"
                            disabled={user.email === 'admin@shiftedos.com'}
                            
                        />
                        <div className="flex gap-2">
                            <Button onClick={() => handleSaveUserRoleChange(user.id, editingUserNewRole)} size="sm" variant="primary" disabled={user.email === 'admin@shiftedos.com' && editingUserNewRole !== UserRole.ADMIN}>Save</Button>
                            <Button onClick={() => { setEditingUserId(null); setEditingUserNewRole(null);}} size="sm" variant="ghost">Cancel</Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <Tag text={user.roleName || user.role} color="main" size="sm" />
                        {canManageTeam && user.email !== 'admin@shiftedos.com' && (
                             <Button onClick={() => { setEditingUserId(user.id); setEditingUserNewRole(user.role);}} size="sm" variant="ghost">Edit Role</Button>
                        )}
                        {canManageTeam && user.email === 'admin@shiftedos.com' && (
                            <span className="text-xs text-text-secondary italic">Primary Admin</span>
                        )}
                    </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl sm:text-2xl font-semibold text-text-primary mb-4">Roles & Permissions</h3>
         {roles.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-glass-depth text-center border border-gray-200">
            <p className="text-text-secondary">No roles defined.</p>
          </div>
        ) : (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-glass-depth border border-gray-200/50">
            <ul className="space-y-3">
              {roles.map(role => (
                <li key={role.id} className="p-3 bg-main-background/40 rounded-md">
                  <p className="font-semibold text-text-primary">{role.name}</p>
                  {role.description && <p className="text-sm text-text-secondary mt-0.5">{role.description}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamView;
