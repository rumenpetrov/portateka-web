import "@/theme/tokens.css";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/api/queryClient";
import { I18nProvider } from "@/i18n/I18nProvider";
import { NotificationProvider } from "@/notifications/NotificationProvider";
import { AppRouter } from "@/router";
import { ThemeProvider } from "@/theme/ThemeProvider";

export function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <I18nProvider>
            <QueryClientProvider client={queryClient}>
              <NotificationProvider>
                <AppRouter />
              </NotificationProvider>
            </QueryClientProvider>
          </I18nProvider>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>
  );
}
