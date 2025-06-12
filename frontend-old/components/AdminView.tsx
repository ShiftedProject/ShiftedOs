
import React, { useState, useEffect } from 'react';
import { ThemeColors, User, Project, Task, AnalyticsConfig, AnalyticsMetricConfig, UserRole, Role as RoleType } from '../types'; // Added RoleType
import Button from './Button';
import SelectInput from './SelectInput'; 

interface AdminViewProps {
  currentTheme: ThemeColors;
  defaultTheme: ThemeColors;
  onThemeChange: (newTheme: ThemeColors) => void;
  mockUsers: User[];
  mockProjects: Project[];
  mockTasks: Task[];
  initialAnalyticsConfig: AnalyticsConfig;
  onAnalyticsConfigChange: (newConfig: AnalyticsConfig) => void;
  onAddNewUser: (name: string, email: string, role: UserRole, pass: string) => Promise<boolean>; // Updated signature
  onEditUserRole: (userId: string, newRole: UserRole) => void;
  rolesList: RoleType[]; // To populate role dropdown
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-glass-depth border border-gray-200/50 mb-6">
    <h3 className="text-xl font-semibold text-text-primary mb-4">{title}</h3>
    {children}
  </div>
);

const ColorInput: React.FC<{ label: string; color: string; onChange: (color: string) => void }> = ({ label, color, onChange }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
    <label className="text-sm font-medium text-text-secondary mb-1 sm:mb-0">{label}:</label>
    <div className="flex items-center space-x-2">
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 sm:w-10 sm:h-10 border-none rounded-md cursor-pointer"
      />
      <input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-main-accent focus:border-main-accent text-sm w-32 bg-white"
        placeholder="Hex or rgba"
      />
    </div>
  </div>
);

const analyticsMetricOptions: AnalyticsMetricConfig[] = [
    { id: 'activeProjects', label: 'Active Projects Metric', isVisible: true },
    { id: 'tasksCompleted', label: 'Tasks Completed Metric', isVisible: true },
    { id: 'totalContentViews', label: 'Total Content Views Metric', isVisible: true },
    { id: 'teamEngagement', label: 'Team Engagement Metric', isVisible: true },
];

const chartTypeOptions: { value: AnalyticsConfig['chartType']; label: string }[] = [
    { value: 'Bar Chart', label: 'Bar Chart' },
    { value: 'Line Chart', label: 'Line Chart' },
    { value: 'Pie Chart', label: 'Pie Chart' },
    { value: 'None', label: 'No Chart' },
];


