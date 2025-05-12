
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import AuthProvider from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
