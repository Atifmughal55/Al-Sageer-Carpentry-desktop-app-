import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";

const CreatePurchaseModal = ({ close, setNewPurchase }) => {
  const [formData, setFormData] = useState({
    purchase_no: "",
    supplier_name: "",
    description: "",
    total_amount: "",
    paid_amount: "",
    payment_status: "Unpaid",
    remarks: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const generatedPurchaseNo = `P-${Math.floor(1000 + Math.random() * 9000)}`;

    setFormData((prev) => ({
      ...prev,
      purchase_no: generatedPurchaseNo,
    }));
  }, []);

  useEffect(() => {
    const total = parseFloat(formData.total_amount) || 0;
    const paid = parseFloat(formData.paid_amount) || 0;
    const balance = total - paid;

    let status = "Unpaid";
    if (balance <= 0 && total !== 0) status = "Paid";
    else if (balance > 0 && paid > 0) status = "Partial";

    setFormData((prev) => ({
      ...prev,
      payment_status: status,
    }));
  }, [formData.total_amount, formData.paid_amount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear error if user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.supplier_name.trim())
      newErrors.supplier_name = "Supplier name is required.";
    if (!formData.total_amount)
      newErrors.total_amount = "Total amount is required.";
    if (!formData.paid_amount && formData.paid_amount !== 0)
      newErrors.paid_amount = "Paid amount is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.remarks) newErrors.remarks = "Remark is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setNewPurchase(formData);
    close();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50 px-4">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Purchase</h2>
          <button onClick={close}>
            <MdClose size={28} className="text-gray-600 hover:text-black" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Purchase No
              </label>
              <input
                type="text"
                value={formData.purchase_no}
                disabled
                className="w-full border px-4 py-2 rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Supplier Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="supplier_name"
                value={formData.supplier_name}
                onChange={handleChange}
                className={`w-full border px-4 py-2 rounded ${
                  errors.supplier ? "border-red-500" : ""
                }`}
                placeholder="Enter supplier name"
              />
              {errors.supplier && (
                <p className="text-red-500 text-sm mt-1">{errors.supplier}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full border px-4 py-2 rounded ${
                  errors.description ? "border-red-500" : ""
                }`}
                placeholder="Enter description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="total_amount"
                value={formData.total_amount}
                onChange={handleChange}
                className={`w-full border px-4 py-2 rounded ${
                  errors.total_amount ? "border-red-500" : ""
                }`}
              />
              {errors.total_amount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.total_amount}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Paid Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="paid_amount"
                value={formData.paid_amount}
                onChange={handleChange}
                className={`w-full border px-4 py-2 rounded ${
                  errors.paid_amount ? "border-red-500" : ""
                }`}
              />
              {errors.paid_amount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.paid_amount}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Status
              </label>
              <input
                type="text"
                value={formData.payment_status}
                disabled
                className="w-full border px-4 py-2 rounded bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Remarks <span className="text-red-500">*</span>
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={3}
              placeholder="Any additional comments..."
              className="w-full border px-4 py-2 rounded"
            ></textarea>
            {errors.remarks && (
              <p className="text-red-500 text-sm mt-1">{errors.remarks}</p>
            )}
          </div>

          <div className="flex justify-end mt-4 gap-4">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePurchaseModal;
