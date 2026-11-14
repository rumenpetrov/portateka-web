import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../Button";
import { Text } from "../Text";
import styles from "./Pagination.module.css";
import type { PaginationProps } from "./Pagination.types";

export function Pagination({
  page,
  totalPages,
  onPageChange,
  navigationLabel,
  previousLabel,
  nextLabel,
  pageIndicatorLabel,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav className={styles.pagination} aria-label={navigationLabel}>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={disabled || !hasPrevious}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft aria-hidden="true" size={16} />
        <span>{previousLabel}</span>
      </Button>

      <Text
        as="span"
        variant="caption"
        tone="secondary"
        className={styles.indicator}
      >
        {pageIndicatorLabel}
      </Text>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={disabled || !hasNext}
        onClick={() => onPageChange(page + 1)}
      >
        <span>{nextLabel}</span>
        <ChevronRight aria-hidden="true" size={16} />
      </Button>
    </nav>
  );
}
