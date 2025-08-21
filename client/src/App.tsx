import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { setupMockApi } from "./api/mockApi";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import History from "./pages/History";
import UserManagement from "./pages/UserManagement";
import ProductCreation from "./pages/ProductCreation";
import ProductEntry from "./pages/ProductEntry";
import ProductWithdrawal from "./pages/ProductWithdrawal";
import Logs from "./pages/Logs";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";

// Setup mock API
setupMockApi();

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
