import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RestaurantSidebar } from "@/components/dashboard/RestaurantSidebar";
import { ThemeProvider } from "@/providers/theme-provider";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import Auth from "./pages/Auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Recipes from "./pages/Recipes";
import Forms from "./pages/Forms";
import Manager from "./pages/Manager";
import Communications from "./pages/Communications";
import Reminders from "./pages/Reminders";
import CalendarPage from "./pages/Calendar";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import Reservations from "./pages/Reservations";
import StaffSchedule from "./pages/StaffSchedule";
import FinanceDashboard from "./pages/FinanceDashboard";
import CustomerManagement from "./pages/CustomerManagement";
import AIAgents from "./pages/AIAgents";
import AIAssistant from "./pages/AIAssistant";
import Training from "./pages/Training";
import OrganizationSetup from "./pages/OrganizationSetup";

const queryClient = new QueryClient();

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="restaurant-theme">
        <LanguageProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <TooltipProvider>
                <Toaster />
                <BrowserRouter>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/*" element={
                    <ProtectedRoute>
                      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/30">
                        <RestaurantSidebar onOpenSearch={() => setIsSearchOpen(true)} />
                        <main className="flex-1 overflow-auto lg:ml-0">
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/recipes" element={<Recipes />} />
                            <Route path="/forms" element={<Forms />} />
                            <Route path="/manager" element={<Manager />} />
                            <Route path="/communications" element={<Communications />} />
                            <Route path="/reminders" element={<Reminders />} />
                            <Route path="/calendar" element={<CalendarPage />} />
                            <Route path="/documents" element={<Documents />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/reservations" element={<Reservations />} />
                            <Route path="/staff-schedule" element={<StaffSchedule />} />
                            <Route path="/finance" element={<FinanceDashboard />} />
                            <Route path="/customers" element={<CustomerManagement />} />
                            <Route path="/ai-agents" element={<AIAgents />} />
                            <Route path="/ai-assistant" element={<AIAssistant />} />
                            <Route path="/training" element={<Training />} />
                            <Route path="/organization-setup" element={<OrganizationSetup />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                        <GlobalSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
                      </div>
                    </ProtectedRoute>
                  } />
                </Routes>
              </BrowserRouter>
              </TooltipProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;