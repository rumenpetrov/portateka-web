import { useSyncExternalStore } from "react";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  apiRequest,
  getAuthToken,
  setAuthToken,
  subscribeAuthToken,
} from "./client";
import { queryKeys } from "./queryKeys";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  emailVerified: boolean;
  preferredPropertyId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignUpInput {
  email: string;
  firstName: string;
  lastName?: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignInOutput {
  token: string;
  user: UserProfile;
}

export interface VerifyEmailInput {
  token: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateMeInput {
  firstName?: string;
  lastName?: string | null;
  preferredPropertyId?: string | null;
}

export interface MessageOutput {
  message: string;
}

export const authQueries = {
  me: () =>
    queryOptions({
      queryKey: queryKeys.auth.me(),
      queryFn: ({ signal }) =>
        apiRequest<UserProfile>("/api/auth/me", {
          authenticated: true,
          signal,
        }),
    }),
};

export function useAuthToken(): string | null {
  return useSyncExternalStore(subscribeAuthToken, getAuthToken, () => null);
}

export function useMeQuery() {
  const token = useAuthToken();

  return useQuery({
    ...authQueries.me(),
    enabled: Boolean(token),
  });
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (input: SignUpInput) =>
      apiRequest<MessageOutput>("/api/auth/sign-up/email", {
        method: "POST",
        body: input,
        authenticated: false,
      }),
  });
}

export function useSignInMutation() {
  const client = useQueryClient();

  return useMutation({
    meta: {
      isSignInAttempt: true,
    },
    mutationFn: (input: SignInInput) =>
      apiRequest<SignInOutput>("/api/auth/sign-in/email", {
        method: "POST",
        body: input,
        authenticated: false,
      }),
    onSuccess: (data) => {
      setAuthToken(data.token);
      client.setQueryData(authQueries.me().queryKey, data.user);
    },
  });
}

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: (input: VerifyEmailInput) =>
      apiRequest<UserProfile>("/api/auth/verify-email", {
        method: "POST",
        body: input,
        authenticated: false,
      }),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) =>
      apiRequest<MessageOutput>("/api/auth/forgot-password", {
        method: "POST",
        body: input,
        authenticated: false,
      }),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (input: ResetPasswordInput) =>
      apiRequest<MessageOutput>("/api/auth/reset-password", {
        method: "POST",
        body: input,
        authenticated: false,
      }),
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) =>
      apiRequest<MessageOutput>("/api/auth/change-password", {
        method: "POST",
        body: input,
        authenticated: true,
      }),
  });
}

export function useUpdateMeMutation() {
  const client = useQueryClient();

  return useMutation({
    meta: {
      invalidates: [queryKeys.auth.me()],
    },
    mutationFn: (input: UpdateMeInput) =>
      apiRequest<UserProfile>("/api/auth/me", {
        method: "PATCH",
        body: input,
        authenticated: true,
      }),
    onSuccess: (updatedUser) => {
      client.setQueryData(authQueries.me().queryKey, updatedUser);
    },
  });
}

export function useDeleteMeMutation() {
  return useMutation({
    mutationFn: () =>
      apiRequest<undefined>("/api/auth/me", {
        method: "DELETE",
        authenticated: true,
      }),
  });
}

export function useSignOut() {
  const client = useQueryClient();

  return () => {
    setAuthToken(null);
    client.removeQueries({ queryKey: queryKeys.auth.all });
    client.removeQueries({ queryKey: queryKeys.properties.all });
  };
}
