import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { FaPlus, FaTrash, FaSave, FaCheck } from "react-icons/fa";

const CreateQuotation = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    quotation: {
      project_name: "",
    },
    items: [{ description: "", size: "", quantity: 1, unit_price: 0 }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, key] = name.split(".");
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] = ["quantity", "unit_price"].includes(field)
      ? Number(value)
      : value;
    setFormData((prev) => ({ ...prev, items: updated }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", size: "", quantity: 1, unit_price: 0 },
      ],
    }));
  };

  const removeItem = (index) => {
    const updated = [...formData.items];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, items: updated }));
  };

  const handleSubmit = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.createQuotation,
        data: formData,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/dashboard/quotations");
      }
    } catch (err) {
      toast.error("Failed to create quotation");
    }
  };

  const totalQuantity = formData.items.reduce(
    (acc, item) => acc + Number(item.quantity),
    0
  );
  const totalAmount = formData.items.reduce(
    (acc, item) => acc + item.quantity * item.unit_price,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
        🧾 Create Quotation
      </h1>

      {/* Customer Info */}
      <div className="bg-white shadow rounded-lg p-6 mb-6 border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Customer Info
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {["name", "email", "phone", "address"].map((field) => (
            <div key={field}>
              <label className="block text-sm text-gray-600 capitalize mb-1">
                {field}
              </label>
              <input
                type="text"
                name={`customer.${field}`}
                value={formData.customer[field]}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${field}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white shadow rounded-lg p-6 mb-6 border">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Project Info
        </h2>
        <input
          type="text"
          name="quotation.project_name"
          value={formData.quotation.project_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter project name"
        />
      </div>

      {/* Items */}
      <div className="bg-white shadow rounded-lg p-6 mb-6 border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Quotation Items
          </h2>
          <button
            onClick={addItem}
            className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 flex items-center"
          >
            <FaPlus className="mr-2" /> Add Item
          </button>
        </div>

        {formData.items.map((item, index) => (
          <div
            key={index}
            className="grid md:grid-cols-4 gap-4 items-center mb-4 relative border p-4 rounded-md bg-gray-50"
          >
            <textarea
              className="col-span-2 px-3 py-2 border rounded-md resize-none"
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleItemChange(index, "description", e.target.value)
              }
            />
            <input
              type="text"
              className="px-3 py-2 border rounded-md"
              placeholder="Size"
              value={item.size}
              onChange={(e) => handleItemChange(index, "size", e.target.value)}
            />
            <input
              type="number"
              className="px-3 py-2 border rounded-md"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
            />
            <input
              type="number"
              className="px-3 py-2 border rounded-md"
              placeholder="Unit Price"
              value={item.unit_price}
              onChange={(e) =>
                handleItemChange(index, "unit_price", e.target.value)
              }
            />
            {formData.items.length > 1 && (
              <button
                onClick={() => removeItem(index)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                title="Remove item"
              >
                <FaTrash />
              </button>
            )}
          </div>
        ))}
      </div>
      {/* Totals Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6 border max-w-md ml-auto">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Summary</h3>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Total Quantity:</span>
          <span className="font-semibold">{totalQuantity}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Total Amount:</span>
          <span className="font-semibold">{totalAmount.toFixed(2)} AED</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleSubmit}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md shadow"
        >
          <FaCheck className="mr-2" />
          Submit Quotation
        </button>
      </div>
    </div>
  );
};

export default CreateQuotation;
