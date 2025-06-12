
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import Button from './Button';
import LogoutIcon from './icons/LogoutIcon';
import UserIcon from './icons/UserIcon'; // For avatar placeholder

interface ProfileViewProps {
  currentUser: User | null;
  onUpdateProfile: (updatedUser: Partial<User>) => void;
  onLogout: () => void;
  isLoading?: boolean; // New prop
  error?: string | null; // New prop
}

const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onUpdateProfile, onLogout, isLoading, error }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableName, setEditableName] = useState<string>(currentUser?.name || '');
  const [editableBio, setEditableBio] = useState<string>(currentUser?.bio || '');

  useEffect(() => {
    if (currentUser && !isEditing) { // Only update from currentUser if not actively editing
      setEditableName(currentUser.name);
      setEditableBio(currentUser.bio || '');
    }
  }, [currentUser, isEditing]);

  if (!currentUser) {
    return <div className="p-6 text-xl text-center text-text-secondary">Loading profile...</div>;
  }

  const handleSave = () => {
    if (isLoading) return;
    onUpdateProfile({ name: editableName, bio: editableBio });
    // setIsEditing(false) will be handled by parent or based on successful update in a real scenario
    // For now, assume parent handles success by potentially re-passing currentUser or if not, we can close edit mode optimistically
    // If there's no error prop changing, we can close it here.
    // However, if an error occurs, we might want to keep the form open.
    // Let's assume onUpdateProfile handles success/failure and parent re-renders.
    // If no error is shown after save attempt, then close editing mode.
    // A better approach would be for onUpdateProfile to return a promise.
    // For now:
    if (!error && !isLoading) { // If there was no error and it's not loading anymore
        setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditableName(currentUser.name);
    setEditableBio(currentUser.bio || '');
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-main-accent to-secondary-accent p-6 sm:p-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              {currentUser.avatarUrl ? (
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover" 
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                  <UserIcon className="w-16 h-16 text-gray-500" />
                </div>
              )}
            </div>
            <div className="text-center sm:text-left pt-2">
              {isEditing ? (
                <input 
                  type="text"
                  value={editableName}
                  onChange={(e) => setEditableName(e.target.value)}
                  className="text-2xl sm:text-3xl font-bold text-white bg-transparent border-b-2 border-white/50 focus:outline-none focus:border-white mb-1 w-full sm:w-auto disabled:opacity-70"
                  disabled={isLoading}
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{currentUser.name}</h1>
              )}
              <p className="text-sm text-indigo-100">{currentUser.email}</p>
              <p className="text-sm text-indigo-200 mt-1">{currentUser.roleName || currentUser.role}</p>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm" className="text-white hover:bg-white/20" disabled={isLoading}>
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                 <Button onClick={handleSave} variant="primary" size="sm" customColorClass="bg-white text-main-accent hover:bg-gray-100" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button onClick={handleCancelEdit} variant="ghost" size="sm" className="text-white hover:bg-white/20" disabled={isLoading}>
                    Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
              {error}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Bio</h3>
            {isEditing ? (
               <textarea
                value={editableBio}
                onChange={(e) => setEditableBio(e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-main-accent focus:border-main-accent disabled:bg-gray-100 disabled:opacity-70"
                placeholder="Tell us a bit about yourself..."
                disabled={isLoading}
              />
            ) : (
              <p className="text-text-secondary whitespace-pre-line">{currentUser.bio || 'No bio provided.'}</p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Account Actions</h3>
            <Button 
              onClick={onLogout} 
              variant="danger" 
              leftIcon={<LogoutIcon className="w-5 h-5" />}
              size="md"
              disabled={isLoading}
            >
              Logout
            </Button>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Recent Activity (Placeholder)</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>Logged in successfully.</li>
              <li>Viewed 'Projects & Tasks' module.</li>
              <li>Updated profile information.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
