import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { BsPrinterFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import { useEffect } from "react";
import QuotationEditModel from "../components/QuotationEditModel";
import { useDispatch } from "react-redux";
import { setQuotation, setQuotationItems } from "../reducer/quotationSlice";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useRef } from "react";

const Quotations = () => {
  const [allQuotations, setAllQuotation] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState({});
  const [openEditQuotation, setOpenEditQuotation] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // You can make this dynamic too
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuotations, setTotalQuotations] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const searchTimeout = useRef(null);
  // Fetch all quotations
  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.getAllQuotations,
        url: `${SummaryApi.getAllQuotations.url}?page=${page}&limit=${limit}`,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        setAllQuotation(responseData.data);
        setTotalPages(responseData.page);
        setTotalQuotations(responseData.total_quotations);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  // Delete a quotation
  const deleteQuotation = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteQuotation,
        url: `${SummaryApi.deleteQuotation.url}/${id}`,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchQuotations();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Handle status change
  const handleChange = async (e, quotationId) => {
    const newStatus = e.target.value;

    try {
      const response = await Axios({
        ...SummaryApi.updateStatus,
        url: `${SummaryApi.updateStatus.url}/${quotationId}/status`,
        data: { status: newStatus },
      });

      if (response.data.success) {
        toast.success("Status updated successfully");

        // Update the status of the quotation in the local state
        setAllQuotation((prev) =>
          prev.map((q) =>
            q.id === quotationId ? { ...q, status: newStatus } : q
          )
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  // Handle click to view quotation items
  const handleClick = async (q) => {
    try {
      const response = await Axios({
        ...SummaryApi.getItemsOfQuotaion,
        url: `${SummaryApi.getItemsOfQuotaion.url}/${q.id}`,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        dispatch(setQuotationItems(responseData.data));
        dispatch(setQuotation(q));
        navigate(`/dashboard/quotation-print/${q.quotation_no}`);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Handle search functionality
  const handleSearch = async (quotationNo) => {
    console.log("Searching for quotation with number:", quotationNo);
    try {
      const response = await Axios({
        ...SummaryApi.searchQuotation,
        url: `${SummaryApi.searchQuotation.url}/${quotationNo}`,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        setAllQuotation([responseData.data]); // Assuming data is a single quotation object
        setTotalPages(1); // Reset to 1 since we are showing only one result
        setTotalQuotations(1); // Set total quotations to 1
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error("Something went wrong while searching");
    }
  };

  const exportToExcel = () => {
    const exportData = allQuotations.map((q, index) => ({
      "#": index + 1,
      "Customer Name": q.customer?.name || "",
      "Customer Contact": q.customer?.phone || "",
      "Project Name": q.project_name,
      "Quotation No": q.quotation_no,
      Status: q.status,
      Validity: new Date(q.valid_until).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quotations");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `quotations_${Date.now()}.xlsx`);
  };
  useEffect(() => {
    fetchQuotations();
  }, [page]);
  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold text-yellow-800">Quotations</h2>
        <div className="flex gap-4 ">
          <select
            className="border px-3 py-2 rounded-md"
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") return fetchQuotations();
              const filtered = allQuotations.filter((q) => q.status === value);
              setAllQuotation(filtered);
            }}
          >
            <option value="">Filter by Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="sent">Sent</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className="border px-3 py-2 rounded-md"
            onChange={(e) => {
              const value = e.target.value;
              let sorted = [...allQuotations];
              if (value === "asc") {
                sorted.sort(
                  (a, b) => new Date(a.valid_until) - new Date(b.valid_until)
                );
              } else if (value === "desc") {
                sorted.sort(
                  (a, b) => new Date(b.valid_until) - new Date(a.valid_until)
                );
              }
              setAllQuotation(sorted);
            }}
          >
            <option value="">Sort by Validity</option>
            <option value="asc">Earliest First</option>
            <option value="desc">Latest First</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          {/* Search Input */}
          <input
            type="text"
            onChange={(e) => {
              const value = e.target.value;
              if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
              }

              searchTimeout.current = setTimeout(() => {
                const trimmedValue = value.trim();
                if (trimmedValue === "") {
                  fetchQuotations();
                } else {
                  handleSearch(trimmedValue);
                }
              }, 1000);
            }}
            placeholder="Search here..."
            className="px-4 py-2 rounded-md border border-yellow-300 bg-white text-yellow-900 placeholder-yellow-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500"
          />

          {/* Add Button */}
          <Link
            to={"/dashboard/create-quotation"}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-md shadow transition duration-200"
          >
            <MdAdd className="text-xl" />
            Add Quotation
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-yellow-200 text-yellow-900 text-sm font-semibold">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Customer Name</th>
              <th className="py-3 px-4 text-left">Customer Contact</th>
              <th className="py-3 px-4 text-left">Project Name</th>
              <th className="py-3 px-4 text-left">Quotation No</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Validity</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {loading ? (
              [...Array(5)].map((_, idx) => (
                <tr key={idx} className="animate-pulse bg-yellow-50">
                  <td colSpan={8} className="py-3 px-4">
                    <div className="h-4 bg-yellow-200 rounded w-3/4 mb-2"></div>
                  </td>
                </tr>
              ))
            ) : allQuotations.length > 0 ? (
              allQuotations.map((q, index) => {
                return (
                  <tr
                    key={q.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-yellow-50"
                    } border-b border-yellow-200 transition duration-200 hover:bg-yellow-100`}
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{q.customer?.name}</td>
                    <td className="py-3 px-4">{q.customer?.phone}</td>
                    <td className="py-3 px-4">{q.project_name}</td>
                    <td className="py-3 px-4">{q.quotation_no}</td>
                    <td className="py-3 px-4">
                      <select
                        className="border p-2 rounded-md"
                        value={q.status} // Use q.status instead of global state
                        onChange={(e) => handleChange(e, q.id)}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="sent">Sent</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(q.valid_until) < new Date()
                        ? "Expired"
                        : new Date(q.valid_until).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          title="Edit"
                          disabled={
                            q.status === "approved" || q.status === "rejected"
                          }
                          onClick={() => {
                            setOpenEditQuotation(true);
                            setSelectedQuotation(q);
                          }}
                          className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition"
                        >
                          <MdEdit />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => deleteQuotation(q.id)}
                          className="p-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition"
                        >
                          <MdDelete />
                        </button>
                        <button
                          className="p-2 rounded-md bg-green-500 hover:bg-green-600 text-white transition"
                          onClick={() => handleClick(q)}
                        >
                          <BsPrinterFill />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-6 text-yellow-900 font-semibold bg-yellow-50"
                >
                  No quotations available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {openEditQuotation && (
        <QuotationEditModel
          quotation={selectedQuotation}
          close={() => setOpenEditQuotation(false)}
          cancel={() => setOpenEditQuotation(false)}
        />
      )}

      <button
        onClick={exportToExcel}
        className="flex items-center gap-2 mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md shadow transition duration-200"
      >
        Export Excel
      </button>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6 ">
        <div className="text-sm text-gray-600">
          Page <span className="font-semibold text-yellow-700">{page}</span> of{" "}
          <span className="font-semibold text-yellow-700">{totalPages}</span> —{" "}
          <span className="text-gray-700">{totalQuotations} Quotations</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page <= 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full border transition 
        ${
          page <= 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-yellow-500 text-white hover:bg-yellow-600"
        }`}
          >
            <MdChevronLeft className="text-xl" />
          </button>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page >= totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-full border transition 
        ${
          page >= totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-yellow-500 text-white hover:bg-yellow-600"
        }`}
          >
            <MdChevronRight className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quotations;
