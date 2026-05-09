import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import PostalCode from "./pages/PostalCode";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CheckEmail from "./pages/CheckEmail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import DesignSystem from "./pages/DesignSystem";
import TopLoadingBar from "./components/TopLoadingBar";
import RequireAuth from "./components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TopLoadingBar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/postal-code" element={<PostalCode />} />
          <Route path="/login" element={<Login />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/home" element={<Home />} />
          {/* Perfil accesible sin auth para testing — Profile gestiona el estado sin user. */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/design-system" element={<DesignSystem />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
