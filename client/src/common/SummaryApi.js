export const baseURL = "http://localhost:8000";

const SummaryApi = {
  getAllCustomers: {
    url: "/api/customers",
    method: "get",
  },
  deleteCustomer: {
    url: "/api/customers",
    method: "delete",
  },
  updateCustomer: {
    url: "/api/customers",
    method: "put",
  },
  searchCustomer: {
    url: "/api/customers/customer/search-customer",
    method: "get",
  },

  // Quotation APIs
  getAllQuotations: {
    url: "/api/quotations",
    method: "get",
  },
  getItemsOfQuotaion: {
    url: "/api/quotaton-item/quotation-items",
    method: "get",
  },
  deleteQuotation: {
    url: "/api/quotations",
    method: "delete",
  },
  createQuotation: {
    url: "/api/quotations",
    method: "post",
  },
  updateQuotation: {
    url: "/api/quotations/update",
    method: "put",
  },
  updateStatus: {
    url: "/api/quotations",
    method: "put",
  },
  searchQuotation: {
    url: "/api/quotations/search/quotation",
    method: "get",
  },

  // Invoice APIs
  getAllInvoice: {
    url: "/api/invoices",
    method: "get",
  },

  getInvoiceById: {
    url: "/api/invoices/:id",
    method: "get",
  },

  getInvoiceByQuotationNo: {
    url: "/api/invoices/invoice/:quotation_no",
    method: "get",
  },

  deleteInvoice: {
    url: "/api/invoices",
    method: "delete",
  },

  createInvoice: {
    url: "/api/invoices",
    method: "post",
  },
  restoreInvoice: {
    url: "/api/invoices/recover-invoice",
    method: "put",
  },
  searchInvoice: {
    url: "/api/invoices/invoice/search",
    method: "get",
  },
  getInvoiceItems: {
    url: "/api/invoices/invoice/invoice-items",
    method: "get",
  },
  editInvoice: {
    url: "/api/invoices/invoice",
    method: "put",
  },

  getAllPurchases: {
    url: "/api/purchases",
    method: "get",
  },
  deletePurchase: {
    url: "/api/purchases",
    method: "delete",
  },
  recoverPurchase: {
    url: "/api/purchases/restore",
    method: "put",
  },

  createPurchase: {
    url: "/api/purchases",
    method: "post",
  },
  editPurchase: {
    url: "/api/purchases",
    method: "put",
  },
};

export default SummaryApi;
