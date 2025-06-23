import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quotationData: {
    id: null,
    quotation_no: "",
    project_name: "",
    status: "",
    valid_until: "",
    created_at: "",
    updated_at: "",
    customer_id: null,
    customer: {
      id: null,
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  },
  quotationItems: [], // handled separately
};

const quotationSlice = createSlice({
  name: "quotation",
  initialState,
  reducers: {
    setQuotation: (state, action) => {
      state.quotationData = action.payload;
    },
    setQuotationItems: (state, action) => {
      state.quotationItems = action.payload;
    },
    clearQuotation: (state) => {
      state.quotationData = initialState.quotationData;
      state.quotationItems = [];
    },
  },
});

export const { setQuotation, setQuotationItems, clearQuotation } =
  quotationSlice.actions;

export default quotationSlice.reducer;
