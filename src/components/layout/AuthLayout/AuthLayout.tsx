import { Outlet } from "react-router";
import { Flex } from "@/components/ui";
import { BrandLogo } from "../BrandLogo";
import { TopControls } from "../TopControls";
import styles from "./AuthLayout.module.css";

export function AuthLayout() {
  return (
    <div className={styles.shell}>
      <Flex
        as="header"
        align="center"
        justify="between"
        gap={3}
        className={styles.header}
      >
        <BrandLogo />
        <TopControls />
      </Flex>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
