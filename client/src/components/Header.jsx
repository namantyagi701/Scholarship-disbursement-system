import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, User, LogOut } from 'lucide-react';
import { AppContent } from '../context/AppContext';

const Header = ({ onLoginClick, onSignupClick, onMenuToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logoutUser, isLoggedin, userData } = useContext(AppContent);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };
  
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            {isLoggedin && onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative right-30"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <Link to={isLoggedin ? '/home' : '/'} className="flex items-center group">
            <div className="relative">
              <GraduationCap className="w-8 h-8 text-blue-600 transition-transform group-hover:scale-110" />
              <div className="absolute -inset-1 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="ml-3">
              <div className="text-xl font-bold text-blue-600">
                SSP
              </div>
            </div>
          </Link>
          </div>

          {/* Desktop Navigation */}
          {isLoggedin && (
            <nav className="hidden md:flex items-center space-x-1">
              {(() => {
                const role = userData?.role || 'student';
                const navItems = {
                  student: [
                    { name: 'Home', path: '/home' },
                    { name: 'About', path: '/about' },
                    { name: 'Dashboard', path: '/dashboard' },
                  ],
                  sag: [
                    { name: 'Home', path: '/home' },
                    { name: 'Applications', path: '/sag/applications' },
                  ],
                  finance: [
                    { name: 'Home', path: '/home' },
                    { name: 'Approved', path: '/finance/approved' },
                    { name: 'Payment History', path: '/finance/payment-history' },
                  ],
                  admin: [
                    { name: 'Home', path: '/home' },
                    { name: 'Create User', path: '/admin/create-user' },
                    { name: 'Manage Users', path: '/admin/users' },
                  ],
                };
                return (navItems[role] || navItems.student).map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200 relative group"
                >
                  {item.name}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
                </Link>
              ));})()}
            </nav>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {isLoggedin ? (
              <div className="flex items-center space-x-3">
                {/* User Profile */}
                <div className="hidden sm:flex items-center space-x-3 bg-gray-50 rounded-full px-3 py-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{userData?.fullName || 'User'}</div>
                    <div className="text-xs text-gray-500 capitalize">{userData?.role || 'Student'}</div>
                  </div>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200"
                >
                  Login
                </button>
                <button
                  onClick={onSignupClick}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            {isLoggedin && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isLoggedin && isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {(() => {
                const role = userData?.role || 'student';
                const navItems = {
                  student: [
                    { name: 'Home', path: '/home' },
                    { name: 'About', path: '/about' },
                    { name: 'Dashboard', path: '/dashboard' },
                  ],
                  sag: [
                    { name: 'Home', path: '/home' },
                    { name: 'Applications', path: '/sag/applications' },
                  ],
                  finance: [
                    { name: 'Home', path: '/home' },
                    { name: 'Approved', path: '/finance/approved' },
                    { name: 'Payment History', path: '/finance/payment-history' },
                  ],
                  admin: [
                    { name: 'Home', path: '/home' },
                    { name: 'Create User', path: '/admin/create-user' },
                    { name: 'Manage Users', path: '/admin/users' },
                  ],
                };
                return (navItems[role] || navItems.student).map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {item.name}
                </Link>
              ));})()}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;