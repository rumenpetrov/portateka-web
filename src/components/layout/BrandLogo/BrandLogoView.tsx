import { Anchor } from "@/components/ui";
import styles from "./BrandLogo.module.css";

export interface BrandLogoViewProps {
  href: string;
  name: string;
  betaBadge: string;
}

export function BrandLogoView({ href, name, betaBadge }: BrandLogoViewProps) {
  return (
    <Anchor href={href} className={styles.brandLogo}>
      <svg
        aria-hidden="true"
        className={styles.mark}
        width={24}
        height={24}
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
      <span className={styles.text}>{name}</span>
      <span className={styles.badge}>{betaBadge}</span>
    </Anchor>
  );
}
