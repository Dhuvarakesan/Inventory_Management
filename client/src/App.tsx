import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store";
// import { setupMockApi } from "./api/mockApi";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import EditProduct from "./pages/EditProduct";
import History from "./pages/History";
import Login from "./pages/Login";
import Logs from "./pages/Logs";
import NotFound from "./pages/NotFound";
import ProductCreation from "./pages/ProductCreation";
import ProductEntry from "./pages/ProductEntry";
import ProductList from "./pages/ProductList";
import ProductWithdrawal from "./pages/ProductWithdrawal";
import UserManagement from "./pages/UserManagement";

// Setup mock API
// setupMockApi();

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="history" element={<History />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="create-product" element={<ProductCreation />} />
                <Route path="product-entry" element={<ProductEntry />} />
                <Route path="product-withdrawal" element={<ProductWithdrawal />} />
                <Route path="logs" element={<Logs />} />
                <Route path="edit-product/:id" element={<EditProduct />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);

export default App;
