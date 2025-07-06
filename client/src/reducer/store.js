import { configureStore } from "@reduxjs/toolkit";
import quotationReducer from "./quotationSlice.js";

export const store = configureStore({
  reducer: {
    quotation: quotationReducer,
  },
});
