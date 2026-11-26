import { Building2, House, LogOut, User } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useSignOut } from "@/api/auth.api";
import { useI18n } from "@/i18n/I18nProvider";
import { Button, Flex } from "@/components/ui";
import { BrandLogo } from "../BrandLogo";
import { Footer } from "../Footer";
import { OfflineBanner } from "../OfflineBanner";
import { PwaUpdateBanner } from "../PwaUpdateBanner";
import { TopControls } from "../TopControls";
import styles from "./AppLayout.module.css";

export function AppLayout() {
  const { localizePath, t } = useI18n();
  const signOut = useSignOut();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate(localizePath("/sign-in"), { replace: true });
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Flex align="center" gap={6}>
            <BrandLogo />

            <nav
              aria-label={t.nav.mainNavigation}
              className={styles.desktopNav}
            >
              <NavLink
                to={localizePath("/")}
                end
                className={styles.desktopNavItem}
              >
                <House aria-hidden="true" size={16} />
                <span>{t.nav.home}</span>
              </NavLink>
              <NavLink
                to={localizePath("/properties")}
                end
                className={styles.desktopNavItem}
              >
                <Building2 aria-hidden="true" size={16} />
                <span>{t.nav.properties}</span>
              </NavLink>
              <NavLink
                to={localizePath("/profile")}
                className={styles.desktopNavItem}
              >
                <User aria-hidden="true" size={16} />
                <span>{t.nav.profile}</span>
              </NavLink>
            </nav>
          </Flex>

          <Flex align="center" gap={2}>
            <TopControls />
            <div className={styles.desktopNav}>
              <Button variant="secondary" size="sm" onClick={handleSignOut}>
                <LogOut aria-hidden="true" size={16} />
                <span>{t.nav.signOut}</span>
              </Button>
            </div>
          </Flex>
        </div>
      </header>

      <PwaUpdateBanner />
      <OfflineBanner />

      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />

      <nav aria-label={t.nav.mainNavigation} className={styles.bottomNav}>
        <NavLink to={localizePath("/")} end className={styles.bottomNavItem}>
          <House aria-hidden="true" size={20} />
          <span>{t.nav.home}</span>
        </NavLink>
        <NavLink
          to={localizePath("/properties")}
          end
          className={styles.bottomNavItem}
        >
          <Building2 aria-hidden="true" size={20} />
          <span>{t.nav.properties}</span>
        </NavLink>
        <NavLink
          to={localizePath("/profile")}
          className={styles.bottomNavItem}
        >
          <User aria-hidden="true" size={20} />
          <span>{t.nav.profile}</span>
        </NavLink>
        <button
          type="button"
          className={styles.bottomNavItem}
          onClick={handleSignOut}
        >
          <LogOut aria-hidden="true" size={20} />
          <span>{t.nav.signOut}</span>
        </button>
      </nav>
    </div>
  );
}
