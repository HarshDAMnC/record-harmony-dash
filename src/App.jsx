import { BrowserRouter, Routes, Route } from "react-router-dom";
import {QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";

import { Toaster } from "@/components/ui/toaster";
import { ToastProviderWrapper } from "@/hooks/use-toast"; // ✅ import your provider

import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import TablePage from "@/pages/TablePage";
import NotFound from "@/pages/NotFound";
import { Toaster as Sonner } from "@/components/ui/sonner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* ✅ wrap Toaster and the rest of app in ToastProviderWrapper */}
      <ToastProviderWrapper>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/table/:tableName" element={<TablePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProviderWrapper>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
