import React from "react";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";

const dummyQuotations = [
  {
    id: 1,
    customerName: "John Doe",
    contact: "+93013453",
    startDate: "2025-06-10",
    totalCharges: 5000,
    advancePayment: 2000,
    status: "Pending",
  },
  {
    id: 2,
    customerName: "Jane Smith",
    contact: "+9301423453",
    startDate: "2025-06-08",
    totalCharges: 3000,
    advancePayment: 3000,
    status: "Complete",
  },
  {
    id: 3,
    customerName: "Ali Khan",
    contact: "+9301455013",
    startDate: "2025-06-07",
    totalCharges: 4000,
    advancePayment: 1000,
    status: "Canceled",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "text-yellow-700 bg-yellow-100";
    case "Complete":
      return "text-green-700 bg-green-100";
    case "Canceled":
      return "text-red-700 bg-red-100";
    default:
      return "";
  }
};

const Quotations = () => {
  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold text-yellow-800">Quotations</h2>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          {/* Sort Dropdown */}
          <select className="px-4 py-2 rounded-md border border-yellow-300 bg-white text-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 shadow-sm">
            <option value="">Sort By</option>
            <option value="status">Status</option>
            <option value="pending">Pending Dues</option>
          </select>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search here..."
            className="px-4 py-2 rounded-md border border-yellow-300 bg-white text-yellow-900 placeholder-yellow-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          />

          {/* Add Button */}
          <Link
            to={"/dashboard/create-quotation"}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-md shadow transition duration-200"
          >
            <MdAdd className="text-xl" />
            Add Quotation
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-yellow-200 text-yellow-900 text-sm font-semibold">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Customer Name</th>
              <th className="py-3 px-4 text-left">Contact</th>
              <th className="py-3 px-4 text-left">Start Date</th>
              <th className="py-3 px-4 text-left">Total Charges</th>
              <th className="py-3 px-4 text-left">Advance</th>
              <th className="py-3 px-4 text-left">Pending</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {dummyQuotations.map((q, index) => {
              const pending = q.totalCharges - q.advancePayment;
              return (
                <tr
                  key={q.id}
                  className="border-t border-yellow-100 hover:bg-yellow-50 transition"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{q.customerName}</td>
                  <td className="py-3 px-4">{q.contact}</td>
                  <td className="py-3 px-4">{q.startDate}</td>
                  <td className="py-3 px-4">Rs {q.totalCharges}</td>
                  <td className="py-3 px-4">Rs {q.advancePayment}</td>
                  <td className="py-3 px-4">Rs {pending}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        q.status
                      )}`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        title="Edit"
                        className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition"
                      >
                        <MdEdit />
                      </button>
                      <button
                        title="Delete"
                        className="p-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Quotations;
