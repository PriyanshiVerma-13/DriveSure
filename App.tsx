
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole } from './types';
import AuthPage from './components/auth/AuthPage';
import CustomerDashboard from './components/dashboards/CustomerDashboard';
import CompanyDashboard from './components/dashboards/CompanyDashboard';
import InsuranceDashboard from './components/dashboards/InsuranceDashboard';
import Header from './components/common/Header';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (user: User) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  }, []);

  const renderDashboard = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case UserRole.Customer:
        return <CustomerDashboard currentUser={currentUser} />;
      case UserRole.CarCompany:
        return <CompanyDashboard currentUser={currentUser} />;
      case UserRole.InsuranceCompany:
        return <InsuranceDashboard />;
      default:
        return <div className="text-center p-8">Invalid user role.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {currentUser ? (
        <>
          <Header user={currentUser} onLogout={handleLogout} />
          <main className="p-4 sm:p-6 lg:p-8">{renderDashboard()}</main>
        </>
      ) : (
        <AuthPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
