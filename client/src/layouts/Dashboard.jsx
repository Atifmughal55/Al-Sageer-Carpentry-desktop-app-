import React from "react";
import { Outlet } from "react-router-dom";
import UserMenu from "../components/UserMenu";

const Dashboard = () => {
  return (
    <div className="h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col border-r border-gray-200">
        <UserMenu />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Optional Header */}
        {/* <header className="bg-white shadow px-6 py-4 sticky top-0 z-10">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </header> */}

        {/* Scrollable Outlet */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
