import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Settings,
  Users,
  GraduationCap,
  Building,
  UserPlus,
  BookOpen,
  Home,
  BarChart2,
  LogOut,
  Menu,
  X
} from "lucide-react";

const Sidebar = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Safely resolve user: props -> localStorage -> default
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();
  const user = props.user ?? storedUser ?? { fullName: "Guest User", role: "student" };

  // State management
  const [dropdownOpen, setDropdownOpen] = useState({
    DocumentStatus: false,
    "Scholarship Status": false,
    userManagement: false,
  });
  const [activeLink, setActiveLink] = useState("Home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Screen size and responsiveness
  useEffect(() => {
    const checkScreenSize = () => {
      const w = window.innerWidth;
      setIsMobileView(w < 768);

      if (w < 768) {
        setIsCompactMode(false);
        setIsSidebarOpen(false);
      } else if (w < 1024) {
        setIsCompactMode(true);
        setIsSidebarOpen(false);
      } else {
        setIsCompactMode(false);
        setIsSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleDropdown = (section) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("uid");
    // Optionally clear stored user
    // localStorage.removeItem("user");
    navigate("/");
    console.log("User logged out");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((s) => !s);
  };

  const items = [
    { name: "Home", icon: Home, path: "/home" },
    { name: "Dashboard", icon: BarChart2, path: "/dashboard" },
    {
      name: "Document Status",
      icon: GraduationCap,
      dropdown: [
        { name: "Upload Documents", path: "/upload" },
        { name: "Documents Status", path: "/docs-track" },
      ],
    },
    {
      name: "Scholarship Status",
      icon: Building,
      dropdown: [
        { name: "Available Scholarships", path: "/viewScholarships" },
        { name: "Applications Status", path: "/updatedDashboard" },
      ],
    },
    { name: "Video Verification", icon: UserPlus, path: "/ekyc0" },
    { name: "FAQ", icon: UserPlus, path: "/FAQ" },
    { name: "Payment History", icon: UserPlus, path: "/payment-history" },
    { name: "Guidelines", icon: BookOpen, path: "/guidelines" },
    { name: "Settings", icon: Settings, path: "/settings" },
    { name: "Logout", icon: LogOut, action: handleLogout }
  ];

  const convertToNameFormat = (text) =>
    (text || "")
      .split(" ")
      .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
      .join(" ");

  // Sidebar variants for animation
  const sidebarVariants = {
    closed: {
      width: isCompactMode ? "5rem" : "0",
      transition: {
        duration: 0.25,
        type: "tween",
      },
    },
    open: {
      width: isCompactMode ? "5rem" : "16rem",
      transition: {
        duration: 0.25,
        type: "tween",
      },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.25,
      },
    },
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <motion.div
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-full shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.div>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`
          fixed top-0 left-0 z-40 
          bg-linear-to-b from-gray-900 to-gray-800 
          text-white h-full 
          shadow-2xl
          ${isCompactMode ? "w-20" : "w-64"}
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 
          flex flex-col
        `}
      >
        {/* Close Button for Mobile/Compact Mode */}
        {(isSidebarOpen || isCompactMode) && isMobileView && (
          <motion.div
            className="absolute top-4 right-4 cursor-pointer text-gray-300 hover:text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
          >
            <X size={24} />
          </motion.div>
        )}

        {/* User Profile Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={menuItemVariants}
          className="flex items-center mb-6 p-4 border-b border-gray-700"
        >
          <motion.img
            src="https://thumbs.dreamstime.com/b/half-body-father-avatar-vector-stock-illustration-isolated-blue-background-312576179.jpg"
            alt="User Avatar"
            className="w-12 h-12 rounded-full mr-4 border-2 border-blue-500"
            whileHover={{ scale: 1.05 }}
          />
          <div className={isCompactMode ? "hidden" : ""}>
            <p className="font-bold text-xl text-blue-300">
              {convertToNameFormat(user.fullName)}
            </p>
            <p className="text-sm text-gray-400">
              {user.role === "student" ? "Student" : "Admin"}
            </p>
          </div>
        </motion.div>

        {/* Menu Items */}
        <div className="grow overflow-hidden">
          <div className="h-full overflow-y-auto sidebar-scroll px-2">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate="visible"
                  variants={menuItemVariants}
                  transition={{ delay: index * 0.03 }}
                >
                  <motion.div
                    onClick={() => {
                      if (item.dropdown) {
                        toggleDropdown(item.name);
                      } else if (item.action) {
                        item.action();
                      } else {
                        setActiveLink(item.name);
                        if (item.path) navigate(item.path);
                      }
                    }}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.15 },
                    }}
                  >
                    <NavLink
                      to={item.path || "#"}
                      className={`flex items-center py-3 px-3 rounded-lg cursor-pointer transition duration-200 ease-in-out
                        ${activeLink === item.name ? "bg-blue-600 text-white" : "hover:bg-gray-700 text-gray-300"}
                        ${isCompactMode ? "justify-center" : ""} ${item.name === "Logout" ? "hover:bg-red-600" : ""}`}
                    >
                      <item.icon size={18} className="mr-3" />
                      <span className={`text-base font-medium ${isCompactMode ? "hidden" : ""}`}>
                        {item.name}
                      </span>
                      {item.dropdown && !isCompactMode &&
                        (dropdownOpen[item.name] ? (
                          <ChevronUp size={18} className="ml-auto" />
                        ) : (
                          <ChevronDown size={18} className="ml-auto" />
                        ))
                      }
                    </NavLink>
                  </motion.div>

                  {/* Dropdown Submenu */}
                  <AnimatePresence>
                    {item.dropdown && dropdownOpen[item.name] && !isCompactMode && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          transition: { duration: 0.2 }
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                          transition: { duration: 0.15 }
                        }}
                        className="ml-6 mt-1"
                      >
                        {item.dropdown.map((subItem, subIndex) => (
                          <motion.div key={subIndex} whileHover={{ scale: 1.02 }}>
                            <NavLink
                              to={subItem.path}
                              className={({ isActive }) =>
                                `py-2 px-3 rounded-lg cursor-pointer text-sm block transition duration-150 ease-in-out
                                  ${isActive ? "bg-blue-500 text-white" : "hover:bg-gray-700 text-gray-300"}`
                              }
                              onClick={() => {
                                setActiveLink(subItem.name);
                              }}
                            >
                              {subItem.name}
                            </NavLink>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
