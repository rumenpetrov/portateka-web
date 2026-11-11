import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { Input } from "@/components/ui";
import type { InputProps } from "@/components/ui";

export type PasswordInputProps = Omit<InputProps, "type" | "endAdornment">;

export function PasswordInput(props: PasswordInputProps) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const warningId = useId();

  return (
    <div>
      <span id={warningId} className="visually-hidden">
        {t.common.showPasswordWarning}
      </span>
      <Input
        {...props}
        type={visible ? "text" : "password"}
        endAdornment={
          <button
            type="button"
            disabled={props.disabled}
            className="ui-btn ui-btn--ghost ui-btn--sm"
            aria-pressed={visible}
            aria-label={
              visible ? t.common.hidePassword : t.common.showPassword
            }
            aria-describedby={warningId}
            onClick={() => setVisible((prev) => !prev)}
          >
            {visible ? (
              <EyeOff aria-hidden="true" size={18} />
            ) : (
              <Eye aria-hidden="true" size={18} />
            )}
          </button>
        }
      />
    </div>
  );
}
