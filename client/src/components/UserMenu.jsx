import React from "react";
import {
  MdDashboard,
  MdShoppingCart,
  MdRequestQuote,
  MdAttachMoney,
  MdPeople,
  MdAccountBalance,
  MdPointOfSale,
  MdReceipt,
  MdLogout,
} from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

// Define menu with path
const menuItems = [
  { label: "Dashboard", icon: <MdDashboard />, path: "/dashboard" },
  {
    label: "Sales/Invoices",
    icon: <MdAttachMoney />,
    path: "/dashboard/sales",
  },
  {
    label: "Purchases",
    icon: <MdShoppingCart />,
    path: "/dashboard/purchases",
  },
  {
    label: "Quotations",
    icon: <MdRequestQuote />,
    path: "/dashboard/quotations",
  },

  { label: "Customers", icon: <MdPeople />, path: "/dashboard/customers" },
  { label: "Taxes", icon: <MdAccountBalance />, path: "/dashboard/taxes" },
  { label: "Cash", icon: <MdPointOfSale />, path: "/dashboard/cash" },
  { label: "Expenses", icon: <MdReceipt />, path: "/dashboard/expenses" },

  { label: "Logout", icon: <MdLogout />, path: "/" },
];

const UserMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="w-64 h-screen bg-yellow-100 border-r border-yellow-300 p-5 z-40">
      <h2 className="text-2xl font-bold text-yellow-900 mb-8 text-center">
        Al Sageer
      </h2>
      <ul className="space-y-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <li
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition font-medium
              ${
                isActive
                  ? "bg-yellow-300 font-semibold"
                  : "text-yellow-900 hover:bg-yellow-200"
              }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default UserMenu;
