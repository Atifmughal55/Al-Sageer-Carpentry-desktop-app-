import React from "react";
import { MdClose } from "react-icons/md";

const ViewModel = ({ close, data }) => {
  if (!data) return null;

  const {
    invoice_no,
    quotation_id,
    project_name,
    customer_trn,
    total_amount,
    vat,
    total_with_vat,
    received,
    remaining,
    status,
    discount,
    created_at,
    customer,
  } = data;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center px-4 ">
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
          Invoice Summary
        </h2>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
          <Info label="Invoice No" value={invoice_no} />
          <Info label="Quotation ID" value={quotation_id} />
          <Info label="Project Name" value={project_name} />
          <Info label="Date" value={created_at?.split(" ")[0]} />
          <Info
            label="Status"
            value={status}
            valueClass={getStatusColor(status)}
          />
          <Info label="TRN" value={customer_trn} />
        </div>

        {/* Divider */}
        <div className="border-t my-4" />

        {/* Payment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Amount label="Subtotal" value={total_amount} />
          <Amount label="VAT" value={vat} />
          <Amount label="Discount" value={discount} />
          <Amount label="Total with VAT" value={total_with_vat} />
          <Amount label="Received" value={received} />
          <Amount
            label="Remaining"
            value={remaining}
            isWarning={remaining > 0}
          />
        </div>

        {/* Divider */}
        <div className="border-t my-4" />

        {/* Customer Info */}
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Customer Info
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Info label="Name" value={customer?.name} />
          <Info label="Phone" value={customer?.phone} />
          <Info label="Email" value={customer?.email} />
          <Info label="Address" value={customer?.address} />
        </div>
      </div>
    </div>
  );
};

// Helper Components
const Info = ({ label, value, valueClass = "" }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className={`text-base font-medium break-words ${valueClass}`}>{value}</p>
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

const getStatusColor = (status) => {
  switch (status) {
    case "Paid":
      return "text-green-600 font-semibold";
    case "Partial":
      return "text-yellow-600 font-semibold";
    default:
      return "text-red-600 font-semibold";
  }
};

export default ViewModel;
