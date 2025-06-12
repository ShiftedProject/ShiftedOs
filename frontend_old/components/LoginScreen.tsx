
import React, { useState } from 'react';
import Button from './Button';
import ShiftedOSLogoIcon from './icons/ShiftedOSLogoIcon';

interface LoginScreenProps {
  onLogin: (email: string, pass: string) => void;
  loginError?: string;
  isLoading?: boolean; // New prop
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, loginError, isLoading }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onLogin(email, password);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-xl shadow-strong w-full max-w-md border border-gray-200/80">
        <div className="flex justify-center mb-6">
          <ShiftedOSLogoIcon className="w-20 h-20 text-main-accent" />
        </div>
        <h2 className="text-2xl font-bold text-center text-text-primary mb-1">ShiftedOS Login</h2>
        <p className="text-center text-text-secondary mb-8">Access your workspace</p>
        
        {loginError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
            <span className="block sm:inline">{loginError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset disabled={isLoading}>
            <div>
              <label htmlFor="email-login" className="block text-sm font-medium text-text-secondary mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email-login"
                id="email-login"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-main-accent focus:border-main-accent transition-colors disabled:bg-gray-100"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password-login" className="block text-sm font-medium text-text-secondary mb-1">
                Password
              </label>
              <input
                type="password"
                name="password-login"
                id="password-login"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-main-accent focus:border-main-accent transition-colors disabled:bg-gray-100"
                placeholder="••••••••"
              />
            </div>
          </fieldset>
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
