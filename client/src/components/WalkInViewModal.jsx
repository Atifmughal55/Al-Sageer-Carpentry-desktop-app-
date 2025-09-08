import React from "react";
import { MdClose } from "react-icons/md";

const WalkInViewModal = ({ open, onClose, data }) => {
  if (!open) return null;

  const fields = [
    { label: "Name", value: data?.name },
    { label: "Phone", value: data?.phone || "-" },
    { label: "Payment Status", value: data?.status },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[800px] max-w-[95%] p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
        >
          <MdClose size={25} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800 mb-5 text-center border-b pb-3">
          Invoice Details
        </h2>

        {/* Customer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {fields.map((field, i) => (
            <div
              key={i}
              className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <p className="text-xs text-gray-500">{field.label}</p>
              <p className="mt-1 font-semibold text-sm text-gray-800">
                {field.value}
              </p>
            </div>
          ))}
        </div>

        {/* Items Table */}
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Purchased Items
        </h3>
        <div className="overflow-x-auto max-h-[250px] overflow-y-auto border rounded-lg">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left">#</th>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-center">Qty</th>
                <th className="px-3 py-2 text-center">Unit Price</th>
                <th className="px-3 py-2 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {data?.items?.length > 0 ? (
                data.items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2">{item.description}</td>
                    <td className="px-3 py-2 text-center">{item.quantity}</td>
                    <td className="px-3 py-2 text-center">{item.unitPrice}</td>
                    <td className="px-3 py-2 text-center">{item.totalPrice}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-end">
            <div className="w-full sm:w-1/2 md:w-1/3">
              <div className="flex justify-between text-sm py-1">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{data?.grand_total}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium">{data?.discount}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-gray-600">After Discount:</span>
                <span className="font-medium">{data?.after_discount}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-gray-600">Received:</span>
                <span className="font-medium">{data?.received}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-gray-600">Balance:</span>
                <span
                  className={`font-semibold ${
                    Number(data?.balance) > 0
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {data?.balance}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalkInViewModal;
