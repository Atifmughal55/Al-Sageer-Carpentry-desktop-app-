import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const InvoiceEditModal = ({ selectedInvoice, close, cancel }) => {
  const [invoice, setInvoice] = useState({ ...selectedInvoice });
  const [invoiceItems, setInvoiceItems] = useState([]);

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedInvoice = { ...invoice, [name]: value };

    // Recalculate remaining if received changes
    if (name === "received") {
      const receivedAmount = parseFloat(value) || 0;
      const totalAmount = parseFloat(updatedInvoice.total_amount) || 0;
      const vat = parseFloat(updatedInvoice.vat) || 0;
      const netAmount = totalAmount + vat;
      updatedInvoice.remaining = (netAmount - receivedAmount).toFixed(2);
    }

    setInvoice(updatedInvoice);
  };

  const addNewItem = () => {
    const newItem = {
      description: "",
      quantity: 1,
      unit_price: 0,
      discount: 0,
      vat: 5,
    };
    const newItems = [...invoiceItems, newItem];
    setInvoiceItems(newItems);
    recalculateInvoiceTotals(newItems);
  };

  const removeItem = (index) => {
    const newItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(newItems);
    recalculateInvoiceTotals(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedInvoice = {
      invoice: invoice,
      customer: invoice.customer, // Assuming customer data is part of the invoice
      items: invoiceItems, // Add this
    };
    try {
      const response = await Axios({
        ...SummaryApi.editInvoice,
        url: `${SummaryApi.editInvoice.url}/${updatedInvoice.invoice.id}`, // Assuming invoice.id is the ID of the invoice
        data: updatedInvoice,
      });

      if (response.data.success) {
        toast.success("Invoice updated successfully!");
        close(); // Close modal
        navigate("/dashboard/sales"); // Redirect to invoices page
      }
    } catch (error) {
      toast.error("Failed to update invoice");
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceItems];

    const item = {
      ...updatedItems[index],
      [field]: value,
    };

    // Auto-calculation logic
    const quantity = parseFloat(item.quantity) || 0;
    const unit_price = parseFloat(item.unit_price) || 0;
    const discount = parseFloat(item.discount) || 0;
    const vat = parseFloat(item.vat) || 0;

    const discountedUnitPrice = unit_price - (unit_price * discount) / 100;
    const total_price = quantity * discountedUnitPrice;
    const vat_per_unit = discountedUnitPrice * (vat / 100);
    const total_amount_with_vat = total_price + (total_price * vat) / 100;

    item.total_price = total_price;
    item.vat_per_unit = vat_per_unit;
    item.total_amount_with_vat = total_amount_with_vat;

    updatedItems[index] = item;
    setInvoiceItems(updatedItems);
    recalculateInvoiceTotals(updatedItems); // ✅ Update totals
  };

  const fetchInvoiceItems = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getInvoiceItems,
        url: `${SummaryApi.getInvoiceItems.url}/${invoice.invoice_no}`,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        const items = responseData.data;
        if (items.length > 0) {
          setInvoiceItems(items);
        } else {
          toast.info("No invoice items found for this invoice.");
        }
      }
    } catch (error) {
      toast.error("Failed to fetch invoice items");
    }
  };
  const recalculateInvoiceTotals = (items) => {
    let totalAmount = 0;
    let totalVAT = 0;

    items.forEach((item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unit_price) || 0;
      const discount = parseFloat(item.discount) || 0;
      const vat = parseFloat(item.vat) || 0;

      const discountedUnitPrice = unitPrice - (unitPrice * discount) / 100;
      const itemTotal = quantity * discountedUnitPrice;
      const itemVAT = itemTotal * (vat / 100);

      totalAmount += itemTotal;
      totalVAT += itemVAT;
    });

    const invoiceDiscount = parseFloat(invoice.discount) || 0;
    const receivedAmount = parseFloat(invoice.received) || 0;

    const discountAmount = (totalAmount * invoiceDiscount) / 100;
    const netPayable = totalAmount + totalVAT - discountAmount;
    const remaining = netPayable - receivedAmount;

    setInvoice((prev) => ({
      ...prev,
      total_amount: totalAmount.toFixed(2),
      vat: totalVAT.toFixed(2),
      net_payable: netPayable.toFixed(2),
      remaining: remaining.toFixed(2),
    }));
  };

  useEffect(() => {
    fetchInvoiceItems();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-start overflow-y-auto p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4">
          <h2 className="text-xl font-semibold tracking-wide">Edit Invoice</h2>
          <button onClick={close} className="hover:text-red-200 transition">
            <MdClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Section: Invoice Info */}
          <section>
            <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-1 border-blue-200">
              📄 Invoice Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Invoice No
                </label>
                <input
                  type="text"
                  name="invoice_no"
                  value={invoice.invoice_no}
                  disabled
                  className="w-full p-2 mt-1 rounded-md border bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Quotation ID
                </label>
                <input
                  type="text"
                  name="quotation_id"
                  value={invoice.quotation_id}
                  onChange={handleChange}
                  disabled
                  className="w-full p-2 mt-1 rounded-md border bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Project Name
                </label>
                <input
                  type="text"
                  name="project_name"
                  value={invoice.project_name}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded-md border focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Customer TRN
                </label>
                <input
                  type="text"
                  name="customer_trn"
                  value={invoice.customer_trn}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded-md border focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          </section>

          {/* Section: Customer Info */}
          <section>
            <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-1 border-blue-200">
              👤 Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  value={invoice.customer?.name || ""}
                  disabled
                  className="w-full p-2 mt-1 rounded-md border bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  value={invoice.customer?.email || ""}
                  disabled
                  className="w-full p-2 mt-1 rounded-md border bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* Section: Financial Info */}
          <section>
            <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-1 border-blue-200">
              💰 Financial Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Total Amount
                </label>
                <input
                  type="number"
                  name="total_amount"
                  value={invoice.total_amount}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded-md border focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">VAT</label>
                <input
                  type="number"
                  name="vat"
                  value={invoice.vat}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded-md border focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={invoice.discount}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded-md border focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Received
                </label>
                <input
                  type="number"
                  name="received"
                  value={invoice.received}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded-md border focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Remaining
                </label>
                <input
                  type="number"
                  name="remaining"
                  value={invoice.remaining}
                  disabled
                  className="w-full p-2 mt-1 rounded-md border bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* Section: Invoice Items (Coming Soon) */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-gray-700">
                🧾 Invoice Items
              </h3>
              <button
                type="button"
                onClick={addNewItem}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
              >
                + Add Item
              </button>
            </div>

            {invoiceItems.length === 0 ? (
              <div className="p-4 border rounded bg-gray-50 text-sm text-gray-500 italic">
                No items found.
              </div>
            ) : (
              <div className="space-y-4">
                {invoiceItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-gray-50 p-4 rounded border relative"
                  >
                    <div className="col-span-2">
                      <label className="text-sm text-gray-600">
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        className="w-full mt-1 p-2 rounded border"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full mt-1 p-2 rounded border"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">
                        Unit Price
                      </label>
                      <input
                        type="number"
                        value={item.unit_price}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "unit_price",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full mt-1 p-2 rounded border"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "discount",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full mt-1 p-2 rounded border"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">VAT (%)</label>
                      <input
                        type="number"
                        value={item.vat}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "vat",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full mt-1 p-2 rounded border"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="absolute bottom-2 left-2  text-red-600 rounded-full  flex items-center justify-center hover:underline  p-2"
                      title="Remove Item"
                    >
                      Remove Item
                    </button>
                    <div className="md:col-span-6 text-right text-sm text-gray-500 mt-1">
                      Total:{" "}
                      <strong>{item.total_price?.toFixed(2) || "0.00"}</strong>{" "}
                      | VAT/unit:{" "}
                      <strong>{item.vat_per_unit?.toFixed(2) || "0.00"}</strong>{" "}
                      | Total + VAT:{" "}
                      <strong>
                        {item.total_amount_with_vat?.toFixed(2) || "0.00"}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-blue-200">
            <button
              type="button"
              onClick={cancel}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceEditModal;
