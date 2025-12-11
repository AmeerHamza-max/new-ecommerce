import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
// 🛑 CHANGE 1: Named Imports use karen, kyunki store.js ab default export nahi de raha
import { store, persistor } from "./store/store"; 
import { PersistGate } from "redux-persist/integration/react"; // 🛑 CHANGE 2: PersistGate import karen
import { Toaster } from "./components/ui/toaster";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        {/* 🛑 CHANGE 3: PersistGate ko Provider ke andar wrap karen */}
        <PersistGate loading={null} persistor={persistor}>
          <App />
          <Toaster />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);