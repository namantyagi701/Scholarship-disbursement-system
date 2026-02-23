import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import {
  Home,
  User,
  Upload,
  FileText,
  ClipboardList,
  CreditCard,
  CheckCircle,
  XCircle,
  Users,
  UserPlus,
  LogOut,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { userData, logoutUser } = useContext(AppContent);
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = React.useState({});

  const toggleSubMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = async () => {
    await logoutUser();
    onClose();
    navigate('/');
  };

  const role = userData?.role || 'student';

  // Role-based menu items matching backend routes
  const menuConfig = {
    student: [
      { label: 'Home', icon: Home, path: '/home' },
      { label: 'Profile', icon: User, path: '/profile' },
      {
        label: 'Scholarship',
        icon: ClipboardList,
        children: [
          { label: 'Application', path: '/scholarship-application' },
          { label: 'Application Status', path: '/application-status' },
        ],
      },
      { label: 'Payment Details', icon: CreditCard, path: '/payment-details' },
    ],
    sag: [
      { label: 'Home', icon: Home, path: '/home' },
      { label: 'All Applications', icon: ClipboardList, path: '/sag/applications' },
    ],
    finance: [
      { label: 'Home', icon: Home, path: '/home' },
      { label: 'Approved Applications', icon: CheckCircle, path: '/finance/approved' },
      { label: 'Payment History', icon: CreditCard, path: '/finance/payment-history' },
    ],
    admin: [
      { label: 'Home', icon: Home, path: '/home' },
      { label: 'Create User', icon: UserPlus, path: '/admin/create-user' },
      { label: 'Manage Users', icon: Users, path: '/admin/users' },
    ],
  };

  const menuItems = menuConfig[role] || menuConfig.student;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay */}
      {/* Overlay — mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#1e293b] text-white transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* User Profile */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{userData?.fullName || 'User'}</p>
            <p className="text-xs text-slate-400 capitalize">{userData?.role || 'Student'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
          {menuItems.map((item) => {
            if (item.children) {
              const isSubOpen = openMenus[item.label];
              const isChildActive = item.children.some((c) => isActive(c.path));

              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleSubMenu(item.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isChildActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {isSubOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {isSubOpen && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={onClose}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive(child.path)
                              ? 'text-blue-400 bg-slate-700/60'
                              : 'text-slate-400 hover:text-white hover:bg-slate-700/40'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-700 p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
