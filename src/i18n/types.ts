export type SupportedLocale = "en-US" | "bg-BG";

export type ApiErrorCodeKey =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "ALREADY_EXISTS"
  | "VALIDATION_ERROR"
  | "INTERNAL_SERVER_ERROR"
  | "RATE_LIMITED"
  | "NETWORK_ERROR";

export type ApiResourceKey = "route" | "user" | "property";

export type FieldMachineCodeKey =
  | "required"
  | "invalid_type"
  | "too_long"
  | "invalid_uuid"
  | "already_exists"
  | "invalid_email"
  | "email_not_verified"
  | "password_too_short"
  | "password_too_long"
  | "password_missing_uppercase"
  | "password_missing_lowercase"
  | "password_missing_number"
  | "password_missing_special"
  | "password_same_as_current"
  | "invalid_password"
  | "invalid_or_expired_token";

export interface ApiErrorShape {
  status?: number;
  code?: string;
  resource?: string;
  params?: Record<string, string>;
}

export interface TranslationDictionary {
  app: {
    name: string;
    tagline: string;
    betaBadge: string;
  };
  home: {
    title: string;
    subtitle: string;
    betaWarningTitle: string;
    betaWarningMessage: string;
    betaDataLossNote: string;
    goToProperties: string;
    signInCta: string;
    signUpCta: string;
  };
  common: {
    loading: string;
    close: string;
    cancel: string;
    save: string;
    create: string;
    edit: string;
    delete: string;
    confirm: string;
    back: string;
    showPassword: string;
    hidePassword: string;
    showPasswordWarning: string;
    notificationsRegion: string;
    dismissNotification: string;
    srAnnouncements: string;
  };
  nav: {
    mainNavigation: string;
    properties: string;
    newProperty: string;
    profile: string;
    signIn: string;
    signUp: string;
    signOut: string;
  };
  preferences: {
    languageLabel: string;
    languages: {
      "en-US": string;
      "bg-BG": string;
    };
    themeToggleToDark: string;
    themeToggleToLight: string;
    themeLabel: string;
    themes: {
      system: string;
      light: string;
      dark: string;
    };
  };
  auth: {
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordHint: string;
    firstNameLabel: string;
    lastNameLabel: string;
    tokenLabel: string;
    tokenHint: string;
    signIn: {
      title: string;
      subtitle: string;
      submit: string;
      forgotPasswordLink: string;
      noAccountPrompt: string;
      signUpLink: string;
      needVerificationLink: string;
      welcomeNotification: string;
    };
    signUp: {
      title: string;
      subtitle: string;
      submit: string;
      hasAccountPrompt: string;
      signInLink: string;
      successTitle: string;
      successMessage: string;
      goToVerifyLink: string;
    };
    verifyEmail: {
      title: string;
      subtitle: string;
      verifying: string;
      submit: string;
      successTitle: string;
      successMessage: string;
      proceedToSignIn: string;
    };
    forgotPassword: {
      title: string;
      subtitle: string;
      submit: string;
      backToSignIn: string;
      successTitle: string;
      successMessage: string;
      goToResetLink: string;
    };
    resetPassword: {
      title: string;
      subtitle: string;
      newPasswordLabel: string;
      submit: string;
      successTitle: string;
      successMessage: string;
      proceedToSignIn: string;
    };
  };
  properties: {
    listTitle: string;
    listSubtitle: string;
    createButton: string;
    emptyTitle: string;
    emptyDescription: string;
    preferredBadge: string;
    setPreferredButton: string;
    clearPreferredButton: string;
    preferredUpdatedNotification: string;
    viewDetailsButton: string;
    createdAtLabel: string;
    updatedAtLabel: string;
    fields: {
      nameLabel: string;
      nameHint: string;
      descriptionLabel: string;
      descriptionHint: string;
      notesLabel: string;
      notesHint: string;
    };
    create: {
      title: string;
      subtitle: string;
      submit: string;
      createdNotification: string;
    };
    detail: {
      title: string;
      subtitle: string;
      editSectionTitle: string;
      saveChanges: string;
      updatedNotification: string;
      deleteButton: string;
      deleteModalTitle: string;
      deleteModalDescription: string;
      deleteConfirmButton: string;
      deletedNotification: string;
    };
  };
  profile: {
    title: string;
    subtitle: string;
    accountInfoTitle: string;
    emailVerifiedBadge: string;
    emailUnverifiedBadge: string;
    preferredPropertyLabel: string;
    noPreferredPropertyOption: string;
    preferredPropertyHint: string;
    saveChanges: string;
    updatedNotification: string;
    memberSinceLabel: string;
    changePassword: {
      title: string;
      subtitle: string;
      currentPasswordLabel: string;
      newPasswordLabel: string;
      submit: string;
      updatedNotification: string;
    };
    dangerZone: {
      title: string;
      subtitle: string;
      deleteButton: string;
      deleteModalTitle: string;
      deleteModalDescription: string;
      confirmInputLabel: string;
      confirmKeyword: string;
      deleteConfirmButton: string;
      deletedNotification: string;
    };
  };
  notFound: {
    title: string;
    description: string;
    backHome: string;
  };
  errors: {
    topLevel: {
      UNAUTHORIZED: {
        default: string;
        user: string;
        invalidCredentials: string;
      };
      FORBIDDEN: {
        default: string;
        user: string;
      };
      NOT_FOUND: {
        default: string;
        route: string;
        user: string;
        property: string;
      };
      ALREADY_EXISTS: {
        default: string;
        user: string;
        property: string;
      };
      VALIDATION_ERROR: {
        default: string;
      };
      INTERNAL_SERVER_ERROR: {
        default: string;
        user: string;
      };
      RATE_LIMITED: string;
      NETWORK_ERROR: string;
    };
    fields: Record<FieldMachineCodeKey, string> & {
      nameTooLong: string;
      descriptionTooLong: string;
      notesTooLong: string;
      emailTooLong: string;
    };
  };
}
