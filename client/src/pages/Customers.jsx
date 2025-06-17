import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";

// Dummy data
const dummyCustomers = [
  {
    id: 1,
    name: "John Doe",
    contact: "+923001234567",
    purchases: 5,
    totalBill: 8000,
    paid: 6000,
  },
  {
    id: 2,
    name: "Ayesha Khan",
    contact: "+923009876543",
    purchases: 3,
    totalBill: 4500,
    paid: 4500,
  },
  {
    id: 3,
    name: "Ali Raza",
    contact: "+923004567890",
    purchases: 7,
    totalBill: 12000,
    paid: 3000,
  },
];

const Customers = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-900">Customers</h2>
        <input
          type="text"
          placeholder="Search by name / contact..."
          className="px-2 py-1 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 shadow-sm bg-white text-yellow-900 placeholder-yellow-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-yellow-200 text-yellow-900">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Customer Name</th>
              <th className="py-3 px-4 text-left">Contact</th>
              <th className="py-3 px-4 text-left">Purchases</th>
              <th className="py-3 px-4 text-left">Total Bill</th>
              <th className="py-3 px-4 text-left">Pending Dues</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyCustomers.map((customer, index) => {
              const pending = customer.totalBill - customer.paid;
              return (
                <tr
                  key={customer.id}
                  className="border-t border-yellow-100 hover:bg-yellow-50"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{customer.name}</td>
                  <td className="py-3 px-4">{customer.contact}</td>
                  <td className="py-3 px-4">{customer.purchases}</td>
                  <td className="py-3 px-4">Rs {customer.totalBill}</td>
                  <td className="py-3 px-4">
                    Rs {pending}
                    {pending > 0 ? (
                      <span className="ml-2 text-sm font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                        Due
                      </span>
                    ) : (
                      <span className="ml-2 text-sm font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        Clear
                      </span>
                    )}
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
