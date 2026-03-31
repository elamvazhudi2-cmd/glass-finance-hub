import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import StockMarket from "./pages/StockMarket";
import CryptoExplorer from "./pages/CryptoExplorer";
import FDCenter from "./pages/FDCenter";
import NFTMarketplace from "./pages/NFTMarketplace";
import InvestmentCalculator from "./pages/InvestmentCalculator";
import PortfolioManager from "./pages/PortfolioManager";
import MarketNews from "./pages/MarketNews";
import GlobalIndices from "./pages/GlobalIndices";
import TaxPlanner from "./pages/TaxPlanner";
import RetirementEstimator from "./pages/RetirementEstimator";
import EducationalHub from "./pages/EducationalHub";
import Support from "./pages/Support";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(var(--background))" }}>
        <div className="animate-spin w-8 h-8 border-2 rounded-full" style={{ borderColor: "hsl(var(--primary))", borderTopColor: "transparent" }} />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<Auth />} />
    <Route path="/" element={<ProtectedRoute><Layout><Index /></Layout></ProtectedRoute>} />
    <Route path="/stocks" element={<ProtectedRoute><Layout><StockMarket /></Layout></ProtectedRoute>} />
    <Route path="/crypto" element={<ProtectedRoute><Layout><CryptoExplorer /></Layout></ProtectedRoute>} />
    <Route path="/fd-center" element={<ProtectedRoute><Layout><FDCenter /></Layout></ProtectedRoute>} />
    <Route path="/nft" element={<ProtectedRoute><Layout><NFTMarketplace /></Layout></ProtectedRoute>} />
    <Route path="/calculator" element={<ProtectedRoute><Layout><InvestmentCalculator /></Layout></ProtectedRoute>} />
    <Route path="/portfolio" element={<ProtectedRoute><Layout><PortfolioManager /></Layout></ProtectedRoute>} />
    <Route path="/news" element={<ProtectedRoute><Layout><MarketNews /></Layout></ProtectedRoute>} />
    <Route path="/indices" element={<ProtectedRoute><Layout><GlobalIndices /></Layout></ProtectedRoute>} />
    <Route path="/tax" element={<ProtectedRoute><Layout><TaxPlanner /></Layout></ProtectedRoute>} />
    <Route path="/retirement" element={<ProtectedRoute><Layout><RetirementEstimator /></Layout></ProtectedRoute>} />
    <Route path="/education" element={<ProtectedRoute><Layout><EducationalHub /></Layout></ProtectedRoute>} />
    <Route path="/support" element={<ProtectedRoute><Layout><Support /></Layout></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Layout><UserProfile /></Layout></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
