import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";


const MainLayout = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">

      {/* Navbar should always be visible */}


      {/* Header bar below navbar */}
      <div className="sticky bg-white shadow-sm">
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