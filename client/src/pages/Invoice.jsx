import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const generateInvoiceNo = () => `SC${Math.floor(1000 + Math.random() * 9000)}`;
const generateTRN = () =>
  Math.floor(1000000000000 + Math.random() * 9000000000000);

const Invoice = () => {
  const [invoiceNo] = useState(generateInvoiceNo());
  const [trn] = useState(generateTRN());
  const [customerName, setCustomerName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [items, setItems] = useState([
    { description: "", quantity: 1, unitPrice: 0, discount: 0 },
  ]);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const navigate = useNavigate();

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = ["quantity", "unitPrice", "discount"].includes(
      field
    )
      ? Number(value)
      : value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { description: "", quantity: 1, unitPrice: 0, discount: 0 },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const getItemCalculations = (item) => {
    const baseAmount = item.unitPrice * item.quantity;

    const discountPerUnit = (item.unitPrice * item.discount) / 100;
    const netUnitPrice = item.unitPrice - discountPerUnit;

    const discountAmount = discountPerUnit * item.quantity;
    const netAmount = netUnitPrice * item.quantity;

    const vatAmount = netAmount * 0.05; // ✅ Corrected VAT is 5% of netAmount
    const total = netAmount + vatAmount;

    return {
      baseAmount,
      discountAmount,
      netAmount,
      vatAmount,
      total,
    };
  };

  const totals = items.reduce(
    (acc, item) => {
      const calc = getItemCalculations(item);
      acc.base += calc.baseAmount;
      acc.discount += calc.discountAmount;
      acc.net += calc.netAmount;
      acc.vat += calc.vatAmount;
      acc.total += calc.total;
      return acc;
    },
    { base: 0, discount: 0, net: 0, vat: 0, total: 0 }
  );

  const balance =
    receivedAmount >= totals.total
      ? 0
      : (totals.total - receivedAmount).toFixed(2);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Invoice</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <strong>Invoice No:</strong> {invoiceNo}
        </div>
        <div>
          <strong>TRN:</strong> {trn}
        </div>
        <div>
          <strong>Date:</strong> {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6">
        {items.map((item, index) => {
          const calc = getItemCalculations(item);
          return (
            <div key={index} className="border p-4 rounded-md bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter item description"
                    className="w-full px-4 py-2 border rounded-md"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    className="w-full px-4 py-2 border rounded-md"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Unit Price"
                    className="w-full px-4 py-2 border rounded-md"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, "unitPrice", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Discount"
                    className="w-full px-4 py-2 border rounded-md"
                    value={item.discount}
                    onChange={(e) =>
                      handleItemChange(index, "discount", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total (AED)
                  </label>
                  <div className="px-4 py-2 border rounded-md bg-gray-100 text-sm">
                    <strong>{calc.total.toFixed(2)} AED</strong>
                  </div>
                </div>
              </div>

              {items.length > 1 && (
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-600 text-sm mt-2"
                >
                  Remove
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={addItem}
        className="mt-6 mb-4 px-6 py-2 bg-blue-600 text-white rounded-md"
      >
        Add More
      </button>

      <div className="mt-6 text-right space-y-1">
        <div>Total Amount: {totals.base.toFixed(2)} AED</div>
        <div>Discount: {totals.discount.toFixed(2)} AED</div>
        <div>VAT (5%): {totals.vat.toFixed(2)} AED</div>
        <div className="font-bold text-lg">
          Net Payable: {totals.total.toFixed(2)} AED
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Received Amount</label>
          <input
            type="number"
            className="w-48 px-4 py-2 border rounded-md"
            value={receivedAmount}
            onChange={(e) => setReceivedAmount(Number(e.target.value))}
          />
        </div>

        {receivedAmount < totals.total && (
          <div className="text-red-600 font-semibold">
            Remaining Balance: {balance} AED
          </div>
        )}
      </div>

      {items.length > 0 && (
        <button
          onClick={() =>
            navigate(`/dashboard/invoice-print/${invoiceNo}`, {
              state: {
                invoiceNo,
                trn,
                customerName,
                projectName,
                items,
                receivedAmount,
                totals,
                balance,
                date: new Date().toLocaleDateString(),
              },
            })
          }
          className="mt-6 px-6 py-2 bg-green-600 text-white rounded-md"
        >
          Generate Invoice
        </button>
      )}
    </div>
  );
};

export default Invoice;
