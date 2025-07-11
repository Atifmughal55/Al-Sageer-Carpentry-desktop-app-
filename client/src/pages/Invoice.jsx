import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const generateInvoiceNo = () => `SC${Math.floor(1000 + Math.random() * 9000)}`;
const generateTRN = () =>
  Math.floor(1000000000000 + Math.random() * 9000000000000);

const Invoice = () => {
  const [customerData, setCustomerData] = useState({});
  const [invoiceNo] = useState(generateInvoiceNo());
  const [trn] = useState(generateTRN());
  const [customerName, setCustomerName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [quotationID, setQuotationID] = useState("");
  const [vatPer, setVatPer] = useState(5); // Default VAT is 5%
  const [items, setItems] = useState([
    { description: "", quantity: 1, unitPrice: 0, vat: 5, discount: 0 },
  ]);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const navigate = useNavigate();
  const { quotation_no } = useParams();

  useEffect(() => {
    if (quotation_no) fetchQuotationData();
  }, []);

  useEffect(() => {
    if (quotationID) getQuotationItems();
  }, [quotationID]);

  const fetchQuotationData = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.searchQuotation,
        url: `${SummaryApi.searchQuotation.url}/${quotation_no}`,
      });
      const res = response.data;
      if (res.error) return toast.error(res.message);
      setCustomerData(res?.data?.customer);
      setCustomerName(res?.data?.customer?.name);
      setProjectName(res.data?.project_name);
      setQuotationID(res?.data?.id);
    } catch {
      toast.error("Failed to fetch quotation data");
    }
  };

  const getQuotationItems = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getItemsOfQuotaion,
        url: `${SummaryApi.getItemsOfQuotaion.url}/${quotationID}`,
      });
      const res = response.data;
      if (res.success) {
        const fetchedItems = res.data.map((item) => ({
          description: item.description || "",
          quantity: item.quantity || 1,
          unitPrice: item.unit_price || 0,
          discount: item.discount || 0,
          vat: vatPer,
        }));
        setItems(fetchedItems);
      } else {
        toast.error("Failed to get quotation items");
      }
    } catch {
      toast.error("Failed to fetch quotation items");
    }
  };

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
      { description: "", quantity: 1, unitPrice: 0, vat: vatPer, discount: 0 },
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
    const vatRate = item.vat / 100;
    const vatAmount = netAmount * vatRate;
    const total = netAmount + vatAmount;
    return { baseAmount, discountAmount, netAmount, vatAmount, total };
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

  const handleVatChange = (value) => {
    const newVat = Number(value);
    setVatPer(newVat);
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        vat: newVat,
      }))
    );
  };

  const handleCreateInvoice = async () => {
    const data = {
      customer: {
        id: customerData.id,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        name: customerName,
      },
      invoice: {
        invoiceNo,
        trn,
        date: new Date().toLocaleDateString(),
        projectName,
        quotationNo: quotation_no,
        receivedAmount,
        vatPercentage: vatPer,
        totalAmount: totals.total,
        remainingBalance: balance,
      },
      invoiceItems: items.map((item) => {
        const { vatAmount, total } = getItemCalculations(item);
        return {
          invoice_id: invoiceNo,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          vat: item.vat,
          vatAmount,
          total,
        };
      }),
    };

    try {
      const response = await Axios.post(SummaryApi.createInvoice.url, data);

      toast.success("Invoice created successfully!");

      const createdInvoice = response.data?.data;

      // Clear all state values
      setCustomerName("");
      setProjectName("");
      setQuotationID("");
      setVatPer(5);
      setItems([
        { description: "", quantity: 1, unitPrice: 0, vat: 5, discount: 0 },
      ]);
      setReceivedAmount(0);

      // Navigate to print page with invoice details
      navigate(
        `/dashboard/invoice-print/${createdInvoice?.invoice?.invoice_no}`,
        {
          state: {
            ...data.invoice,
            customerName: data.customer.name,
            items: data.invoiceItems,
            totals,
            balance,
            receivedAmount,
          },
        }
      );
    } catch (error) {
      console.error("Invoice creation failed:", error);
      toast.error("Failed to create invoice");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Invoice</h1>

      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-sm text-gray-700">
        <div>
          <strong>Invoice No:</strong> {invoiceNo}
        </div>
        <div>
          <strong>TRN:</strong> {trn}
        </div>
        <div>
          <strong>Quotation No:</strong> {quotation_no}
        </div>
        <div>
          <strong>Date:</strong> {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Customer & Project */}
      {/* Customer & Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block mb-1 text-sm font-medium">
            Customer Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              setCustomerData((prev) => ({ ...prev, name: e.target.value }));
            }}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">
            Customer Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-md"
            value={customerData.email || ""}
            onChange={(e) =>
              setCustomerData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">
            Customer Phone
          </label>
          <input
            type="tel"
            className="w-full px-4 py-2 border rounded-md"
            value={customerData.phone || ""}
            onChange={(e) =>
              setCustomerData((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">
            Customer Address
          </label>
          <textarea
            className="w-full px-4 py-2 border rounded-md"
            value={customerData.address || ""}
            onChange={(e) =>
              setCustomerData((prev) => ({ ...prev, address: e.target.value }))
            }
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium">Project Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
      </div>

      {/* Global VAT Field */}
      <div className="mb-6 text-right">
        <label className="block mb-1 text-sm font-medium text-right">
          VAT (%)
        </label>
        <input
          type="number"
          min="0"
          className="w-48 px-4 py-2 border rounded-md"
          value={vatPer}
          onChange={(e) => handleVatChange(e.target.value)}
        />
      </div>

      {/* Items List */}
      <div className="space-y-6">
        {items.map((item, index) => {
          const calc = getItemCalculations(item);
          return (
            <div key={index} className="border p-4 rounded-md bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-start">
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-md"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-4 py-2 border rounded-md"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-4 py-2 border rounded-md"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, "unitPrice", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border rounded-md"
                    value={item.discount}
                    onChange={(e) =>
                      handleItemChange(index, "discount", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    VAT (AED)
                  </label>
                  <div className="px-4 py-2 border rounded-md bg-gray-100 text-sm font-semibold">
                    {calc.vatAmount.toFixed(2)} AED
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Total (AED)
                  </label>
                  <div className="px-4 py-2 border rounded-md bg-gray-100 text-sm font-semibold">
                    {calc.total.toFixed(2)} AED
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
        Add Item
      </button>

      {/* Totals */}
      <div className="mt-6 text-right space-y-1 text-sm">
        <div>Total Amount: {totals.base.toFixed(2)} AED</div>
        <div>Discount: {totals.discount.toFixed(2)} AED</div>
        <div>
          VAT ({vatPer}%): {totals.vat.toFixed(2)} AED
        </div>
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

      {/* {items.length > 0 && ( */}
      <button
        onClick={handleCreateInvoice}
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded-md"
      >
        Generate Invoice
      </button>
      {/* )} */}
    </div>
  );
};

export default Invoice;
