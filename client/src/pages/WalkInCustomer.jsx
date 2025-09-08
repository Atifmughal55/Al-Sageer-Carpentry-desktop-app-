import React, { useEffect, useState } from "react";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import WalkInFormModal from "../components/WalkInFormModal";
import WalkInViewModal from "../components/WalkInViewModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const WalkInCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ type: "", data: null }); // central modal state
  const navigate = useNavigate();

  // ✅ Fetch walk-in customers
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await Axios(SummaryApi.getAllWalkInCustomers);
      if (data.success) setCustomers(data.data);
      else toast.error(data.message);
    } catch {
      toast.error("Failed to fetch walk-in customers");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete
  const deleteCustomer = async (id) => {
    try {
      const { data } = await Axios({
        ...SummaryApi.deleteWalkInCustomer,
        url: `${SummaryApi.deleteWalkInCustomer.url}/${id}`,
      });
      if (data.success) {
        toast.success("Deleted successfully");
        fetchCustomers();
      } else toast.error(data.message);
    } catch {
      toast.error("Something went wrong");
    }
  };

  // ✅ Create / Update
  const handleSubmit = async (formData, id) => {
    try {
      const apiConfig = id
        ? {
            ...SummaryApi.updateWalkInCustomer,
            url: `${SummaryApi.updateWalkInCustomer.url}/${id}`,
            data: formData,
          }
        : {
            ...SummaryApi.createWalkInCustomer,
            data: formData,
          };

      const { data } = await Axios(apiConfig);
      if (data.success) {
        toast.success(id ? "Updated successfully" : "Created successfully");
        fetchCustomers();
        setModal({ type: "", data: null });
      } else toast.error(data.message);
    } catch {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-yellow-800">
          Walk-in Customers
        </h2>
        <button
          onClick={() => setModal({ type: "create", data: null })}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-md shadow transition"
        >
          <MdAdd className="text-xl" />
          New Walk-in Invoice
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-yellow-200 text-yellow-900 text-sm font-semibold">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Discount</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">After discount</th>
              <th className="py-3 px-4">Received</th>
              <th className="py-3 px-4">Remaining</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : customers.length > 0 ? (
              customers.map((c, i) => (
                <tr
                  key={c.id}
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-yellow-50"
                  } border-b`}
                >
                  <td className="py-3 px-4">{i + 1}</td>
                  <td className="py-3 px-4">{c.name}</td>
                  <td className="py-3 px-4">{c.phone || "-"}</td>
                  <td className="py-3 px-4">{c.discount?.toFixed(2)}</td>
                  <td className="py-3 px-4">{c.grand_total?.toFixed(2)}</td>
                  <td className="py-3 px-4">{c.after_discount?.toFixed(2)}</td>
                  <td className="py-3 px-4">{c.received?.toFixed(2)}</td>
                  <td className="py-3 px-4">{c.balance?.toFixed(2)}</td>
                  <td className="py-3 px-4 capitalize">{c.status}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => setModal({ type: "view", data: c })}
                      className="p-2 rounded-md bg-green-500 hover:bg-green-600 text-white"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => setModal({ type: "edit", data: c })}
                      className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => setModal({ type: "delete", data: c })}
                      className="p-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-6">
                  No walk-in customers available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ All Modals in One Place */}
      {modal.type === "create" && (
        <WalkInFormModal
          open
          onClose={() => setModal({ type: "", data: null })}
          onSubmit={(formData) => handleSubmit(formData)}
        />
      )}
      {modal.type === "edit" && (
        <WalkInFormModal
          open
          initialData={modal.data}
          onClose={() => setModal({ type: "", data: null })}
          onSubmit={(formData) => handleSubmit(formData, modal.data.id)}
        />
      )}
      {modal.type === "view" && (
        <WalkInViewModal
          open
          data={modal.data}
          onClose={() => setModal({ type: "", data: null })}
        />
      )}
      {modal.type === "delete" && (
        <ConfirmDeleteModal
          open
          onClose={() => setModal({ type: "", data: null })}
          onConfirm={() => deleteCustomer(modal.data.id)}
        />
      )}
    </div>
  );
};

export default WalkInCustomer;