const AdminView: React.FC<AdminViewProps> = ({ 
    currentTheme, 
    defaultTheme, 
    onThemeChange,
    mockUsers,
    mockProjects,
    mockTasks,
    initialAnalyticsConfig,
    onAnalyticsConfigChange,
    onAddNewUser,
    onEditUserRole,
    rolesList
}) => {
  const [editableTheme, setEditableTheme] = useState<ThemeColors>(currentTheme);
  const [editableAnalyticsConfig, setEditableAnalyticsConfig] = useState<AnalyticsConfig>(initialAnalyticsConfig);

  // User Management State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>(UserRole.VIEWER);
  const [newUserPassword, setNewUserPassword] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [addUserMessage, setAddUserMessage] = useState<string | null>(null);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUserNewRole, setEditingUserNewRole] = useState<UserRole | null>(null);


  useEffect(() => {
    setEditableTheme(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    setEditableAnalyticsConfig(initialAnalyticsConfig);
  }, [initialAnalyticsConfig]);


  const handleColorChange = (colorName: keyof ThemeColors, value: string) => {
    setEditableTheme(prev => ({ ...prev, [colorName]: value }));
  };

  const handleSaveTheme = () => {
    onThemeChange(editableTheme);
    alert("Theme saved to localStorage and applied! Changes will persist in this browser.");
  };

  const handleResetTheme = () => {
    onThemeChange(defaultTheme);
    setEditableTheme(defaultTheme);
    alert("Theme reset to defaults and applied! Customizations from localStorage cleared.");
  };

  const handleMetricVisibilityChange = (metricId: string, isVisible: boolean) => {
    setEditableAnalyticsConfig(prev => ({
        ...prev,
        metricVisibility: {
            ...prev.metricVisibility,
            [metricId]: isVisible,
        }
    }));
  };

  const handleChartTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditableAnalyticsConfig(prev => ({
        ...prev,
        chartType: e.target.value as AnalyticsConfig['chartType'],
    }));
  };
  
  const handleSaveAnalyticsConfig = () => {
    onAnalyticsConfigChange(editableAnalyticsConfig); 
    localStorage.setItem('shiftedOSAnalyticsConfig', JSON.stringify(editableAnalyticsConfig));
    alert("Analytics configuration saved to localStorage!");
  };

  const handleUserAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingUser(true);
    setAddUserMessage(null);
    const success = await onAddNewUser(newUserName, newUserEmail, newUserRole, newUserPassword);
    if (success) {
      setAddUserMessage("User added successfully!");
      setNewUserName('');
      setNewUserEmail('');
      setNewUserRole(UserRole.VIEWER);
      setNewUserPassword('');
    } else {
      setAddUserMessage("Failed to add user. Email might already exist or invalid data.");
    }
    setIsAddingUser(false);
     setTimeout(() => setAddUserMessage(null), 3000);
  };
  
  const handleSaveUserRoleChange = (userId: string, newRole: UserRole | null) => {
    if (userId && newRole) {
        onEditUserRole(userId, newRole);
        setEditingUserId(null);
        setEditingUserNewRole(null);
    }
  };

  const roleOptions = Object.values(UserRole).map(role => ({ value: role, label: role }));

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary">Admin Panel</h2>

      <Section title="User Management">
        <form onSubmit={handleUserAddSubmit} className="space-y-3 mb-6 p-4 border border-gray-200 rounded-lg bg-main-background/20">
            <h4 className="text-md font-semibold text-text-primary">Add New Mock User</h4>
            {addUserMessage && <p className={`text-sm ${addUserMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>{addUserMessage}</p>}
            <input type="text" placeholder="Full Name" value={newUserName} onChange={e => setNewUserName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white"/>
            <input type="email" placeholder="Email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white"/>
            <SelectInput name="newUserRole" label="Role" value={newUserRole} onChange={e => setNewUserRole(e.target.value as UserRole)} options={roleOptions} className="bg-white" />
            <input type="password" placeholder="Password (mock)" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white"/>
            <Button type="submit" variant="secondary" size="md" disabled={isAddingUser}>
                {isAddingUser ? 'Adding...' : 'Add User'}
            </Button>
        </form>

        <h4 className="text-md font-semibold text-text-primary mb-2">Edit User Roles</h4>
        <div className="space-y-2 max-h-80 overflow-y-auto">
            {mockUsers.map(user => (
                <div key={user.id} className="p-3 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-main-background/20">
                    <div>
                        <p className="font-medium text-text-primary">{user.name} <span className="text-xs text-text-secondary">({user.email})</span></p>
                        <p className="text-sm text-text-secondary">Current Role: {user.role}</p>
                    </div>
                    {editingUserId === user.id ? (
                        <div className="flex items-center gap-2">
                             <SelectInput 
                                name="editUserRole" 
                                value={editingUserNewRole || user.role} 
                                onChange={e => setEditingUserNewRole(e.target.value as UserRole)} 
                                options={roleOptions} 
                                className="bg-white text-sm py-1"
                                containerClassName="w-40"
                            />
                            <Button onClick={() => handleSaveUserRoleChange(user.id, editingUserNewRole)} size="sm" variant="primary">Save</Button>
                            <Button onClick={() => { setEditingUserId(null); setEditingUserNewRole(null);}} size="sm" variant="ghost">Cancel</Button>
                        </div>
                    ) : (
                         <Button onClick={() => { setEditingUserId(user.id); setEditingUserNewRole(user.role);}} size="sm" variant="ghost" disabled={user.email === 'admin@shiftedos.com'}>
                            {user.email === 'admin@shiftedos.com' ? 'Cannot Edit Admin' : 'Edit Role'}
                         </Button>
                    )}
                </div>
            ))}
        </div>
      </Section>

      <Section title="Theme Customization (Client-Side)">
        <p className="text-xs text-text-secondary mb-4">
          Changes are applied live using CSS Variables and saved to your browser's localStorage.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <ColorInput label="Main Background" color={editableTheme.mainBackground} onChange={(c) => handleColorChange('mainBackground', c)} />
          <ColorInput label="Glass Background" color={editableTheme.glassBg} onChange={(c) => handleColorChange('glassBg', c)} />
          <ColorInput label="Main Accent" color={editableTheme.mainAccent} onChange={(c) => handleColorChange('mainAccent', c)} />
          <ColorInput label="Secondary Accent" color={editableTheme.secondaryAccent} onChange={(c) => handleColorChange('secondaryAccent', c)} />
          <ColorInput label="Highlight" color={editableTheme.highlight} onChange={(c) => handleColorChange('highlight', c)} />
          <ColorInput label="Text Primary" color={editableTheme.textPrimary} onChange={(c) => handleColorChange('textPrimary', c)} />
          <ColorInput label="Text Secondary" color={editableTheme.textSecondary} onChange={(c) => handleColorChange('textSecondary', c)} />
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button onClick={handleSaveTheme} variant="primary" size="md">Save Theme</Button>
          <Button onClick={handleResetTheme} variant="ghost" size="md">Reset to Default Theme</Button>
        </div>
      </Section>

      <Section title="Customize Analytics View">
        <p className="text-xs text-text-secondary mb-4">
          Control which metrics are displayed and the type of chart shown on the Analytics page. Saved to localStorage.
        </p>
        <div className="mb-4">
            <h4 className="font-medium text-text-primary mb-2">Metric Card Visibility:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {analyticsMetricOptions.map(metric => (
                    <label key={metric.id} className="flex items-center space-x-2 cursor-pointer">
                        <input 
                            type="checkbox"
                            checked={editableAnalyticsConfig.metricVisibility[metric.id] !== undefined ? editableAnalyticsConfig.metricVisibility[metric.id] : metric.isVisible}
                            onChange={(e) => handleMetricVisibilityChange(metric.id, e.target.checked)}
                            className="form-checkbox h-5 w-5 text-main-accent rounded border-gray-300 focus:ring-main-accent"
                        />
                        <span className="text-sm text-text-primary">{metric.label}</span>
                    </label>
                ))}
            </div>
        </div>
        <SelectInput
            label="Placeholder Chart Type"
            name="chartType"
            value={editableAnalyticsConfig.chartType}
            onChange={handleChartTypeChange}
            options={chartTypeOptions}
            className="bg-white"
            containerClassName="mb-4"
        />
        <Button onClick={handleSaveAnalyticsConfig} variant="primary" size="md">Save Analytics Config</Button>
      </Section>


      <Section title="View Mock Application State (Read-Only)">
        <p className="text-xs text-text-secondary mb-4">
          This shows the current client-side mock data for inspection. This data is not persistent server-side.
        </p>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-text-primary mb-1">Users:</h4>
            <pre className="bg-main-background/50 p-3 rounded-md text-xs overflow-auto max-h-60 border border-gray-200">
              {JSON.stringify(mockUsers, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary mb-1">Projects:</h4>
            <pre className="bg-main-background/50 p-3 rounded-md text-xs overflow-auto max-h-60 border border-gray-200">
              {JSON.stringify(mockProjects, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary mb-1">Tasks:</h4>
            <pre className="bg-main-background/50 p-3 rounded-md text-xs overflow-auto max-h-60 border border-gray-200">
              {JSON.stringify(mockTasks, null, 2)}
            </pre>
          </div>
        </div>
      </Section>
       <Section title="Notes">
          <p className="text-sm text-text-secondary">
            This admin panel provides client-side customizations and a view of the current mock data.
            True application-wide settings, persistent data management, and user role administration require a backend system.
          </p>
       </Section>
    </div>
  );
};

export default AdminView;
