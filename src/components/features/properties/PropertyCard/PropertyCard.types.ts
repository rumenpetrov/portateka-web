import type { PropertyItem } from "@/api/properties.api";

export interface PropertyCardProps {
  property: PropertyItem;
  isPreferred: boolean;
  isUpdatingPreferred: boolean;
  onTogglePreferred: (propertyId: string, nextPreferred: boolean) => void;
}
