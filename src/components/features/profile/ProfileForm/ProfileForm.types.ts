import type { UserProfile } from "@/api/auth.api";
import type { PropertyItem } from "@/api/properties.api";

export interface ProfileFormProps {
  user: UserProfile;
  properties: readonly PropertyItem[];
}
