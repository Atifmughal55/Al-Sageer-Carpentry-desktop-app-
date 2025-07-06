import React, { useState } from "react";
import {
  MdAttachMoney,
  MdPeople,
  MdRequestQuote,
  MdProductionQuantityLimits,
} from "react-icons/md";

const StatCard = ({ icon, title, value, border }) => (
  <div className={`bg-white shadow p-5 rounded-xl border-l-4 ${border}`}>
    <div className="flex items-center gap-4">
      <span className="text-3xl text-yellow-600">{icon}</span>
      <div>
        <h4 className="text-sm text-yellow-900">{title}</h4>
        <p className="text-xl font-bold text-yellow-800">{value}</p>
      </div>
    </div>
  </div>
);

const MainPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("daily");

  const salesData = {
    daily: { title: "Daily Sales", value: "Rs. 12,000" },
    weekly: { title: "Weekly Sales", value: "Rs. 84,000" },
    monthly: { title: "Monthly Sales", value: "Rs. 320,000" },
  };

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-900 mb-6">Dashboard</h1>

      {/* Sales Card with embedded filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow p-5 rounded-xl border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 text-yellow-600 text-2xl">
              <MdAttachMoney />
              <h4 className="text-sm font-semibold text-yellow-800">
                Sales Overview
              </h4>
            </div>
            <select
              value={selectedPeriod}
              onChange={handlePeriodChange}
              className="text-sm border border-yellow-400 rounded px-2 py-1 bg-yellow-50 text-yellow-800"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <p className="text-2xl font-bold text-yellow-900">
            {salesData[selectedPeriod].value}
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            {salesData[selectedPeriod].title}
          </p>
        </div>
      </div>

      {/* Other Stats */}
      <h2 className="text-2xl font-semibold text-yellow-800 mb-4">
        Key Highlights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<MdPeople />}
          title="Customers Today"
          value="24"
          border="border-yellow-400"
        />
        <StatCard
          icon={<MdRequestQuote />}
          title="Pending Quotations"
          value="7"
          border="border-yellow-500"
        />
        <StatCard
          icon={<MdProductionQuantityLimits />}
          title="Low Stock Items"
          value="13"
          border="border-yellow-600"
        />
      </div>
    </div>
  );
};

export default MainPage;
