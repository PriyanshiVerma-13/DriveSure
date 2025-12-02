import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { CarIcon, UserCircleIcon, BuildingOfficeIcon, ShieldCheckIcon } from '../common/Icons';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.Customer);
  const [error, setError] = useState('');

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    if (isRegistering) {
      if (!name) {
        setError('Name is required for registration.');
        return;
      }
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        setError('User with this email already exists.');
        return;
      }
      const newUser: User = { id: Date.now().toString(), email, password, name, role };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      onLogin(newUser);
    } else {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email or password.');
      }
    }
  };

  const roleOptions = [
    { value: UserRole.Customer, label: 'Customer', icon: <UserCircleIcon className="h-5 w-5 mr-2" /> },
    { value: UserRole.CarCompany, label: 'Car Company', icon: <BuildingOfficeIcon className="h-5 w-5 mr-2" /> },
    { value: UserRole.InsuranceCompany, label: 'Insurance Company', icon: <ShieldCheckIcon className="h-5 w-5 mr-2" /> },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
            <CarIcon className="mx-auto h-12 w-12 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white mt-4">Welcome to DriveSure</h1>
            <p className="text-gray-400 mt-2">{isRegistering ? 'Create your account' : 'Sign in to your account'}</p>
        </div>

        <form onSubmit={handleAuthAction} className="space-y-6">
          {isRegistering && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name or Company Name"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">I am a...</label>
              <div className="grid grid-cols-1 gap-2">
                {roleOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
                    className={`flex items-center justify-center w-full p-3 text-sm font-semibold rounded-md transition-all duration-200 ${
                      role === option.value ? 'bg-cyan-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500"
          >
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="font-medium text-cyan-400 hover:text-cyan-300">
            {isRegistering ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;