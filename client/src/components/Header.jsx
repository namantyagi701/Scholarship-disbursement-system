import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  const menuItems = [
    { label: "Home", items: [], path: "/" },
    { label: "About", items: [], path: "/about" },
    { label: "Dashboard", items: [], path: "/dashboard" },
    {
      label: "Downloads",
      items: [
        { label: "Income Certificate", path: "#" },
        { label: "User Manual", path: "#" },
        { label: "User Manual For Non-NET", path: "#" },
        { label: "HDI Forwarding Letter", path: "#" },
        { label: "GUIDELINES", path: "#" },
        { label: "TR FORM 7", path: "#" },
      ],
    },
    { label: "Scholarships", items: [], path: "/contactd" },
    { label: "Weblinks", items: [], path: "#" },
    { label: "Emergency Relief Fund", items: [], path: "#" },
  ];

  return (
    <div className="w-full pt-4 bg-indigo-300 border-b border-gray-200 shadow-sm hidden sm:block">
      <div className="max-w-[1300px] mx-auto px-6">
        <ul className="flex justify-center gap-20 py-3">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(index)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              
              {/* MAIN MENU ITEM */}
              <Link
                to={item.path}
                className={`
                  relative px-2 py-1 text-[17px] font-semibold text-gray-700
                  hover:text-blue-600 transition-all duration-200
                  ${location.pathname === item.path ? "text-blue-600" : ""}
                `}
              >
                {item.label}

                {/* Animated underline */}
                <span
                  className={`
                    absolute left-0 -bottom-0.5 h-0.5 w-full bg-blue-600 rounded-full
                    transform origin-left transition-transform duration-300
                    ${location.pathname === item.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                  `}
                ></span>

                {item.items.length > 0 && (
                  <ChevronDown
                    className="inline-block ml-1 transition-transform duration-300 group-hover:rotate-180"
                    size={16}
                  />
                )}
              </Link>

              {/* DROPDOWN */}
              {item.items.length > 0 && activeDropdown === index && (
                <ul
                  className="
                    absolute left-0 mt-2 w-56 bg-white border border-gray-200 
                    shadow-lg rounded-md z-20 overflow-hidden animate-fadeIn
                  "
                >
                  {item.items.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        to={subItem.path}
                        className="
                          block px-5 py-3 text-[15px] text-gray-700
                          hover:bg-blue-50 hover:text-blue-600 transition-all
                        "
                      >
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Header;
