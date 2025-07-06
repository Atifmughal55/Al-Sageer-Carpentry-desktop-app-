import React, { useEffect, useState } from "react";

import { MdClose } from "react-icons/md";

const CustomerEditModel = ({ customer, cancel, onSave }) => {
  const [formData, setFormData] = useState({
    name: customer.name || "",
    email: customer.email || "",
    phone: customer.phone || "",
    address: customer.address || "",
  });

  const [isChanged, setIsChanged] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave(formData);
  };

  useEffect(() => {
    // Check if form data has changed compared to original customer
    const changed =
      formData.name !== customer.name ||
      formData.email !== customer.email ||
      formData.phone !== customer.phone ||
      formData.address !== customer.address;

    setIsChanged(changed);
  }, [formData, customer]);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 relative shadow-xl">
        {/* Close button */}
        <button
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
          onClick={cancel}
        >
          <MdClose size={25} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Customer</h2>

        <form
          onSubmit={(e) => handleSubmit(e, customer.id)}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows="3"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={cancel}
              className={`px-4 py-2 rounded text-white bg-green-400 hover:bg-green-500 transition`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isChanged}
              className={`px-4 py-2 rounded text-white ${
                isChanged
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerEditModel;
