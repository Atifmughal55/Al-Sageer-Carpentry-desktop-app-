import React from "react";
import { MdClose } from "react-icons/md";

const PurchaseViewModel = ({ close, data }) => {
  if (!data) return null;

  const {
    purchase_no,
    purchase_date,
    supplier_name,
    total_amount,
    paid_amount,
    balance,
    payment_status,
    description,
    remarks,
  } = data;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition"
        >
          <MdClose size={24} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-yellow-600 mb-6 text-center">
          Purchase Summary
        </h2>

        {/* Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
          <Info label="Purchase No" value={purchase_no} />
          <Info label="Date" value={purchase_date} />
          <Info label="Supplier" value={supplier_name} />
          <Info
            label="Status"
            value={payment_status}
            valueClass="font-semibold text-yellow-700"
          />
        </div>

        <div className="border-t my-4"></div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Amount label="Total" value={total_amount} />
          <Amount label="Paid" value={paid_amount} />
          <Amount label="Balance" value={balance} isWarning={balance > 0} />
        </div>

        {/* Description / Remarks */}
        {/* Description / Remarks */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {description && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 shadow-sm">
              <p className="text-md font-semibold text-gray-500 mb-1">
                Description
              </p>
              <p className="text-sm  text-gray-700 leading-relaxed">
                {description}
              </p>
            </div>
          )}
          {remarks && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 shadow-sm">
              <p className="text-md font-semibold text-gray-500 mb-1">
                Remarks
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{remarks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const Info = ({ label, value, valueClass = "" }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className={`text-base font-medium ${valueClass}`}>{value}</p>
  </div>
);

const Amount = ({ label, value, isWarning = false }) => (
  <div className="bg-yellow-50 rounded-lg p-4 text-center shadow-inner">
    <p className="text-xs text-gray-500">{label}</p>
    <p
      className={`text-xl font-bold ${
        isWarning ? "text-red-600" : "text-yellow-700"
      }`}
    >
      {value} <span className="text-sm">AED</span>
    </p>
  </div>
);

export default PurchaseViewModel;
