import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";


const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Navbar should always be visible */}
      <div className="sticky top-0 z-50 shadow-sm">
        <Navbar />
      </div>

      {/* Header bar below navbar */}
      <div className="sticky top-16 z-40 bg-white shadow-sm">
        <Header />
      </div>

      {/* Main content area */}
      <main className="grow pt-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;