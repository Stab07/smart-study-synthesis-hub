
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChatWidget } from "@/components/ChatWidget";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import Features from "./pages/Features";
import AITools from "./pages/AITools";
import TextToSpeech from "./pages/features/TextToSpeech";
import Summarization from "./pages/features/Summarization";
import Chatbot from "./pages/features/Chatbot";
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
          <Route path="/upload" element={<Upload />} />
          <Route path="/results/:docId" element={<Results />} />
          <Route path="/features" element={<Features />} />
          <Route path="/ai-tools" element={<AITools />} />
          <Route path="/features/text-to-speech" element={<TextToSpeech />} />
          <Route path="/features/summarization" element={<Summarization />} />
          <Route path="/features/chatbot" element={<Chatbot />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
