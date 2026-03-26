import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Index from "./pages/Index.tsx";
import StockMarket from "./pages/StockMarket.tsx";
import CryptoExplorer from "./pages/CryptoExplorer.tsx";
import FDCenter from "./pages/FDCenter.tsx";
import NFTMarketplace from "./pages/NFTMarketplace.tsx";
import InvestmentCalculator from "./pages/InvestmentCalculator.tsx";
import PortfolioManager from "./pages/PortfolioManager.tsx";
import MarketNews from "./pages/MarketNews.tsx";
import GlobalIndices from "./pages/GlobalIndices.tsx";
import TaxPlanner from "./pages/TaxPlanner.tsx";
import RetirementEstimator from "./pages/RetirementEstimator.tsx";
import EducationalHub from "./pages/EducationalHub.tsx";
import Support from "./pages/Support.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/stocks" element={<Layout><StockMarket /></Layout>} />
          <Route path="/crypto" element={<Layout><CryptoExplorer /></Layout>} />
          <Route path="/fd-center" element={<Layout><FDCenter /></Layout>} />
          <Route path="/nft" element={<Layout><NFTMarketplace /></Layout>} />
          <Route path="/calculator" element={<Layout><InvestmentCalculator /></Layout>} />
          <Route path="/portfolio" element={<Layout><PortfolioManager /></Layout>} />
          <Route path="/news" element={<Layout><MarketNews /></Layout>} />
          <Route path="/indices" element={<Layout><GlobalIndices /></Layout>} />
          <Route path="/tax" element={<Layout><TaxPlanner /></Layout>} />
          <Route path="/retirement" element={<Layout><RetirementEstimator /></Layout>} />
          <Route path="/education" element={<Layout><EducationalHub /></Layout>} />
          <Route path="/support" element={<Layout><Support /></Layout>} />
          <Route path="/profile" element={<Layout><UserProfile /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
