import {
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import { dispatchGlobalApiErrorNotification } from "@/components/notifications/NotificationProvider";
import { isApiClientError, setAuthToken } from "./client";
import { queryKeys } from "./queryKeys";

export interface AppMutationMeta extends Record<string, unknown> {
  /**
   * Query key prefixes to automatically invalidate when the mutation succeeds.
   */
  invalidates?: readonly QueryKey[];
  /**
   * When true, suppresses the automatic global toast even for non-field errors.
   */
  skipGlobalErrorToast?: boolean;
  /**
   * Marks the mutation as a sign-in attempt so 401 UNAUTHORIZED translates to
   * "Invalid email or password" rather than "Session expired" and does not wipe existing state.
   */
  isSignInAttempt?: boolean;
}

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: AppMutationMeta;
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (isApiClientError(error) && error.status > 0 && error.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (isApiClientError(error) && error.status === 401) {
        setAuthToken(null);
        queryClient.removeQueries({ queryKey: queryKeys.auth.all });
        queryClient.removeQueries({ queryKey: queryKeys.properties.all });
        return;
      }

      if (isApiClientError(error)) {
        dispatchGlobalApiErrorNotification(error);
      }
    },
  }),
  mutationCache: new MutationCache({
    onSuccess: async (_data, _variables, _context, mutation) => {
      const invalidates = mutation.meta?.invalidates;
      if (!invalidates || invalidates.length === 0) {
        return;
      }

      await Promise.all(
        invalidates.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
    },
    onError: (error, _variables, _context, mutation) => {
      const meta = mutation.meta;

      if (
        isApiClientError(error) &&
        error.status === 401 &&
        !meta?.isSignInAttempt
      ) {
        setAuthToken(null);
        queryClient.removeQueries({ queryKey: queryKeys.auth.all });
        queryClient.removeQueries({ queryKey: queryKeys.properties.all });
      }

      if (meta?.skipGlobalErrorToast) {
        return;
      }

      // If the error contains field-level validation errors, let the form render them inline
      // next to the corresponding inputs rather than duplicating them in a toast.
      if (isApiClientError(error) && error.hasFieldValidationParams()) {
        return;
      }

      if (isApiClientError(error)) {
        dispatchGlobalApiErrorNotification(error, {
          isSignInAttempt: meta?.isSignInAttempt,
        });
      }
    },
  }),
});
