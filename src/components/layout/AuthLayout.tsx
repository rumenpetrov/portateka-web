import { Outlet } from "react-router";
import { Flex } from "@/components/ui";
import { BrandLogo } from "./BrandLogo";
import { TopControls } from "./TopControls";

export function AuthLayout() {
  return (
    <div className="auth-shell">
      <Flex
        as="header"
        align="center"
        justify="between"
        gap={3}
        style={{
          maxInlineSize: "64rem",
          inlineSize: "100%",
          marginInline: "auto",
          paddingBlock: "var(--primitive-space-2)",
        }}
      >
        <BrandLogo />
        <TopControls />
      </Flex>

      <main className="auth-main">
        <Outlet />
      </main>
    </div>
  );
}
