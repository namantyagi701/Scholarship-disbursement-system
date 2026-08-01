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
    navigate('/', { replace: true });
  };
  
  return (
    <header className="sticky top-0 z-50 bg-[#FFFEFB] border-b border-[#DCD6C8]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            {isLoggedin && onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="p-2 text-[#16213E]/60 hover:text-[#16213E] hover:bg-[#FAF8F3] rounded-sm transition-colors relative right-30"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <Link to={isLoggedin ? '/home' : '/'} className="flex items-center group">
            <div className="relative">
              <GraduationCap className="w-8 h-8 text-[#16213E] transition-transform group-hover:scale-110" />
            </div>
            <div className="ml-3">
              <div className="font-mono-data text-sm font-semibold tracking-wide text-[#16213E]">
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
                  className="px-4 py-2 text-sm font-medium text-[#16213E]/60 hover:text-[#16213E] hover:bg-[#FAF8F3] rounded-sm transition-all duration-200 relative group"
                >
                  {item.name}
                  <div className="absolute bottom-0 left-0 w-0 h-px bg-[#B8860B] group-hover:w-full transition-all duration-300"></div>
                </Link>
              ));})()}
            </nav>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {isLoggedin ? (
              <div className="flex items-center space-x-3">
                {/* User Profile */}
                <div className="hidden sm:flex items-center space-x-3 bg-[#FAF8F3] border border-[#DCD6C8] rounded-sm px-3 py-2">
                  <div className="w-8 h-8 bg-[#16213E] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-[#FFFEFB]" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-[#16213E]">{userData?.fullName || 'User'}</div>
                    <div className="font-mono-data text-[10px] tracking-wide text-[#16213E]/50 uppercase">{userData?.role || 'Student'}</div>
                  </div>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-[#16213E] hover:bg-[#B8860B] text-white px-4 py-2 rounded-sm font-medium transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-sm font-medium text-[#16213E] hover:text-[#B8860B] border border-[#DCD6C8] hover:border-[#B8860B] rounded-sm transition-all duration-200"
                >
                  Login
                </button>
                <button
                  onClick={onSignupClick}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#16213E] hover:bg-[#B8860B] rounded-sm transition-colors duration-200"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            {isLoggedin && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-[#16213E]/60 hover:text-[#16213E] hover:bg-[#FAF8F3] rounded-sm transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isLoggedin && isMenuOpen && (
          <div className="md:hidden border-t border-[#DCD6C8] py-4">
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
                  className="px-4 py-3 text-sm font-medium text-[#16213E]/60 hover:text-[#16213E] hover:bg-[#FAF8F3] rounded-sm transition-colors"
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