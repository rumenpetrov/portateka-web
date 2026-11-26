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
  buildLocalizedPath,
  detectBrowserLocale,
  matchCanonicalLocale,
  normalizeTrailingSlash,
  replaceLocaleInUrl,
} from "@/i18n/localeRouting";
import type { SeoRouteKey } from "@/i18n/types";
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

function RootLocaleRedirect() {
  const location = useLocation();
  const target = `${buildLocalizedPath(detectBrowserLocale(), "/")}${location.search}${location.hash}`;
  return <Navigate to={target} replace />;
}

function LocaleBoundary() {
  const { locale: rawLocale } = useParams<{ locale: string }>();
  const location = useLocation();
  const canonical = matchCanonicalLocale(rawLocale);

  if (!canonical) {
    const target = `${buildLocalizedPath(detectBrowserLocale(), location.pathname)}${location.search}${location.hash}`;
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

function withRouteMetadata(
  element: ReactNode,
  options: {
    routeKey: SeoRouteKey;
    indexable?: boolean;
    canonicalSubpath?: string;
  },
) {
  return (
    <>
      <RouteMetadata
        routeKey={options.routeKey}
        indexable={options.indexable}
        canonicalSubpath={options.canonicalSubpath}
      />
      {element}
    </>
  );
}

export function AppRouter() {
  return (
    <Routes>
      {/* Bare root redirects to detected browser locale */}
      <Route path="/" element={<RootLocaleRedirect />} />

      {/* Locale-prefixed application routes (plus catch-all redirect for unprefixed paths) */}
      <Route path="/:locale" element={<LocaleBoundary />}>
        {/* Dedicated Home Page accessible to both guests and signed-in users */}
        <Route element={<AdaptiveShell />}>
          <Route
            index
            element={withRouteMetadata(<HomePage />, {
              routeKey: "home",
              indexable: true,
              canonicalSubpath: "/",
            })}
          />
        </Route>

        {/* Guest-only routes */}
        <Route element={<GuestOnly />}>
          <Route element={<AuthLayout />}>
            <Route
              path="sign-in"
              element={withRouteMetadata(<SignInPage />, {
                routeKey: "signIn",
                indexable: true,
                canonicalSubpath: "/sign-in",
              })}
            />
            <Route
              path="sign-up"
              element={withRouteMetadata(<SignUpPage />, {
                routeKey: "signUp",
                indexable: true,
                canonicalSubpath: "/sign-up",
              })}
            />
            <Route
              path="forgot-password"
              element={withRouteMetadata(<ForgotPasswordPage />, {
                routeKey: "forgotPassword",
              })}
            />
          </Route>
        </Route>

        {/* Token-driven auth routes accessible regardless of session state */}
        <Route element={<AuthLayout />}>
          <Route
            path="verify-email"
            element={withRouteMetadata(<VerifyEmailPage />, {
              routeKey: "verifyEmail",
            })}
          />
          <Route
            path="reset-password"
            element={withRouteMetadata(<ResetPasswordPage />, {
              routeKey: "resetPassword",
            })}
          />
        </Route>

        {/* Protected authenticated routes */}
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route
              path="properties"
              element={withRouteMetadata(<PropertiesListPage />, {
                routeKey: "properties",
              })}
            />
            <Route
              path="properties/new"
              element={withRouteMetadata(<PropertyCreatePage />, {
                routeKey: "propertyCreate",
              })}
            />
            <Route
              path="properties/:id"
              element={withRouteMetadata(<PropertyDetailPage />, {
                routeKey: "propertyDetail",
              })}
            />
            <Route
              path="profile"
              element={withRouteMetadata(<ProfilePage />, {
                routeKey: "profile",
              })}
            />
          </Route>
        </Route>

        {/* Fallback for unknown routes within a locale */}
        <Route element={<AdaptiveShell />}>
          <Route
            path="*"
            element={withRouteMetadata(<NotFoundPage />, {
              routeKey: "notFound",
            })}
          />
        </Route>
      </Route>
    </Routes>
  );
}
