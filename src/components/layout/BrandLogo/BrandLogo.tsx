import { Link } from "react-router";
import { Anchor } from "@/components/ui";
import { useI18n } from "@/i18n/I18nProvider";
import styles from "./BrandLogo.module.css";

export function BrandLogo() {
  const { t } = useI18n();

  return (
    <Anchor as={Link} to="/" className={styles.brandLogo}>
      <svg
        aria-hidden="true"
        className={styles.mark}
        viewBox="0 0 64 64"
        fill="none"
      >
        <path
          d="M13 38V24C13 13.5066 21.5066 5 32 5C42.4934 5 51 13.5066 51 24V38C51 41.866 47.866 45 44 45H36"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24.5 45V18.5H32.5C36.6421 18.5 40 21.8579 40 26C40 30.1421 36.6421 33.5 32.5 33.5H24.5"
          stroke="currentColor"
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="7"
          y="53"
          width="50"
          height="7.5"
          rx="3.75"
          fill="currentColor"
        />
      </svg>
      <span className={styles.text}>{t.app.name}</span>
      <span className={styles.badge}>{t.app.betaBadge}</span>
    </Anchor>
  );
}
