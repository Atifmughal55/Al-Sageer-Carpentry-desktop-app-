import React, { useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

// Dummy Sales Data
const initialSalesData = [
  {
    id: 1,
    customerName: "Ahmed Khan",
    contact: "+92-3012345678",
    invoice: 245734,
    totalAmount: 8000,
    paidAmount: 5000,
    date: "2025-06-10",
    status: "Partial",
  },
  {
    id: 2,
    customerName: "Sara Ali",
    contact: "+92-3123456789",
    invoice: 235634,
    totalAmount: 3000,
    paidAmount: 3000,
    date: "2025-06-12",
    status: "Paid",
  },
  {
    id: 3,
    customerName: "Zain Raza",
    contact: "+92-3456789012",
    invoice: 235463,
    totalAmount: 6000,
    paidAmount: 0,
    date: "2025-06-09",
    status: "Unpaid",
  },
];

// Status color helper
const getStatusColor = (status) => {
  switch (status) {
    case "Paid":
      return "text-green-600 bg-green-100";
    case "Partial":
      return "text-yellow-600 bg-yellow-100";
    case "Unpaid":
      return "text-red-600 bg-red-100";
    default:
      return "";
  }
};

const Sales = () => {
  const [sales, setSales] = useState(initialSalesData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortByDate, setSortByDate] = useState("latest");

  // Filtered and Sorted Sales
  const filteredSales = sales
    .filter((sale) =>
      `${sale.customerName} ${sale.contact} ${sale.invoice}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((sale) =>
      statusFilter === "All" ? true : sale.status === statusFilter
    )
    .sort((a, b) => {
      return sortByDate === "latest"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    });

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold text-yellow-900">Sales Records</h2>
        <Link
          to={"/dashboard/invoice"}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow font-semibold"
        >
          + Add Invoice
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by customer, contact, items..."
          className="border px-4 py-2 rounded-md w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded-md w-full md:w-1/4"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        <select
          className="border px-4 py-2 rounded-md w-full md:w-1/4"
          value={sortByDate}
          onChange={(e) => setSortByDate(e.target.value)}
        >
          <option value="latest">Date: Latest First</option>
          <option value="oldest">Date: Oldest First</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-yellow-200 text-yellow-900 text-left">
            <tr>
              <th className="py-2 px-2">#</th>
              <th className="py-2 px-2">Invoice No</th>
              <th className="py-2 px-2">Customer Name</th>
              <th className="py-2 px-2">Contact</th>
              <th className="py-2 px-2">Total</th>
              <th className="py-2 px-2">Paid</th>
              <th className="py-2 px-2">Pending</th>
              <th className="py-2 px-2">Date</th>
              <th className="py-2 px-2">Status</th>
              <th className="py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale, index) => {
              const pending = sale.totalAmount - sale.paidAmount;
              return (
                <tr
                  key={sale.id}
                  className="border-t border-yellow-100 hover:bg-yellow-50"
                >
                  <td className="py-2 px-2">{index + 1}</td>
                  <td className="py-2 px-2">{sale.invoice}</td>
                  <td className="py-2 px-2">{sale.customerName}</td>
                  <td className="py-2 px-2">{sale.contact}</td>
                  <td className="py-2 px-2">Rs {sale.totalAmount}</td>
                  <td className="py-2 px-2">Rs {sale.paidAmount}</td>
                  <td className="py-2 px-2">Rs {pending}</td>
                  <td className="py-2 px-2">{sale.date}</td>
                  <td className="py-2 px-2">
                    <span
                      className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(
                        sale.status
                      )}`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white">
                        <MdEdit />
                      </button>
                      <button className="p-2 rounded-md bg-red-500 hover:bg-red-600 text-white">
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredSales.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
