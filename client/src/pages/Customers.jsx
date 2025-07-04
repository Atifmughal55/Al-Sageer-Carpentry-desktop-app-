import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useEffect, useRef } from "react";
import { useState } from "react";
import CustomerEditModel from "../components/CustomerEditModel";
// Dummy data

const Customers = () => {
  const [allCustomers, setAllCustomers] = useState([]);
  const [openEditCustomerModel, setOpenEditCustomerModel] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState();

  const fetchAllCustomers = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getAllCustomers,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        setAllCustomers(responseData.data);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const deleteCustomer = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCustomer,
        url: `${SummaryApi.deleteCustomer.url}/${id}`,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchAllCustomers();
      }
    } catch (error) {
      toast.error("Something went wrong while deleting customer");
    }
  };

  const handleSave = async (formData) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCustomer,
        url: `${SummaryApi.updateCustomer.url}/${selectedCustomer.id}`,
        data: formData,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        setOpenEditCustomerModel(false); // Close modal
        fetchAllCustomers(); // Refresh list
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const searchTimeout = useRef(null);

  const searchCustomer = async (email, phone) => {
    try {
      const response = await Axios({
        ...SummaryApi.searchCustomer,
        params: { email, phone },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        setAllCustomers([responseData.data]); // Set the found customer
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error("No customer found");
    }
  };
  useEffect(() => {
    fetchAllCustomers();
  }, []);
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-900">Customers</h2>
        <input
          type="text"
          onChange={(e) => {
            const { value } = e.target;

            if (searchTimeout.current) {
              clearTimeout(searchTimeout.current);
            }

            searchTimeout.current = setTimeout(() => {
              const trimmedValue = value.trim();

              if (trimmedValue === "") {
                fetchAllCustomers();
              } else {
                let email = "";
                let phone = "";

                if (trimmedValue.includes("/")) {
                  const parts = trimmedValue.split("/").map((v) => v.trim());
                  email = parts[0] || "";
                  phone = parts[1] || "";
                } else if (trimmedValue.includes("@")) {
                  email = trimmedValue;
                } else {
                  phone = trimmedValue;
                }

                searchCustomer(email, phone);
              }
            }, 1000);
            // Delay of 500ms (you can adjust this)
          }}
          placeholder="Search by email or phone..."
          className="px-2 py-1 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 shadow-sm bg-white text-yellow-900 placeholder-yellow-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-yellow-200 text-yellow-900">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Customer Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allCustomers.length > 0 ? (
              allCustomers.map((customer, index) => {
                return (
                  <tr
                    key={customer.id}
                    className="border-t border-yellow-100 hover:bg-yellow-50"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{customer.name}</td>
                    <td className="py-3 px-4">{customer.email}</td>
                    <td className="py-3 px-4">{customer.phone}</td>
                    <td className="py-3 px-4">{customer.address}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setOpenEditCustomerModel(true);
                            setSelectedCustomer(customer);
                          }}
                          className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => deleteCustomer(customer.id)}
                          className="p-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-t border-yellow-100 hover:bg-yellow-50">
                <td colSpan={8} className="py-3 text-center">
                  No Customer available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {openEditCustomerModel && (
        <CustomerEditModel
          customer={selectedCustomer}
          close={() => setOpenEditCustomerModel(false)}
          cancel={() => setOpenEditCustomerModel(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Customers;
