import React from "react";
import { Outlet } from "react-router-dom";
import UserMenu from "../components/UserMenu";

const Dashboard = () => {
  return (
    <div className="h-screen flex bg-gray-50 text-gray-900 ">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col border-r border-gray-200">
        <UserMenu />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Scrollable Outlet */}
        <main className="flex-1 overflow-y-auto ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
