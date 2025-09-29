import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  MdEdit,
  MdDelete,
  MdArrowLeft,
  MdChevronLeft,
  MdChevronRight,
  MdDeleteForever,
} from "react-icons/md";
import { Link } from "react-router-dom";
import Axios from "../utils/Axios.js";
import SummaryApi from "../common/SummaryApi.js";
import { FaArrowRotateLeft, FaEye } from "react-icons/fa6";
import InvoiceEditModel from "../components/InvoiceEditModel.jsx";
import ViewModel from "../components/ViewModel.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Sales = () => {
  const [loading, setLoading] = useState(false);

  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortByDate, setSortByDate] = useState("latest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [deletedInvoices, setDeletedInvoices] = useState([]);
  const [invoiceTypeFilter, setInvoiceTypeFilter] = useState("active"); // "active" | "deleted" | "all"
  const [openInvoiceEditModel, setOpenInvoiceEditModel] = useState(false);
  const [openViewModel, setOpenViewModel] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const fetchInvoiceData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getAllInvoice,
        url: `${SummaryApi.getAllInvoice.url}?page=${page}&limit=${limit}`,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        const allInvoices = responseData.data;

        const assignStatus = (invoice) => {
          if (invoice.received === 0) return { ...invoice, status: "Unpaid" };
          else if (invoice.remaining > 0)
            return { ...invoice, status: "Partial" };
          else return { ...invoice, status: "Paid" };
        };

        const processed = allInvoices.map(assignStatus);
        setSales(processed); // Only active invoices, 10 max per page
        setTotalInvoices(responseData?.pagination?.total);
      }
    } catch (error) {
      toast.error("No invoice found.");
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (query) => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.searchInvoice,
        url: `${SummaryApi.searchInvoice.url}?search=${query}`,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setSales([responseData.data]);
        toast.success(responseData.message);
      } else {
        toast.error("No records found.");
        setSales([]);
        setDeletedInvoices([]);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (invoiceId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteInvoice,
        url: `${SummaryApi.deleteInvoice.url}/${invoiceId}`,
      });

      const { data: responseData } = response;
      if (responseData.error) {
        toast.error(responseData.message);
        return;
      }
      toast.success(responseData.message);

      // ✅ Refetch current page again
      fetchInvoiceData();
    } catch (error) {
      toast.error("Failed to delete invoice");
    }
  };

  // Filtered and Sorted Sales
  const filteredSales = [
    ...(invoiceTypeFilter === "active"
      ? sales
      : invoiceTypeFilter === "deleted"
      ? deletedInvoices
      : [...sales, ...deletedInvoices]),
  ]
    .filter((sale) =>
      statusFilter === "All" ? true : sale.status === statusFilter
    )
    .sort((a, b) => {
      return sortByDate === "latest"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at);
    });

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1); // ✅ Reset to first page when searching
      if (search.trim() === "") {
        fetchInvoiceData();
      } else {
        performSearch(search);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    fetchInvoiceData();
  }, [page, limit]);

  const totalPages = Math.ceil(totalInvoices / limit);

  const recoverInvoice = async (invoiceId) => {
    try {
      const response = await Axios({
        ...SummaryApi.restoreInvoice,
        url: `${SummaryApi.restoreInvoice.url}/${invoiceId}`,
      });

      const { data: responseData } = response;
      if (responseData.error) {
        toast.error(responseData.message);
        return;
      }
      toast.success(responseData.message);
      fetchInvoiceData(); // Refresh the data after recovery
    } catch (error) {
      toast.error("Failed to recover invoice");
    }
  };

  const deleteInvoicePermanently = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.deletePermanently,
        url: `${SummaryApi.deletePermanently.url}/${id}`,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchInvoiceData();
      } else {
        toast.error(responseData.message);
        fetchInvoiceData();
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const exportToExcel = () => {
    const exportData =
      invoiceTypeFilter === "active"
        ? sales
        : invoiceTypeFilter === "deleted"
        ? deletedInvoices
        : [...sales, ...deletedInvoices];

    const excelData = exportData.map((inv) => ({
      "Invoice No": inv.invoice_no,
      "Customer Name": inv.customer?.name || "",
      Contact: inv.customer?.phone || "",
      "Total (AED)": inv.total_with_vat,
      "Paid (AED)": inv.received,
      "Pending (AED)": inv.remaining,
      Status: inv.status,
      Date: inv.created_at.split(" ")[0],
      Deleted: inv.is_deleted === 1 ? "Yes" : "No",
    }));

    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(excelData, {
      origin: "A3", // start writing from row 3 (leaving space for title)
    });

    // Add custom title in row 1
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["Al Sageer Carpentry - Sales Invoices"]],
      {
        origin: "A1",
      }
    );

    // Merge cells for title across 9 columns (A1 to I1)
    worksheet["!merges"] = [
      {
        s: { r: 0, c: 0 }, // start at row 0, col 0 (A1)
        e: { r: 0, c: 8 }, // end at row 0, col 8 (I1)
      },
    ];

    // Optional: Adjust column widths
    worksheet["!cols"] = [
      { wch: 12 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 10 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(
      data,
      `Sales-Invoices-${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold text-yellow-900">Sales Records</h2>
        <Link
          to={"/dashboard/invoice/0000"}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md shadow font-semibold"
        >
          + Add Invoice
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search invoice.  SC1234"
          className="border px-4 py-2 rounded-md w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded-md w-full md:w-1/4"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Invoices</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        <select
          className="border px-4 py-2 rounded-md w-full md:w-1/4"
          value={sortByDate}
          onChange={(e) => setSortByDate(e.target.value)}
        >
          <option value="latest">Date: Latest First</option>
          <option value="oldest">Date: Oldest First</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-yellow-200 text-yellow-900 text-center">
            <tr>
              <th className="py-2 px-2">#</th>
              <th className="py-2 px-2">Invoice No</th>
              <th className="py-2 px-2">Customer Name</th>
              <th className="py-2 px-2">Contact</th>
              <th className="py-2 px-2">Total</th>
              <th className="py-2 px-2">Received</th>
              <th className="py-2 px-2 ">Status</th>
              <th className="py-2 px-2">Date</th>
              <th className="py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredSales.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              filteredSales.map((sale, index) => {
                return (
                  <tr
                    key={sale.id}
                    className={`border-t border-yellow-100 hover:bg-yellow-50 transition-all duration-300 ${
                      sale.is_deleted
                        ? "opacity-60 blur-[0.5px] bg-red-50 text-red-800"
                        : ""
                    }`}
                  >
                    <td className="py-2 px-2">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="py-2 px-2">
                      {sale.invoice_no}
                      {sale.is_deleted === 1 && (
                        <span className="ml-2 inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                          Deleted
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2">{sale.customer?.name}</td>
                    <td className="py-2 px-2">{sale.customer?.phone}</td>
                    <td className="py-2 px-2">AED {sale.total_with_vat}</td>
                    <td className="py-2 px-2">AED {sale.received}</td>
                    <td className="py-2 px-2 font-semibold">
                      {sale.remaining < 0 ? (
                        <span className=" text-blue-600 font-bold">
                          Balance: {Math.abs(sale.remaining)}
                        </span>
                      ) : sale.remaining === 0 ? (
                        <span className="text-green-600 font-semibold">
                          Paid
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          Payable: {sale.remaining}
                        </span>
                      )}
                    </td>

                    <td className="py-2 px-2">
                      {sale.created_at.split(" ")[0]}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {!sale.is_deleted ? (
                          <>
                            <button
                              onClick={() => {
                                setOpenViewModel(true),
                                  setSelectedInvoice(sale);
                              }}
                              className="p-2 rounded-md bg-green-500 hover:bg-green-600 hover:scale-105 text-white"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => deleteInvoice(sale.id)}
                              className="p-2 rounded-md bg-red-500 hover:bg-red-600 hover:scale-105 text-white"
                            >
                              <MdDelete />
                            </button>
                            {/* Invoice Edit Modal */}
                          </>
                        ) : (
                          <>
                            <button
                              title="Recover"
                              onClick={() => recoverInvoice(sale.id)}
                              className="p-2 rounded-md bg-gray-400 hover:bg-green-500 hover:scale-105 text-white"
                            >
                              <FaArrowRotateLeft />
                            </button>
                            <button
                              title="Delete permanently"
                              onClick={() => {
                                setInvoiceToDelete(sale.id);
                                setShowConfirmModal(true);
                              }}
                              className="p-2 rounded-md bg-red-500 hover:bg-green-600 hover:scale-105 text-white"
                            >
                              <MdDeleteForever />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className="flex justify-between mt-4 gap-2 ">
          <button
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow font-semibold"
          >
            Export to Excel
          </button>
          <div className="mt-4 text-sm text-gray-600">
            Page {page} of {totalPages} — {totalInvoices} active & Inactive
            invoices
            {totalInvoices !== 1 && "s"}
          </div>

          <div className="flex gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-3 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <MdChevronLeft />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-3 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
            >
              <MdChevronRight />
            </button>
          </div>
        </div>
        {openInvoiceEditModel && selectedInvoice && (
          <InvoiceEditModel
            selectedInvoice={selectedInvoice}
            close={() => {
              setOpenInvoiceEditModel(false);
              setSelectedInvoice(null);
            }}
            cancel={() => {
              setOpenInvoiceEditModel(false);
              setSelectedInvoice(null);
            }}
          />
        )}

        {openViewModel && selectedInvoice && (
          <ViewModel
            close={() => setOpenViewModel(false)}
            data={selectedInvoice}
          />
        )}
      </div>

      {showConfirmModal && (
        <ConfirmModal
          title="Confirm Permanent Deletion"
          message="Are you sure you want to permanently delete this invoice? This action cannot be undone."
          onCancel={() => {
            setShowConfirmModal(false);
            setInvoiceToDelete(null);
          }}
          onConfirm={() => {
            if (invoiceToDelete) deleteInvoicePermanently(invoiceToDelete);
            setShowConfirmModal(false);
            setInvoiceToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default Sales;
