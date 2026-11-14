export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
  navigationLabel: string;
  previousLabel: string;
  nextLabel: string;
  pageIndicatorLabel: string;
  disabled?: boolean;
}
