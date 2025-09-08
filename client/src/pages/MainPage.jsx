import React, { useEffect, useState } from "react";
import {
  MdAttachMoney,
  MdPeople,
  MdRequestQuote,
  MdProductionQuantityLimits,
} from "react-icons/md";
import { BiPurchaseTag } from "react-icons/bi";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const StatCard = ({ icon, title, value, border, loading }) => (
  <div className={`bg-white shadow p-5 rounded-xl border-l-4 ${border}`}>
    <div className="flex items-center gap-4">
      <span className="text-3xl text-yellow-600">{icon}</span>
      <div>
        <h4 className="text-sm text-yellow-900">{title}</h4>
        <p className="text-xl font-bold text-yellow-800">
          {loading ? <Skeleton width={60} /> : value}
        </p>
      </div>
    </div>
  </div>
);

const MainPage = () => {
  const [pendingQuotations, setPendingQuotations] = useState([]);
  const [allCustomers, setAllCustomers] = useState(0);
  const [invoicesToday, setInvoicesToday] = useState(0);
  const [purchasesToday, setPurchasesToday] = useState(0);
  const [salesData, setSalesData] = useState({
    title: "Today's Sales",
    value: "Rs. 0",
  });
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [dateRange, setDateRange] = useState("today");
  const [loading, setLoading] = useState({
    quotations: true,
    customers: true,
    invoices: true,
    purchases: true,
    sales: true,
  });

  // Utility to get date range
  const getDateRange = (range) => {
    const today = new Date();
    const end = new Date(today);
    const start = new Date(today);

    switch (range) {
      case "7":
        start.setDate(today.getDate() - 6);
        break;
      case "15":
        start.setDate(today.getDate() - 14);
        break;
      case "30":
        start.setDate(today.getDate() - 29);
        break;
      default:
        // "today"
        break;
    }

    const format = (date) => {
      const offsetMs = date.getTimezoneOffset() * 60000;
      const localISO = new Date(date.getTime() - offsetMs).toISOString();
      return localISO.split("T")[0];
    };

    return {
      startDate: format(start),
      endDate: format(end),
    };
  };

  const fetchQuotations = async () => {
    try {
      setLoading((prev) => ({ ...prev, quotations: true }));
      const response = await Axios({ ...SummaryApi.getAllQuotations });
      const { data } = response;
      if (data.success) {
        setPendingQuotations(data.data.filter((q) => q.status === "pending"));
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading((prev) => ({ ...prev, quotations: false }));
    }
  };

  const fetchCustomers = async () => {
    setLoading((prev) => ({ ...prev, customers: true }));
    try {
      const response = await Axios({ ...SummaryApi.getAllCustomers });
      const { data } = response;
      if (data.success) {
        setAllCustomers(data.totalCustomer);
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading((prev) => ({ ...prev, customers: false }));
    }
  };

  const fetchInvoices = async () => {
    setLoading((prev) => ({ ...prev, invoices: true }));
    try {
      const response = await Axios({ ...SummaryApi.getAllInvoice });
      const { data } = response;

      if (data.success) {
        const today = new Date().toISOString().split("T")[0];

        const count = data.data.filter((inv) => {
          const localDate = new Date(
            new Date(inv.created_at).getTime() -
              new Date(inv.created_at).getTimezoneOffset() * 60000
          )
            .toISOString()
            .split("T")[0];
          return localDate === today;
        }).length;

        setInvoicesToday(count);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading((prev) => ({ ...prev, invoices: false }));
    }
  };

  const fetchPurchases = async () => {
    setLoading((prev) => ({ ...prev, purchases: true }));
    try {
      const response = await Axios({ ...SummaryApi.getAllPurchases });
      const { data } = response;
      if (data.success) {
        setPurchasesToday(data.totalPurchases);
      }
    } catch {
      toast.error("Failed to fetch purchases");
    } finally {
      setLoading((prev) => ({ ...prev, purchases: false }));
    }
  };

  const fetchSalesData = async () => {
    const { startDate, endDate } = getDateRange(dateRange);
    setLoading((prev) => ({ ...prev, sales: true }));

    try {
      const response = await Axios({
        method: "GET",
        url: `/api/invoices/sale/summary?startDate=${startDate}&endDate=${endDate}`,
      });

      const { data } = response;
      if (data.success) {
        setSalesData({
          title:
            dateRange === "today"
              ? "Today's Sales"
              : `Sales (Last ${dateRange} days)`,
          value: `AED. ${(data.data.totalSales ?? 0).toLocaleString()}`,
        });

        setTotalRevenue(data.data.totalRevenue ?? 0); // 👈 NEW
      }
    } catch (error) {
      toast.error("Failed to fetch sales data");
    } finally {
      setLoading((prev) => ({ ...prev, sales: false }));
    }
  };

  useEffect(() => {
    fetchQuotations();
    fetchCustomers();
    fetchInvoices();
    fetchPurchases();
  }, []);

  useEffect(() => {
    fetchSalesData();
  }, [dateRange]);

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = daysOfWeek[today.getDay()];
  const formattedDate = `${dayOfWeek} ${day}/${month}/${year}`;

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold text-yellow-900 mb-6">Dashboard</h1>
        <h1 className="text-lg font-bold text-yellow-900 mb-6">
          {formattedDate}
        </h1>
      </div>

      {/* Sales Card with date filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow p-5 rounded-xl border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 text-yellow-600 text-2xl">
              <MdAttachMoney />
              <h4 className="text-sm font-semibold text-yellow-800">
                Sales Overview
              </h4>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="7">Last 7 days</option>
              <option value="15">Last 15 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </div>
          <p className="text-2xl font-bold text-yellow-900">
            {loading.sales ? <Skeleton width={100} /> : salesData.value}
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            {loading.sales ? <Skeleton width={80} /> : salesData.title}
          </p>
        </div>
        <StatCard
          icon={<MdAttachMoney />}
          title="Total Revenue"
          value={`AED. ${totalRevenue.toLocaleString()}`}
          loading={loading.sales}
          border="border-yellow-700"
        />
      </div>

      {/* Other Stats */}
      <h2 className="text-2xl font-semibold text-yellow-800 mb-4">
        Key Highlights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<MdPeople />}
          title="Total Customers"
          value={allCustomers}
          loading={loading.customers}
          border="border-yellow-400"
        />
        <StatCard
          icon={<MdRequestQuote />}
          title="Pending Quotations"
          value={pendingQuotations.length}
          loading={loading.quotations}
          border="border-yellow-500"
        />
        <StatCard
          icon={<MdProductionQuantityLimits />}
          title="Today's invoice created"
          value={invoicesToday}
          loading={loading.invoices}
          border="border-yellow-600"
        />
        <StatCard
          icon={<BiPurchaseTag />}
          title="Total Purchases"
          value={purchasesToday}
          loading={loading.purchases}
          border="border-yellow-400"
        />
      </div>
    </div>
  );
};

export default MainPage;
