import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RestaurantSidebar } from "@/components/dashboard/RestaurantSidebar";
import { ThemeProvider } from "@/providers/theme-provider";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Recipes from "./pages/Recipes";
import Checklists from "./pages/Checklists";
import Manager from "./pages/Manager";
import Communications from "./pages/Communications";
import Reminders from "./pages/Reminders";
import CalendarPage from "./pages/Calendar";
import Orders from "./pages/Orders";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import Reservations from "./pages/Reservations";
import StaffSchedule from "./pages/StaffSchedule";
import FinanceDashboard from "./pages/FinanceDashboard";
import CustomerManagement from "./pages/CustomerManagement";
import AIAgents from "./pages/AIAgents";
import Training from "./pages/Training";

const queryClient = new QueryClient();

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="restaurant-theme">
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <RestaurantSidebar onOpenSearch={() => setIsSearchOpen(true)} />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/checklists" element={<Checklists />} />
                    <Route path="/manager" element={<Manager />} />
                    <Route path="/communications" element={<Communications />} />
                    <Route path="/reminders" element={<Reminders />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/reservations" element={<Reservations />} />
                    <Route path="/staff-schedule" element={<StaffSchedule />} />
                    <Route path="/finance" element={<FinanceDashboard />} />
                    <Route path="/customers" element={<CustomerManagement />} />
                    <Route path="/ai-agents" element={<AIAgents />} />
                    <Route path="/training" element={<Training />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <GlobalSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;