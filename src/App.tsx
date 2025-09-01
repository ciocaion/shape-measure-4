import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import "./i18n";

const queryClient = new QueryClient();

// Store the last message sent to the tutor frame
interface LastMessage {
  type: 'success' | 'instruction';
  content: string;
  i18nKey: string;
  data?: any;
}

let lastMessage: LastMessage | null = null;

const getBasename = (): string => {
  const path = window.location.pathname;
  const parts = path.split("/");

  // Check if the path structure is /flows/{uuid}
  if (parts.length > 2 && parts[1] === "flows") {
    return `/${parts[1]}/${parts[2]}`;
  }

  return "/";
};

function App() {
  const { t, i18n } = useTranslation();

  const sendTutorMessage = (type: 'success' | 'instruction', i18nKey: string, data: any = {}) => {
    const message = t(i18nKey);
    
    window.parent.postMessage({
      type: 'tutorMessage',
      messageType: type,
      content: message,
      data: data
    }, '*');

    // Store the last message
    lastMessage = {
      type,
      content: message,
      i18nKey,
      data
    };
  };

  useEffect(() => {
    // Listen for language change messages
    const handleMessage = (event: MessageEvent) => {
      const { type, languageCode } = event.data;
      
      if (type === 'setFlowLanguage' && (languageCode === 'en' || languageCode === 'dk')) {
        i18n.changeLanguage(languageCode);
        
        // Resend last message in new language if exists
        if (lastMessage) {
          sendTutorMessage(lastMessage.type, lastMessage.i18nKey, lastMessage.data);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [i18n, t]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={getBasename()}>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;