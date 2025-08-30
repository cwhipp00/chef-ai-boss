import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/providers/theme-provider";
import { RestaurantSidebar } from "@/components/dashboard/RestaurantSidebar";
import Index from "./pages/Index";
import Recipes from "./pages/Recipes";
import Checklists from "./pages/Checklists";
import Manager from "./pages/Manager";
import Communications from "./pages/Communications";
import Reminders from "./pages/Reminders";
import Calendar from "./pages/Calendar";
import Orders from "./pages/Orders";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import Reservations from "./pages/Reservations";
import StaffSchedule from "./pages/StaffSchedule";
import FinanceDashboard from "./pages/FinanceDashboard";
import CustomerManagement from "./pages/CustomerManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex h-screen w-full bg-background transition-colors duration-300">
            <RestaurantSidebar />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/checklists" element={<Checklists />} />
                <Route path="/manager" element={<Manager />} />
                <Route path="/communications" element={<Communications />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/staff-schedule" element={<StaffSchedule />} />
                <Route path="/finance" element={<FinanceDashboard />} />
                <Route path="/customers" element={<CustomerManagement />} />
                <Route path="/settings" element={<Settings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
