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
};

export default SummaryApi;
