import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdClose, MdDelete, MdAdd } from "react-icons/md";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const QuotationEditModel = ({ close, cancel, quotation }) => {
  const [projectName, setProjectName] = useState(quotation.project_name || "");
  const [quotationID, setQuotationID] = useState(quotation.id);
  const [deletedItemIds, setDeletedItemIds] = useState([]);
  const [items, setItems] = useState([]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const totalQuotationItems = items.length;
  const fetchQuotationItems = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getItemsOfQuotaion,
        url: `${SummaryApi.getItemsOfQuotaion.url}/${quotationID}`,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        setItems(responseData.data);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        description: "",
        size: "",
        quantity: 1,
        unit_price: 0,
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    const itemToRemove = items[index];
    if (itemToRemove.id) {
      // Track for deletion
      setDeletedItemIds((prev) => [...prev, itemToRemove.id]);
    }

    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (items.length === 0) {
        // 🔴 All items removed — delete the whole quotation
        const response = await Axios({
          ...SummaryApi.deleteQuotation,
          url: `${SummaryApi.deleteQuotation.url}/${quotationID}`,
        });

        const { data } = response;

        if (data.success) {
          toast.success("All items removed. Quotation deleted.");
          close();
        } else {
          toast.error(data.message || "Failed to delete quotation.");
        }

        return; // Exit early
      }

      // ✅ Otherwise: update normally
      const payload = {
        project_name: projectName,
        quotation_items: items,
        deleted_item_ids: deletedItemIds,
      };

      const response = await Axios({
        ...SummaryApi.updateQuotation,
        url: `${SummaryApi.updateQuotation.url}/${quotationID}`,
        data: payload,
      });

      const { data } = response;

      if (data.success) {
        toast.success(data.message || "Quotation updated successfully.");
        close();
      } else {
        toast.error(data.message || "Failed to update quotation.");
      }
    } catch (error) {
      toast.error("Something went wrong during update.");
      console.error("Update Error:", error);
    }
  };

  const calculateTotalPrice = () => {
    return items.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unit_price) || 0;
      return total + quantity * price;
    }, 0);
  };
  useEffect(() => {
    fetchQuotationItems();
  }, []);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl space-y-4 relative shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start">
          <h1 className="font-semibold text-lg">Edit Quotation</h1>
          <button
            onClick={close}
            className="text-gray-600 hover:text-black text-xl"
          >
            <MdClose size={25} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Project Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 px-3 py-2 rounded"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-md">
              Quotation Items {totalQuotationItems}
            </h2>
            {items.map((item, index) => (
              <div
                key={index}
                className={`border rounded p-4 space-y-2 relative ${
                  !item.id && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded absolute top-2 left-2">
                      New
                    </span>
                  )
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <MdDelete />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm">Description</label>
                    <input
                      type="text"
                      className="w-full border px-2 py-1 rounded"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Size</label>
                    <input
                      type="text"
                      className="w-full border px-2 py-1 rounded"
                      value={item.size}
                      onChange={(e) =>
                        handleItemChange(index, "size", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Quantity</label>
                    <input
                      type="number"
                      className="w-full border px-2 py-1 rounded"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      min={1}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Unit Price</label>
                    <input
                      type="number"
                      className="w-full border px-2 py-1 rounded"
                      value={item.unit_price}
                      onChange={(e) =>
                        handleItemChange(index, "unit_price", e.target.value)
                      }
                      min={0}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-2 text-blue-600 hover:underline"
            >
              <MdAdd /> Add Item
            </button>
          </div>
          <div className="text-right font-semibold text-lg">
            Total: AED {calculateTotalPrice().toFixed(2)}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={cancel}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuotationEditModel;
