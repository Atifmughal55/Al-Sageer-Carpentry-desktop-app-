import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Dashboard from "../layouts/Dashboard";
import MainPage from "../pages/MainPage";

import Quotations from "../pages/Quotations";
import Customers from "../pages/Customers";
import Purchases from "../pages/Purchases";
import Sales from "../pages/Sales";
import Invoice from "../pages/Invoice";
import InvoicePrint from "../pages/InvoicePrint";
import CreateQuotation from "../pages/CreateQuotation";
import QuotationPrint from "../pages/QuotationPrint";
import NotFound from "../pages/NotFound";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";
import WalkInCustomer from "../pages/WalkInCustomer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Login />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "",
            element: <MainPage />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "quotations",
            element: <Quotations />,
          },
          {
            path: "customers",
            element: <Customers />,
          },
          {
            path: "purchases",
            element: <Purchases />,
          },
          {
            path: "sales",
            element: <Sales />,
          },
          {
            path: "invoice/:quotation_no",
            element: <Invoice />,
          },
          {
            path: "invoice-print/:invoiceNo",
            element: <InvoicePrint />,
          },
          {
            path: "create-quotation",
            element: <CreateQuotation />,
          },
          {
            path: "quotation-print/:quotationNo",
            element: <QuotationPrint />,
          },
          {
            path: "walk-in",
            element: <WalkInCustomer />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
