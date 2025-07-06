import React, { useEffect, useState } from "react";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { FaArrowRotateLeft } from "react-icons/fa6";
import CreatePurchaseModel from "../components/CreatePurchaseModel";
import EditPurchaseModel from "../components/EditPurchaseModel";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [deletedPurchases, setDeletedPurchases] = useState([]);
  const [statusFilter, setStatusFilter] = useState("active");
  const [openPurchaseModel, setOpenPurchaseModel] = useState(false);
  const [openEditModel, setOpenEditModel] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState({});
  const fetchPurchases = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getAllPurchases,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        const allPurchases = responseData.data;
        const activePurchases = allPurchases.filter((p) => p.is_deleted === 0);
        const inactivePurchases = allPurchases.filter(
          (p) => p.is_deleted === 1
        );

        setPurchases(activePurchases);
        setDeletedPurchases(inactivePurchases);
        toast.success(responseData.message);
      }
    } catch (err) {
      toast.error("Error fetching purchases");
    }
  };

  const deletePurchase = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.deletePurchase,
        url: `${SummaryApi.deletePurchase.url}/${id}`,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchPurchases();
      } else {
        toast.error(responseData.message);
      }
    } catch (err) {
      toast.error("Error deleting purchase");
    }
  };

  const recoverPurchase = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.recoverPurchase,
        url: `${SummaryApi.recoverPurchase.url}/${id}`,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchPurchases();
      } else {
        toast.error(responseData.message);
      }
    } catch (err) {
      toast.error("Error recovering purchase");
    }
  };

  const createPurchase = async (data) => {
    try {
      const response = await Axios({
        ...SummaryApi.createPurchase,
        data,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success("Purchase created successfully!");
        fetchPurchases();
      } else {
        toast.error("Failed to create purchase.");
      }
    } catch (err) {
      toast.error("Error creating purchase.");
    }
  };

  const handleUpdatePurchase = async (updatedData) => {
    console.log("updateData: ", updatedData);
    const response = await Axios({
      ...SummaryApi.editPurchase,
      url: `${SummaryApi.editPurchase.url}/${updatedData.id}`,
      data: updatedData,
    });

    const { data: responseData } = response;
    if (responseData.success) {
      toast.success(responseData.message);
    } else {
      toast.error(responseData.message);
    }
    fetchPurchases();
  };
  const filteredPurchase =
    statusFilter === "active"
      ? purchases
      : statusFilter === "deleted"
      ? deletedPurchases
      : [...purchases, ...deletedPurchases];

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-extrabold text-yellow-900">
          🧾 Purchases
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select
            className="border border-yellow-300 bg-white px-4 py-2 rounded-md shadow-sm text-yellow-900 font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all w-full sm:w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="deleted">Deleted</option>
          </select>

          <button
            onClick={() => setOpenPurchaseModel(true)}
            className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-md shadow-md transition duration-200 w-full sm:w-auto"
          >
            <MdAdd className="text-xl" />
            Add Purchase
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-yellow-200 text-yellow-900 text-center">
            <tr>
              <th className="py-1 px-2">#</th>
              <th className="py-1 px-2">Purchase No</th>
              <th className="py-1 px-2">Supplier</th>
              <th className="py-1 px-2">Date</th>
              <th className="py-1 px-2">Items</th>
              <th className="py-1 px-2">Total</th>
              <th className="py-1 px-2">Paid</th>
              <th className="py-1 px-2">Balance</th>
              <th className="py-1 px-2">Status</th>
              <th className="py-1 px-2">Remarks</th>
              <th className="py-1 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchase.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-6 text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              filteredPurchase.map((p, index) => (
                <tr
                  key={p.id}
                  className="border-t border-yellow-100 hover:bg-yellow-50"
                >
                  <td className="py-1 px-2">{index + 1}</td>
                  <td className="py-1 px-2">{p.purchase_no}</td>
                  <td className="py-1 px-2">{p.supplier_name}</td>
                  <td className="py-1 px-2">{p.purchase_date}</td>
                  <td className="py-1 px-2">{p.description}</td>
                  <td className="py-1 px-2">AED {p.total_amount}</td>
                  <td className="py-1 px-2">AED {p.paid_amount}</td>
                  <td className="py-1 px-2">AED {p.balance}</td>
                  <td className="py-1 px-2">{p.payment_status}</td>
                  <td className="py-1 px-2">{p.remarks}</td>

                  <td className="py-1 px-2">
                    {p.is_deleted === 0 ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => (
                            setOpenEditModel(true), setSelectedPurchase(p)
                          )}
                          className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => deletePurchase(p.id)}
                          className="p-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => recoverPurchase(p.id)}
                        className="p-2 rounded-md bg-gray-400 hover:bg-green-500 hover:scale-105 text-white"
                      >
                        <FaArrowRotateLeft />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal outside of <table> */}
      {openPurchaseModel && (
        <CreatePurchaseModel
          setNewPurchase={(data) => {
            createPurchase(data);
          }}
          close={() => setOpenPurchaseModel(false)}
        />
      )}
      {openEditModel && (
        <EditPurchaseModel
          close={() => setOpenEditModel(false)}
          initialData={selectedPurchase}
          onUpdate={(updatedData) => handleUpdatePurchase(updatedData)}
        />
      )}
    </div>
  );
};

export default Purchases;
