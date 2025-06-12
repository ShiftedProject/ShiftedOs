
import React from 'react';
import { User, Role } from '../types'; // Assuming Role type is defined
import UserIcon from './icons/UserIcon';
import Tag from './Tag';

interface TeamViewProps {
  users: User[];
  roles: Role[]; // Mock roles
}

const TeamView: React.FC<TeamViewProps> = ({ users, roles }) => {
  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary mb-6">Team Management</h2>

      {/* Users Section */}
      <div className="mb-8">
        <h3 className="text-xl sm:text-2xl font-semibold text-text-primary mb-4">Team Members</h3>
        {users.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-glass-depth text-center border border-gray-200">
            <p className="text-text-secondary">No users to display.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
                <Tag text={user.roleName || user.role} color="main" size="sm" /> 
                {/* Display roleName if available, fallback to original role */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Roles Section (View Only for now) */}
      <div>
        <h3 className="text-xl sm:text-2xl font-semibold text-text-primary mb-4">Roles</h3>
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
        <p className="text-xs text-text-secondary mt-3 text-center">Note: User and Role CRUD operations are backend features. This view is for display and task assignment demonstration.</p>
      </div>
    </div>
  );
};

export default TeamView;
