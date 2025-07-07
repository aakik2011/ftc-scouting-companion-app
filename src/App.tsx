
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PitScouting from "./pages/PitScouting";
import MatchScouting from "./pages/MatchScouting";
import Survey from "./pages/Survey";
import MatchScout from "./pages/MatchScout";
import PitScoutingSummary from "./pages/PitScoutingSummary";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pit-scouting" element={<PitScouting />} />
          <Route path="/pit-scouting/survey/:teamId" element={<Survey />} />
          <Route path="/pit-scouting/summary/:entryId" element={<PitScoutingSummary />} />
          <Route path="/match-scouting" element={<MatchScouting />} />
          <Route path="/match-scouting/scout/:matchId" element={<MatchScout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
