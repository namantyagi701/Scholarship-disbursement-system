import React from "react";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0F1729] border-t border-[#16213E]">
      <div className="max-w-[1300px] mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">

        {/* Column 1 — About */}
        <div>
          <h3 className="font-mono-data text-xs tracking-[0.15em] uppercase text-[#B8860B] mb-4">About PMSSS</h3>
          <p className="text-[#FFFEFB]/40 text-sm leading-relaxed">
            The Prime Minister's Special Scholarship Scheme (PMSSS) aims to 
            support students by providing seamless online scholarship 
            applications, verification, and disbursement.
          </p>
        </div>

        {/* Column 2 — Quick Links */}
        <div>
          <h3 className="font-mono-data text-xs tracking-[0.15em] uppercase text-[#B8860B] mb-4">Quick Links</h3>
          <ul className="text-[#FFFEFB]/40 text-sm space-y-2.5">
            <li className="hover:text-[#B8860B] cursor-pointer transition-colors duration-200">How to Apply</li>
            <li className="hover:text-[#B8860B] cursor-pointer transition-colors duration-200">Downloads</li>
            <li className="hover:text-[#B8860B] cursor-pointer transition-colors duration-200">Guidelines</li>
            <li className="hover:text-[#B8860B] cursor-pointer transition-colors duration-200">Support</li>
          </ul>
        </div>

        {/* Column 3 — Contact */}
        <div>
          <h3 className="font-mono-data text-xs tracking-[0.15em] uppercase text-[#B8860B] mb-4">Contact Us</h3>
          <ul className="text-[#FFFEFB]/40 text-sm space-y-3">
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#B8860B]" />
              support@pmsss.gov
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#B8860B]" />
              +91 98765 43210
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#B8860B]" />
              New Delhi, India
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-[#16213E] py-4">
        <div className="max-w-[1300px] mx-auto px-6 flex justify-between text-xs text-[#FFFEFB]/30">

          <p>© {new Date().getFullYear()} PMSSS Digital Portal. All Rights Reserved.</p>

          <p className="flex items-center gap-1.5 hover:text-[#B8860B] cursor-pointer transition-colors duration-200">
            Visit Official Website <ExternalLink className="w-3.5 h-3.5" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
