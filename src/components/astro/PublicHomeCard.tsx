import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import { WelcomeBetaCard } from "@/components/features/home/WelcomeBetaCard";
import { Button, Flex } from "@/components/ui";
import { buildAppPath } from "@/i18n/localeRouting";
import type { SupportedLocale, TranslationDictionary } from "@/i18n/types";
import styles from "@/spa/pages/HomePage/HomePage.module.css";

export interface PublicHomeCardProps {
  locale: SupportedLocale;
  t: TranslationDictionary;
}

export function PublicHomeCard({ locale, t }: PublicHomeCardProps) {
  return (
    <WelcomeBetaCard t={t}>
      <Flex
        direction="column"
        gap={2}
        className={styles.ctaGroup}
        data-auth-guest=""
      >
        <Button
          as="a"
          href={buildAppPath(locale, "/sign-in")}
          variant="primary"
          fullWidth
        >
          <LogIn aria-hidden="true" size={18} />
          <span>{t.home.signInCta}</span>
        </Button>
        <Button
          as="a"
          href={buildAppPath(locale, "/sign-up")}
          fullWidth
        >
          <UserPlus aria-hidden="true" size={18} />
          <span>{t.home.signUpCta}</span>
        </Button>
      </Flex>

      <Flex
        direction="column"
        className={styles.ctaGroup}
        data-auth-user=""
        hidden
      >
        <Button
          as="a"
          href={buildAppPath(locale, "/")}
          variant="primary"
          fullWidth
        >
          <span>{t.home.openAppCta}</span>
          <ArrowRight aria-hidden="true" size={18} />
        </Button>
      </Flex>
    </WelcomeBetaCard>
  );
}
