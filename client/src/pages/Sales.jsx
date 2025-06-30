import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  MdEdit,
  MdDelete,
  MdArrowLeft,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { Link } from "react-router-dom";
import Axios from "../utils/Axios.js";
import SummaryApi from "../common/SummaryApi.js";
import { FaArrowRotateLeft } from "react-icons/fa6";

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

        const active = allInvoices
          .filter((inv) => inv.is_deleted === 0)
          .map(assignStatus);

        const deleted = allInvoices
          .filter((inv) => inv.is_deleted === 1)
          .map(assignStatus);

        setSales(active);
        setDeletedInvoices(deleted);
        setTotalInvoices(allInvoices.length);
      } else {
        toast.error("Failed to fetch invoice data.");
      }
    } catch (error) {
      toast.error("Failed to fetch invoice data.");
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
      `${sale.customerName} ${sale.contact} ${sale.invoice}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((sale) =>
      statusFilter === "All" ? true : sale.status === statusFilter
    )
    .sort((a, b) => {
      return sortByDate === "latest"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    });

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
          placeholder="Search by customer, contact, items..."
          className="border px-4 py-2 rounded-md w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded-md w-full md:w-1/4"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
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
        <select
          className="border px-4 py-2 rounded-md w-full md:w-1/4"
          value={invoiceTypeFilter}
          onChange={(e) => setInvoiceTypeFilter(e.target.value)}
        >
          <option value="active">Active Invoices</option>
          <option value="deleted">Deleted Invoices</option>
          <option value="all">All Invoices</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-yellow-200 text-yellow-900 text-left">
            <tr>
              <th className="py-2 px-2">#</th>
              <th className="py-2 px-2">Invoice No</th>
              <th className="py-2 px-2">Customer Name</th>
              <th className="py-2 px-2">Contact</th>
              <th className="py-2 px-2">Total</th>
              <th className="py-2 px-2">Paid</th>
              <th className="py-2 px-2">Pending</th>
              <th className="py-2 px-2">Date</th>
              <th className="py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
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
                    className={`border-t border-yellow-100 hover:bg-yellow-50 ${
                      sale.is_deleted ? "bg-red-50 text-gray-500" : ""
                    }`}
                  >
                    <td className="py-2 px-2">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="py-2 px-2">{sale.invoice_no}</td>
                    <td className="py-2 px-2">{sale.customer?.name}</td>
                    <td className="py-2 px-2">{sale.customer?.phone}</td>
                    <td className="py-2 px-2">AED {sale.total_with_vat}</td>
                    <td className="py-2 px-2">AED {sale.received}</td>
                    <td className="py-2 px-2">AED {sale.remaining}</td>
                    <td className="py-2 px-2">
                      {sale.created_at.split(" ")[0]}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {!sale.is_deleted ? (
                          <>
                            <button className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 hover:scale-105 text-white">
                              <MdEdit />
                            </button>
                            <button
                              onClick={() => deleteInvoice(sale.id)}
                              className="p-2 rounded-md bg-red-500 hover:bg-red-600 hover:scale-105 text-white"
                            >
                              <MdDelete />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => recoverInvoice(sale.id)}
                            className="p-2 rounded-md bg-gray-400 hover:bg-green-500 hover:scale-105 text-white"
                          >
                            <FaArrowRotateLeft />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-4 gap-2">
        <div className="mt-4 text-sm text-gray-600">
          Page {page} of {totalPages} — {totalInvoices} Quotation
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
    </div>
  );
};

export default Sales;
