import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import React, { useContext } from 'react';
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();

  const { userData, backendUrl, logoutUser } = useContext(AppContent);

  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/auth/send-verify-otp',
        {},
        { withCredentials: true }
      );

      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/landing");
  };

  return (
    <div className="w-full fixed top-0 left-0 z-50 bg-linear-to-r from-indigo-600 to-indigo-700 backdrop-blur-xl shadow-sm">
      <div className="flex justify-between items-center px-6 sm:px-10 py-4 max-w-[1700px] mx-auto">

        {/* LOGO + WEBSITE NAME */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={assets.logo}
            alt="logo"
            className="w-12 h-12 object-contain transition-transform hover:scale-105"
          />

          {/* ⭐ SCHOLARSPHERE NAME */}
          <h1 className="ml-3 text-2xl font-extrabold bg-linear-to-r bg-black text-transparent bg-clip-text tracking-wide drop-shadow-sm hover:tracking-wider transition-all">
            SSP
          </h1>
        </div>

        {/* RIGHT SIDE */}
        {userData ? (
          <div className="relative group">
            <div className="w-9 h-9 flex justify-center items-center rounded-full bg-black text-white font-semibold cursor-pointer shadow-md">
              {userData.name[0].toUpperCase()}
            </div>

            {/* DROPDOWN */}
            <div className="absolute right-0 mt-1 hidden group-hover:block bg-white shadow-lg rounded-lg p-2 w-40 border">
              
              {!userData.isAccountVerified && (
                <div
                  className="py-2 px-3 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700"
                  onClick={sendVerificationOtp}
                >
                  Verify Aadhar
                </div>
              )}

              <div
                className="py-2 px-3 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700"
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          </div>

        ) : (
          <button 
            onClick={() => navigate('/login')} 
            className="flex items-center gap-2 border border-gray-400 bg-white shadow-sm rounded-full px-6 py-2 text-gray-700 hover:bg-gray-100 transition"
          >
            Login 
            <img src={assets.arrow_icon} alt="" className="w-4" />
          </button>
        )}

      </div>
    </div>
  );
}

export default Navbar;
