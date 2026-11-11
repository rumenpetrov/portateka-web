import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router";
import { useAuthToken } from "@/api/auth.api";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { PropertiesListPage } from "@/pages/PropertiesListPage";
import { PropertyCreatePage } from "@/pages/PropertyCreatePage";
import { PropertyDetailPage } from "@/pages/PropertyDetailPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { SignInPage } from "@/pages/SignInPage";
import { SignUpPage } from "@/pages/SignUpPage";
import { VerifyEmailPage } from "@/pages/VerifyEmailPage";

function RequireAuth() {
  const token = useAuthToken();

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}

function GuestOnly() {
  const token = useAuthToken();

  if (token) {
    return <Navigate to="/properties" replace />;
  }

  return <Outlet />;
}

function AdaptiveShell() {
  const token = useAuthToken();
  return token ? <AppLayout /> : <AuthLayout />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dedicated Home Page accessible to both guests and signed-in users */}
        <Route element={<AdaptiveShell />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Guest-only routes */}
        <Route element={<GuestOnly />}>
          <Route element={<AuthLayout />}>
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>
        </Route>

        {/* Token-driven auth routes accessible regardless of session state */}
        <Route element={<AuthLayout />}>
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected authenticated routes */}
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/properties" element={<PropertiesListPage />} />
            <Route path="/properties/new" element={<PropertyCreatePage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>

        {/* Fallback for unauthenticated unknown routes */}
        <Route element={<AuthLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
