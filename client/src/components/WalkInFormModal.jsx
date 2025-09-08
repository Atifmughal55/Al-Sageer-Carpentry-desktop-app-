import React, { useState, useEffect } from "react";
import { MdClose, MdDelete, MdAdd } from "react-icons/md";

const WalkInFormModal = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: "Walk-In",
    phone: "+97123456789",
    discount: 0,
    received: 0,
    items: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    // Auto calculate totalPrice
    const qty = Number(updatedItems[index].quantity) || 0;
    const price = Number(updatedItems[index].unitPrice) || 0;
    updatedItems[index].totalPrice = qty * price;

    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: 1, unitPrice: 0, totalPrice: 0 },
      ],
    }));
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const calculateSubtotal = () => {
    return formData.items.reduce(
      (sum, item) => sum + (Number(item.totalPrice) || 0),
      0
    );
  };

  const afterDiscount = calculateSubtotal() - Number(formData.discount || 0);
  const balance = afterDiscount - Number(formData.received || 0);

  const handleSubmit = () => {
    const payload = {
      ...formData,
      grand_total: calculateSubtotal(),
      after_discount: afterDiscount,
      balance,
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[700px] max-w-[95%] p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
        >
          <MdClose size={25} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800 mb-5 text-center border-b pb-3">
          {initialData ? "Edit Walk-in Customer" : "New Walk-in Customer"}
        </h2>

        {/* Customer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter customer name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount
            </label>
            <input
              type="number"
              name="discount"
              placeholder="Enter discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Received
            </label>
            <input
              type="number"
              name="received"
              placeholder="Enter received amount"
              value={formData.received}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        {/* Items Table */}
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Items</h3>
        <div className="overflow-x-auto max-h-[250px] overflow-y-auto border rounded-lg">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-center">Qty</th>
                <th className="px-3 py-2 text-center">Unit Price</th>
                <th className="px-3 py-2 text-center">Total</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.length > 0 ? (
                formData.items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        className="w-full border rounded p-1"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        className="w-16 border rounded p-1 text-center"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(index, "unitPrice", e.target.value)
                        }
                        className="w-20 border rounded p-1 text-center"
                      />
                    </td>
                    <td className="px-3 py-2 text-center font-medium">
                      {item.totalPrice}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <MdDelete size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No items added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Item Button */}
        <div className="mt-3 flex justify-end">
          <button
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            <MdAdd size={18} /> Add Item
          </button>
        </div>

        {/* Summary */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-end">
            <div className="w-full sm:w-1/2 md:w-1/3">
              <div className="flex justify-between text-sm py-1">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{calculateSubtotal()}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium">{formData.discount}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-gray-600">After Discount:</span>
                <span className="font-medium">{afterDiscount}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-gray-600">Received:</span>
                <span className="font-medium">{formData.received}</span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-gray-600">Balance:</span>
                <span
                  className={`font-semibold ${
                    balance > 0 ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {balance}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition"
          >
            {initialData ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalkInFormModal;
