import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth
import { AuthProvider, ProtectedRoute, PublicRoute } from "./lib/auth/context";

// Layouts
import { AuthLayout } from "./components/layout/AuthLayout";
import { AppLayout } from "./components/layout/AppLayout";

// Auth Pages
import { Login } from "./pages/Auth/Login";
import { Signup } from "./pages/Auth/Signup";

// App Pages
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Clients } from "./pages/Clients/Clients";
import { Contracts } from "./pages/Contracts/Contracts";
import { Invoices } from "./pages/Invoices/Invoices";
import { Reports } from "./pages/Reports/Reports";

// 404 Page
import NotFound from "./pages/NotFound";

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes (Auth) */}
            <Route
              path="/auth/*"
              element={
                <PublicRoute>
                  <AuthLayout />
                </PublicRoute>
              }
            >
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/auth/login" replace />} />
            </Route>

            {/* Protected Routes (App) */}
            <Route
              path="/*"
              element={
                <ProtectedRoute
                  fallback={<Navigate to="/auth/login" replace />}
                >
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="clients" element={<Clients />} />
              <Route path="contracts" element={<Contracts />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="reports" element={<Reports />} />
              <Route path="" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
