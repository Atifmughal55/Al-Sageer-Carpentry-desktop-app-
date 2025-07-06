// index.js
import { createRoot } from "react-dom/client"; // React 18+ rendering+
import "./index.css"; // Global styles (Tailwind or custom)
import { RouterProvider } from "react-router-dom"; // React Router v6+
import router from "./router/index.jsx"; // Your defined routes
import { Provider } from "react-redux";
import { store } from "./reducer/store.js";
// Attach the app to the #root element
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} /> // Provide the routing context
  </Provider>
);
