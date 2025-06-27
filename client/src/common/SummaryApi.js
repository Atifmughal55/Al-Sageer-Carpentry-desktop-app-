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
};

export default SummaryApi;
