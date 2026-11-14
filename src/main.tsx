import "@/theme/tokens.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/api/queryClient";
import { NotificationProvider } from "@/notifications/NotificationProvider";
import { I18nProvider } from "@/i18n/I18nProvider";
import { AppRouter } from "@/router";
import { ThemeProvider } from "@/theme/ThemeProvider";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <NotificationProvider>
            <AppRouter />
          </NotificationProvider>
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
);
