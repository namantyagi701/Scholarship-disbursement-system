import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { AppContent } from '../context/AppContext';

const Header = () => {

  const navigate = useNavigate();
  const { logoutUser, isLoggedin } = useContext(AppContent);

 
  const handleLogout = async () => {
    await logoutUser();
    navigate('/landing');
  };
  
  return (
    <header className="sticky top-0 z-40 bg-[#f5f6f1] shadow-md w-full">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <GraduationCap className="w-10 h-10 text-blue-500 mr-3" />
            <div className="text-3xl font-bold text-gray-700">ScholarBridge</div>
          </Link>

          {/* Navigation Links */}
          {isLoggedin &&
            <>
              <nav className="hidden md:flex space-x-10 items-center text-gray-600 font-medium">
                <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
                <Link to="/about" className="hover:text-blue-500 transition-colors">About Us</Link>
                <Link to="/dashboard" className="hover:text-blue-500 transition-colors">Dashboard</Link>
                <Link to="/contact" className="hover:text-blue-500 transition-colors">Contact Us</Link>
                <Link to="/faq" className="hover:text-blue-500 transition-colors">FAQs</Link>

              </nav>
            </>
          }

          {/* Action Buttons */}
          <div className="flex space-x-6">

            {isLoggedin ? (
              <button
                onClick={handleLogout}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold shadow-sm hover:bg-blue-700 transition-colors"
              >
                LOGOUT
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold shadow-sm hover:bg-gray-100 transition-colors border border-gray-300"
                >
                  LOGIN
                </Link>

                <Link
                  to="/signup"
                  className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold shadow-sm hover:bg-green-700 transition-colors"
                >
                  SIGN UP
                </Link>
              </>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;