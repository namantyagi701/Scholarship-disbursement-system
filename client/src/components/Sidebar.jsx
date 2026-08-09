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
      { label: 'Payment Batches', icon: ClipboardList, path: '/finance/batches' },
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
      {/* Overlay — mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#16213E] text-[#FFFEFB] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* User Profile */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[#FFFEFB]/10">
          <div className="w-10 h-10 bg-[#B8860B] rounded-full flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-[#FFFEFB]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-[#FFFEFB]">{userData?.fullName || 'User'}</p>
            <p className="font-mono-data text-[10px] tracking-[0.15em] uppercase text-[#FFFEFB]/50">{userData?.role || 'Student'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#FFFEFB]/10 rounded-sm transition-colors lg:hidden"
          >
            <X className="w-5 h-5 text-[#FFFEFB]/60" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 scrollbar-thin">
          {menuItems.map((item) => {
            if (item.children) {
              const isSubOpen = openMenus[item.label];
              const isChildActive = item.children.some((c) => isActive(c.path));

              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleSubMenu(item.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                      isChildActive
                        ? 'bg-[#B8860B]/20 text-[#B8860B]'
                        : 'text-[#FFFEFB]/60 hover:bg-[#FFFEFB]/5 hover:text-[#FFFEFB]'
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {isSubOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {isSubOpen && (
                    <div className="ml-8 mt-0.5 space-y-0.5 border-l border-[#FFFEFB]/10 pl-0">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={onClose}
                          className={`block px-3 py-2 rounded-sm text-sm transition-colors ${
                            isActive(child.path)
                              ? 'text-[#B8860B] bg-[#B8860B]/10'
                              : 'text-[#FFFEFB]/50 hover:text-[#FFFEFB] hover:bg-[#FFFEFB]/5'
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#B8860B]/20 text-[#B8860B]'
                    : 'text-[#FFFEFB]/60 hover:bg-[#FFFEFB]/5 hover:text-[#FFFEFB]'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" strokeWidth={1.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-[#FFFEFB]/10 p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium text-[#FFFEFB]/60 hover:bg-[#8B2E2E]/20 hover:text-[#D4A0A0] transition-colors"
          >
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
