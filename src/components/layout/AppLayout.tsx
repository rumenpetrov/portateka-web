import { Building2, LogOut, User } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useSignOut } from "../../api/auth.api";
import { useI18n } from "../../i18n/I18nProvider";
import { Button } from "../ui";
import { BrandLogo } from "./BrandLogo";
import { TopControls } from "./TopControls";

export function AppLayout() {
  const { t } = useI18n();
  const signOut = useSignOut();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/sign-in", { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--primitive-space-6)",
            }}
          >
            <BrandLogo />

            <nav
              aria-label={t.nav.mainNavigation}
              className="app-desktop-nav"
            >
              <NavLink
                to="/properties"
                end
                className="app-desktop-nav-item"
              >
                <Building2 aria-hidden="true" size={16} />
                <span>{t.nav.properties}</span>
              </NavLink>
              <NavLink
                to="/profile"
                className="app-desktop-nav-item"
              >
                <User aria-hidden="true" size={16} />
                <span>{t.nav.profile}</span>
              </NavLink>
            </nav>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--primitive-space-2)",
            }}
          >
            <TopControls />
            <div className="app-desktop-nav">
              <Button variant="secondary" size="sm" onClick={handleSignOut}>
                <LogOut aria-hidden="true" size={16} />
                <span>{t.nav.signOut}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <nav aria-label={t.nav.mainNavigation} className="app-bottom-nav">
        <NavLink to="/properties" end className="app-bottom-nav-item">
          <Building2 aria-hidden="true" size={20} />
          <span>{t.nav.properties}</span>
        </NavLink>
        <NavLink to="/profile" className="app-bottom-nav-item">
          <User aria-hidden="true" size={20} />
          <span>{t.nav.profile}</span>
        </NavLink>
        <button
          type="button"
          className="app-bottom-nav-item"
          onClick={handleSignOut}
        >
          <LogOut aria-hidden="true" size={20} />
          <span>{t.nav.signOut}</span>
        </button>
      </nav>
    </div>
  );
}
