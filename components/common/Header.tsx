import React from 'react';
import { User } from '../../types';
import { CarIcon } from './Icons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50 shadow-lg border-b border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <CarIcon className="h-8 w-8 text-cyan-400" />
            <span className="text-2xl font-bold tracking-tight text-white">DriveSure</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-cyan-400">{user.role}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;