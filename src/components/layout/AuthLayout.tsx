import { Outlet } from "react-router";
import { BrandLogo } from "./BrandLogo";
import { TopControls } from "./TopControls";

export function AuthLayout() {
  return (
    <div className="auth-shell">
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--primitive-space-3)",
          maxInlineSize: "64rem",
          inlineSize: "100%",
          marginInline: "auto",
          paddingBlock: "var(--primitive-space-2)",
        }}
      >
        <BrandLogo />
        <TopControls />
      </header>

      <main className="auth-main">
        <Outlet />
      </main>
    </div>
  );
}
