import type { ReactNode } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router";
import { useAuthToken } from "@/api/auth.api";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { RouteMetadata } from "@/components/seo/RouteMetadata";
import { useI18n } from "@/i18n/I18nProvider";
import {
  buildAppPath,
  detectBrowserLocale,
  matchCanonicalLocale,
  normalizeTrailingSlash,
  replaceLocaleInUrl,
} from "@/i18n/localeRouting";
import type { SeoRouteKey } from "@/i18n/types";
import { ForgotPasswordPage } from "@/spa/pages/ForgotPasswordPage";
import { HomePage } from "@/spa/pages/HomePage";
import { NotFoundPage } from "@/spa/pages/NotFoundPage";
import { ProfilePage } from "@/spa/pages/ProfilePage";
import { PropertiesListPage } from "@/spa/pages/PropertiesListPage";
import { PropertyCreatePage } from "@/spa/pages/PropertyCreatePage";
import { PropertyDetailPage } from "@/spa/pages/PropertyDetailPage";
import { ResetPasswordPage } from "@/spa/pages/ResetPasswordPage";
import { SignInPage } from "@/spa/pages/SignInPage";
import { SignUpPage } from "@/spa/pages/SignUpPage";
import { VerifyEmailPage } from "@/spa/pages/VerifyEmailPage";

function RequireAuth() {
  const token = useAuthToken();
  const { localizePath } = useI18n();

  if (!token) {
    return <Navigate to={localizePath("/sign-in")} replace />;
  }

  return <Outlet />;
}

function GuestOnly() {
  const token = useAuthToken();
  const { localizePath } = useI18n();

  if (token) {
    return <Navigate to={localizePath("/properties")} replace />;
  }

  return <Outlet />;
}

function AdaptiveShell() {
  const token = useAuthToken();
  return token ? <AppLayout /> : <AuthLayout />;
}

function AppRootRedirect() {
  const location = useLocation();
  const target = `${buildAppPath(detectBrowserLocale(), "/")}${location.search}${location.hash}`;
  return <Navigate to={target} replace />;
}

function LocaleBoundary() {
  const { locale: rawLocale } = useParams<{ locale: string }>();
  const location = useLocation();
  const canonical = matchCanonicalLocale(rawLocale);

  if (!canonical) {
    const target = `${buildAppPath(detectBrowserLocale(), "/")}${location.search}${location.hash}`;
    return <Navigate to={target} replace />;
  }

  const normalizedPathname = normalizeTrailingSlash(location.pathname);
  if (rawLocale !== canonical || location.pathname !== normalizedPathname) {
    const target = replaceLocaleInUrl(
      normalizedPathname,
      location.search,
      location.hash,
      canonical,
    );
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
}

function withRouteMetadata(element: ReactNode, routeKey: SeoRouteKey) {
  return (
    <>
      <RouteMetadata routeKey={routeKey} />
      {element}
    </>
  );
}

export function AppRouter() {
  return (
    <Routes>
      {/* Bare /app (e.g. PWA start_url) redirects to detected browser locale */}
      <Route path="/app" element={<AppRootRedirect />} />

      {/* Locale-prefixed SPA routes */}
      <Route path="/:locale/app" element={<LocaleBoundary />}>
        {/* Authenticated SPA Home (preferred property + beta card) */}
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route
              index
              element={withRouteMetadata(<HomePage />, "home")}
            />
            <Route
              path="properties"
              element={withRouteMetadata(<PropertiesListPage />, "properties")}
            />
            <Route
              path="properties/new"
              element={withRouteMetadata(
                <PropertyCreatePage />,
                "propertyCreate",
              )}
            />
            <Route
              path="properties/:id"
              element={withRouteMetadata(
                <PropertyDetailPage />,
                "propertyDetail",
              )}
            />
            <Route
              path="profile"
              element={withRouteMetadata(<ProfilePage />, "profile")}
            />
          </Route>
        </Route>

        {/* Guest-only auth routes */}
        <Route element={<GuestOnly />}>
          <Route element={<AuthLayout />}>
            <Route
              path="sign-in"
              element={withRouteMetadata(<SignInPage />, "signIn")}
            />
            <Route
              path="sign-up"
              element={withRouteMetadata(<SignUpPage />, "signUp")}
            />
            <Route
              path="forgot-password"
              element={withRouteMetadata(
                <ForgotPasswordPage />,
                "forgotPassword",
              )}
            />
          </Route>
        </Route>

        {/* Token-driven auth routes accessible regardless of session state */}
        <Route element={<AuthLayout />}>
          <Route
            path="verify-email"
            element={withRouteMetadata(<VerifyEmailPage />, "verifyEmail")}
          />
          <Route
            path="reset-password"
            element={withRouteMetadata(<ResetPasswordPage />, "resetPassword")}
          />
        </Route>

        {/* Fallback for unknown routes within /:locale/app/* */}
        <Route element={<AdaptiveShell />}>
          <Route
            path="*"
            element={withRouteMetadata(<NotFoundPage />, "notFound")}
          />
        </Route>
      </Route>

      {/* Fallback if SPA shell is hit directly on an unmatched path */}
      <Route path="*" element={<AppRootRedirect />} />
    </Routes>
  );
}
