import type { TranslationDictionary } from "./types";

export const enUS: TranslationDictionary = {
  app: {
    name: "Portateka",
    tagline: "Property Portfolio Management",
    betaBadge: "BETA",
  },
  home: {
    title: "Welcome to Portateka",
    subtitle: "A small space where you organize and manage your property information.",
    betaWarningTitle: "Early Beta Release",
    betaWarningMessage:
      "Portateka is currently in an active beta stage and is not yet a finished product. Features may change, and occasional issues may occur.",
    betaDataLossNote:
      "Important: Please do not store critical or irreplaceable information here yet, as database resets or updates during beta testing may result in data loss.",
    goToProperties: "Go to My Properties",
    signInCta: "Sign in",
    signUpCta: "Create an account",
  },
  common: {
    loading: "Loading...",
    close: "Close",
    cancel: "Cancel",
    save: "Save changes",
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    confirm: "Confirm",
    back: "Back",
    showPassword: "Show password",
    hidePassword: "Hide password",
    showPasswordWarning: "Warning: this displays your password on the screen.",
    notificationsRegion: "Notifications",
    dismissNotification: "Dismiss notification",
    srAnnouncements: "Screen reader announcements",
  },
  nav: {
    mainNavigation: "Main navigation",
    properties: "Properties",
    newProperty: "New property",
    profile: "Profile",
    signIn: "Sign in",
    signUp: "Create account",
    signOut: "Sign out",
  },
  preferences: {
    languageLabel: "Language",
    languages: {
      "en-US": "English",
      "bg-BG": "Български",
    },
    themeToggleToDark: "Switch to dark theme",
    themeToggleToLight: "Switch to light theme",
    themeLabel: "Color theme",
    themes: {
      system: "System default",
      light: "Light",
      dark: "Dark",
    },
  },
  auth: {
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    passwordHint:
      "8–128 characters with uppercase, lowercase, number, and special character.",
    firstNameLabel: "First name",
    lastNameLabel: "Last name",
    languageLabel: "Preferred language",
    languageHint: "Transactional emails will be sent in this language.",
    tokenLabel: "Verification or reset token",
    tokenHint:
      "Automatically filled from the email link, or paste the token manually.",
    signIn: {
      title: "Sign in to your account",
      subtitle: "Manage your properties and account preferences.",
      submit: "Sign in",
      forgotPasswordLink: "Forgot your password?",
      noAccountPrompt: "Don't have an account?",
      signUpLink: "Create an account",
      needVerificationLink: "Have a verification token?",
      welcomeNotification: "Signed in successfully.",
    },
    signUp: {
      title: "Create your account",
      subtitle: "Register with your email address to get started.",
      submit: "Create account",
      hasAccountPrompt: "Already have an account?",
      signInLink: "Sign in",
      successTitle: "Check your email",
      successMessage:
        "If this email can be registered, we sent a verification link. Open the link or paste the token on the verification page.",
      goToVerifyLink: "Go to email verification",
    },
    verifyEmail: {
      title: "Verify your email",
      subtitle:
        "Confirm your email address to activate sign-in on your account.",
      verifying: "Verifying your email address...",
      submit: "Verify email",
      successTitle: "Email verified",
      successMessage:
        "Your email address has been verified. You can now sign in to your account.",
      proceedToSignIn: "Proceed to sign in",
    },
    forgotPassword: {
      title: "Reset your password",
      subtitle:
        "Enter your account email and we will send you a password reset link.",
      submit: "Send reset link",
      backToSignIn: "Back to sign in",
      successTitle: "Check your inbox",
      successMessage:
        "If an account exists for that email, a password reset link has been sent.",
      goToResetLink: "Enter reset token manually",
    },
    resetPassword: {
      title: "Choose a new password",
      subtitle: "Enter your reset token and choose a strong new password.",
      newPasswordLabel: "New password",
      submit: "Update password",
      successTitle: "Password updated",
      successMessage:
        "Your password has been reset and your email is verified. You can now sign in.",
      proceedToSignIn: "Sign in with new password",
    },
  },
  properties: {
    listTitle: "My Properties",
    listSubtitle:
      "View, organize, and select your preferred property across your portfolio.",
    createButton: "Add property",
    emptyTitle: "No properties yet",
    emptyDescription:
      "Create your first property. Your first created property will automatically become your preferred property.",
    preferredBadge: "Preferred",
    setPreferredButton: "Set as preferred",
    clearPreferredButton: "Clear preferred",
    preferredUpdatedNotification: "Preferred property updated.",
    viewDetailsButton: "Manage",
    createdAtLabel: "Created",
    updatedAtLabel: "Last updated",
    fields: {
      nameLabel: "Property name",
      nameHint: "Required, up to 100 characters.",
      descriptionLabel: "Description",
      descriptionHint: "Optional summary, up to 1,000 characters.",
      notesLabel: "Private notes",
      notesHint: "Optional notes, up to 2,000 characters.",
    },
    create: {
      title: "Add a new property",
      subtitle: "Enter the details for your property entry.",
      submit: "Create property",
      createdNotification: "Property created successfully.",
    },
    detail: {
      title: "Property details",
      subtitle: "View or update this property's information and status.",
      editSectionTitle: "Edit property information",
      saveChanges: "Save property changes",
      updatedNotification: "Property updated successfully.",
      deleteButton: "Delete property",
      deleteModalTitle: "Delete this property?",
      deleteModalDescription:
        "This action permanently removes the property. If it is your preferred property, your preferred selection will be cleared automatically.",
      deleteConfirmButton: "Delete permanently",
      deletedNotification: "Property deleted.",
    },
  },
  profile: {
    title: "Account Profile",
    subtitle: "Manage your personal details and default preferred property.",
    accountInfoTitle: "Personal information",
    emailVerifiedBadge: "Verified",
    emailUnverifiedBadge: "Unverified",
    preferredPropertyLabel: "Preferred property",
    noPreferredPropertyOption: "None selected",
    preferredPropertyHint:
      "Choose your primary property or clear the selection.",
    saveChanges: "Save profile",
    updatedNotification: "Profile updated successfully.",
    memberSinceLabel: "Member since",
    changePassword: {
      title: "Change password",
      subtitle: "Update your account password using your current password.",
      currentPasswordLabel: "Current password",
      newPasswordLabel: "New password",
      submit: "Change password",
      updatedNotification: "Password changed successfully.",
    },
    dangerZone: {
      title: "Danger zone",
      subtitle: "Irreversible and destructive actions for your account.",
      deleteButton: "Delete account",
      deleteModalTitle: "Delete your account?",
      deleteModalDescription:
        "This will permanently delete your account and remove any data associated with it. This action cannot be undone.",
      confirmInputLabel: 'Type "DELETE" to confirm',
      confirmKeyword: "DELETE",
      deleteConfirmButton: "Delete account permanently",
      deletedNotification: "Your account has been permanently deleted.",
    },
  },
  notFound: {
    title: "Page not found",
    description: "The page you are looking for does not exist or has moved.",
    backHome: "Back to home",
  },
  errors: {
    topLevel: {
      UNAUTHORIZED: {
        default: "Your session has expired or requires authentication. Please sign in.",
        user: "Authentication failed. Please sign in again.",
        invalidCredentials: "Invalid email or password.",
      },
      FORBIDDEN: {
        default: "You do not have permission to perform this action.",
        user: "Please verify your email address before signing in.",
      },
      NOT_FOUND: {
        default: "The requested item could not be found.",
        route: "The requested API endpoint does not exist.",
        user: "The user account associated with this token no longer exists.",
        property: "This property was not found or belongs to another account.",
      },
      ALREADY_EXISTS: {
        default: "A record with these details already exists.",
        user: "An account with this email address already exists.",
        property: "A property with these details already exists.",
      },
      VALIDATION_ERROR: {
        default: "Please review the highlighted fields and try again.",
      },
      INTERNAL_SERVER_ERROR: {
        default: "An unexpected server error occurred. Please try again shortly.",
        user: "We could not complete your account request right now. Please try again later.",
      },
      RATE_LIMITED:
        "Too many attempts. Please wait 10 seconds before trying again.",
      NETWORK_ERROR:
        "Unable to reach the server. Please check your connection and try again.",
    },
    fields: {
      required: "This field is required.",
      invalid_type: "The provided value has an invalid format.",
      too_long: "This value exceeds the maximum allowed length.",
      nameTooLong: "Name cannot exceed 50 characters (or 100 for properties).",
      descriptionTooLong: "Description cannot exceed 1,000 characters.",
      notesTooLong: "Notes cannot exceed 2,000 characters.",
      emailTooLong: "Email address cannot exceed 255 characters.",
      invalid_uuid: "The selected identifier is not a valid ID.",
      already_exists: "This value is already in use.",
      invalid_email: "Please enter a valid email address.",
      email_not_verified:
        "Your email address is not verified yet. Please check your inbox for the verification link.",
      password_too_short: "Password must be at least 8 characters long.",
      password_too_long: "Password cannot exceed 128 characters.",
      password_missing_uppercase:
        "Password must include at least one uppercase letter (A–Z).",
      password_missing_lowercase:
        "Password must include at least one lowercase letter (a–z).",
      password_missing_number:
        "Password must include at least one number (0–9).",
      password_missing_special:
        "Password must include at least one special character (e.g. !@#$%).",
      password_same_as_current:
        "New password must be different from your current password.",
      invalid_password: "Your current password is incorrect.",
      invalid_or_expired_token:
        "This token is invalid, expired, or has already been used.",
      invalid_locale: "Please select a valid language.",
    },
  },
};
