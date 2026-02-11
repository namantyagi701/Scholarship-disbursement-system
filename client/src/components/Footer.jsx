import React from "react";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-800 border-t border-gray-200 mt-10">
      <div className="max-w-[1300px] mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-10">

        {/* Column 1 — About */}
        <div>
          <h3 className="text-lg font-semibold text-gray-100 mb-3">About PMSSS</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            The Prime Minister’s Special Scholarship Scheme (PMSSS) aims to 
            support students by providing seamless online scholarship 
            applications, verification, and disbursement.
          </p>
        </div>

        {/* Column 2 — Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-100 mb-3">Quick Links</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li className="hover:text-blue-600 cursor-pointer">How to Apply</li>
            <li className="hover:text-blue-600 cursor-pointer">Downloads</li>
            <li className="hover:text-blue-600 cursor-pointer">Guidelines</li>
            <li className="hover:text-blue-600 cursor-pointer">Support</li>
          </ul>
        </div>

        {/* Column 3 — Contact */}
        <div>
          <h3 className="text-lg font-semibold text-gray-100 mb-3">Contact Us</h3>
          <ul className="text-gray-400 text-sm space-y-3">
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              support@pmsss.gov
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              New Delhi, India
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-gray-200 py-4">
        <div className="max-w-[1300px] mx-auto px-6 flex justify-between text-sm text-gray-500">

          <p>© {new Date().getFullYear()} PMSSS Digital Portal. All Rights Reserved.</p>

          <p className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
            Visit Official Website <ExternalLink className="w-4 h-4" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
