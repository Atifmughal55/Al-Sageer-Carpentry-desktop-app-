import React from "react";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";

const dummyPurchases = [
  {
    id: 1,
    supplierName: "ABC Traders",
    purchaseDate: "2025-06-10",
    items: "LED Bulbs, Wires",
    totalAmount: 12000,
    paidAmount: 8000,
  },
  {
    id: 2,
    supplierName: "Light House",
    purchaseDate: "2025-06-08",
    items: "Smart Switches",
    totalAmount: 7000,
    paidAmount: 7000,
  },
];

const Purchases = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-yellow-900">Purchases</h2>
        <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-md shadow transition duration-200">
          <MdAdd className="text-xl" />
          Add Purchase
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-yellow-200 text-yellow-900 text-left">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Supplier</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Paid</th>
              <th className="py-3 px-4">Due</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyPurchases.map((p, index) => {
              const due = p.totalAmount - p.paidAmount;
              return (
                <tr
                  key={p.id}
                  className="border-t border-yellow-100 hover:bg-yellow-50"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{p.supplierName}</td>
                  <td className="py-3 px-4">{p.purchaseDate}</td>
                  <td className="py-3 px-4">{p.items}</td>
                  <td className="py-3 px-4">Rs {p.totalAmount}</td>
                  <td className="py-3 px-4">Rs {p.paidAmount}</td>
                  <td className="py-3 px-4">Rs {due}</td>
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

export default Purchases;
