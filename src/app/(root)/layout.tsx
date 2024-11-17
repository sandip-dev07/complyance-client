import { Outlet } from "react-router-dom";

import CountrySelector from "./_components/country-selector";
import Navbar from "@/components/navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <CountrySelector />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
