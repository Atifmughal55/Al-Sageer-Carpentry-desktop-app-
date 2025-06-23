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
};

export default SummaryApi;
