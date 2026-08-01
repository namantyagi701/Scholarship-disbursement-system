import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import LoadingScreen from './LoadingScreen';

/**
 * ProtectedRoute — wraps routes that require authentication.
 *
 * @param {string[]} [allowedRoles] — if provided, only users with one of these
 *   roles may access the nested routes. Others are shown an "Access Denied" page.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isLoggedin, userData, authChecked } = useContext(AppContent);

  // Auth check hasn't resolved yet — show loading, don't flash content or redirect
  if (!authChecked) {
    return <LoadingScreen message="Loading..." />;
  }

  // Not logged in — redirect to landing page
  if (!isLoggedin) {
    return <Navigate to="/" replace />;
  }

  // Role restriction check
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = userData?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F3]">
          <div className="text-center border border-[#DCD6C8] bg-[#FFFEFB] rounded-sm p-12 max-w-md">
            <p className="font-mono-data text-xs tracking-[0.2em] uppercase text-[#B8860B] mb-4">
              403
            </p>
            <h1 className="font-serif-display text-2xl font-normal text-[#16213E] mb-3">
              Access Denied
            </h1>
            <p className="text-sm text-[#16213E]/55 mb-6">
              You don't have permission to access this page.
            </p>
            <a
              href="/home"
              className="inline-block px-6 py-2.5 bg-[#16213E] text-white text-sm font-medium rounded-sm hover:bg-[#B8860B] transition-colors duration-200"
            >
              Go to Home
            </a>
          </div>
        </div>
      );
    }
  }

  return <Outlet />;
};

/**
 * PublicOnlyRoute — wraps routes that should only be accessible to
 * unauthenticated users (login, signup, landing). Already-logged-in
 * users are redirected to /home.
 */
export const PublicOnlyRoute = () => {
  const { isLoggedin, authChecked } = useContext(AppContent);

  // Still checking — show loading instead of premature redirect
  if (!authChecked) {
    return <LoadingScreen message="Loading..." />;
  }

  // Already logged in — redirect away from public-only pages
  if (isLoggedin) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
