import type { TranslationDictionary } from "./types";

export const bgBG: TranslationDictionary = {
  app: {
    name: "Портатека",
    tagline: "Управление на имотно портфолио",
  },
  common: {
    loading: "Зареждане...",
    close: "Затвори",
    cancel: "Отказ",
    save: "Запази промените",
    create: "Създай",
    edit: "Редактирай",
    delete: "Изтрий",
    confirm: "Потвърди",
    back: "Назад",
    optional: "Незадължително",
    showPassword: "Покажи паролата",
    hidePassword: "Скрий паролата",
    showPasswordWarning:
      "Предупреждение: това ще покаже паролата ви на екрана.",
    notificationsRegion: "Известия",
    dismissNotification: "Затвори известието",
    srAnnouncements: "Съобщения за екранен четец",
  },
  nav: {
    mainNavigation: "Главна навигация",
    properties: "Имоти",
    newProperty: "Нов имот",
    profile: "Профил",
    signIn: "Вход",
    signUp: "Регистрация",
    signOut: "Изход",
    apiOnline: "Сървърът е активен",
    apiOffline: "Няма връзка със сървъра",
    apiChecking: "Проверка на сървъра...",
  },
  preferences: {
    languageLabel: "Език",
    languages: {
      "en-US": "English",
      "bg-BG": "Български",
    },
    themeToggleToDark: "Превключи към тъмна тема",
    themeToggleToLight: "Превключи към светла тема",
    themeLabel: "Цветова тема",
    themes: {
      system: "Системна по подразбиране",
      light: "Светла",
      dark: "Тъмна",
    },
  },
  auth: {
    emailLabel: "Имейл адрес",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Парола",
    passwordHint:
      "8–128 символа с главна буква, малка буква, цифра и специален символ.",
    firstNameLabel: "Собствено име",
    lastNameLabel: "Фамилно име",
    tokenLabel: "Код (токен) за потвърждение или нулиране",
    tokenHint:
      "Попълва се автоматично от връзката в имейла или го поставете ръчно.",
    signIn: {
      title: "Вход в профила",
      subtitle: "Управлявайте вашите имоти и настройки на профила.",
      submit: "Вход",
      forgotPasswordLink: "Забравена парола?",
      noAccountPrompt: "Нямате профил?",
      signUpLink: "Създайте профил",
      needVerificationLink: "Имате код за потвърждение на имейл?",
      welcomeNotification: "Успешно влязохте в профила си.",
    },
    signUp: {
      title: "Създаване на профил",
      subtitle: "Регистрирайте се с вашия имейл адрес, за да започнете.",
      submit: "Създай профил",
      hasAccountPrompt: "Вече имате профил?",
      signInLink: "Вход",
      successTitle: "Проверете имейла си",
      successMessage:
        "Ако този имейл може да бъде регистриран, изпратихме връзка за потвърждение. Отворете връзката или поставете кода на страницата за потвърждение.",
      goToVerifyLink: "Към потвърждение на имейл",
    },
    verifyEmail: {
      title: "Потвърждение на имейл адрес",
      subtitle:
        "Потвърдете имейл адреса си, за да активирате входа във вашия профил.",
      verifying: "Потвърждаване на имейл адреса...",
      submit: "Потвърди имейла",
      successTitle: "Имейлът е потвърден",
      successMessage:
        "Вашият имейл адрес беше успешно потвърден. Вече можете да влезете в профила си.",
      proceedToSignIn: "Към страницата за вход",
    },
    forgotPassword: {
      title: "Нулиране на парола",
      subtitle:
        "Въведете имейла на профила си и ще ви изпратим връзка за смяна на паролата.",
      submit: "Изпрати връзка",
      backToSignIn: "Обратно към вход",
      successTitle: "Проверете пощата си",
      successMessage:
        "Ако съществува профил с този имейл, изпратихме връзка за смяна на паролата.",
      goToResetLink: "Въведете кода за смяна ръчно",
    },
    resetPassword: {
      title: "Изберете нова парола",
      subtitle: "Въведете кода за нулиране и изберете сигурна нова парола.",
      newPasswordLabel: "Нова парола",
      submit: "Обнови паролата",
      successTitle: "Паролата е обновена",
      successMessage:
        "Паролата ви беше сменена и имейлът ви е потвърден. Вече можете да влезете.",
      proceedToSignIn: "Вход с новата парола",
    },
  },
  properties: {
    listTitle: "Моите имоти",
    listSubtitle:
      "Преглеждайте, организирайте и избирайте предпочитания си имот.",
    createButton: "Добави имот",
    emptyTitle: "Все още няма добавени имоти",
    emptyDescription:
      "Създайте първия си имот. Първият добавен имот автоматично става ваш предпочитан имот.",
    preferredBadge: "Предпочитан",
    setPreferredButton: "Задай като предпочитан",
    clearPreferredButton: "Премахни предпочитан",
    preferredUpdatedNotification: "Предпочитаният имот е обновен.",
    viewDetailsButton: "Управление",
    createdAtLabel: "Създаден на",
    updatedAtLabel: "Последна промяна",
    fields: {
      nameLabel: "Име на имота",
      nameHint: "Задължително поле, до 100 символа.",
      descriptionLabel: "Описание",
      descriptionHint: "Незадължително резюме, до 1 000 символа.",
      notesLabel: "Лични бележки",
      notesHint: "Незадължителни бележки, до 2 000 символа.",
    },
    create: {
      title: "Добавяне на нов имот",
      subtitle: "Въведете информацията за вашия имот.",
      submit: "Създай имот",
      createdNotification: "Имотът е създаден успешно.",
    },
    detail: {
      title: "Детайли за имота",
      subtitle: "Прегледайте или обновете информацията за този имот.",
      editSectionTitle: "Редактиране на информацията",
      saveChanges: "Запази промените по имота",
      updatedNotification: "Имотът е обновен успешно.",
      deleteButton: "Изтрий имота",
      deleteModalTitle: "Изтриване на този имот?",
      deleteModalDescription:
        "Това действие премахва имота завинаги. Ако той е вашият предпочитан имот, изборът за предпочитан имот ще бъде изчистен автоматично.",
      deleteConfirmButton: "Изтрий завинаги",
      deletedNotification: "Имотът беше изтрит.",
    },
  },
  profile: {
    title: "Профил",
    subtitle: "Управлявайте личните си данни и предпочитания си имот.",
    accountInfoTitle: "Лична информация",
    emailVerifiedBadge: "Потвърден",
    emailUnverifiedBadge: "Непотвърден",
    preferredPropertyLabel: "Предпочитан имот",
    noPreferredPropertyOption: "Няма избран",
    preferredPropertyHint:
      "Изберете основния си имот или изчистете текущия избор.",
    saveChanges: "Запази профила",
    updatedNotification: "Профилът е обновен успешно.",
    memberSinceLabel: "Регистриран на",
  },
  notFound: {
    title: "Страницата не е намерена",
    description:
      "Страницата, която търсите, не съществува или е била преместена.",
    backHome: "Към началната страница",
  },
  errors: {
    topLevel: {
      UNAUTHORIZED: {
        default:
          "Сесията ви е изтекла или изисква вход. Моля, влезте отново.",
        user: "Неуспешно удостоверяване. Моля, влезте отново.",
        invalidCredentials: "Невалиден имейл адрес или парола.",
      },
      FORBIDDEN: {
        default: "Нямате права за извършване на това действие.",
        user: "Моля, потвърдете имейл адреса си преди вход.",
      },
      NOT_FOUND: {
        default: "Заявеният ресурс не беше намерен.",
        route: "Заявеният адрес не съществува.",
        user: "Потребителският профил за този код вече не съществува.",
        property: "Този имот не беше намерен или принадлежи на друг потребител.",
      },
      ALREADY_EXISTS: {
        default: "Запис с тези данни вече съществува.",
        user: "Профил с този имейл адрес вече съществува.",
        property: "Имот с тези данни вече съществува.",
      },
      VALIDATION_ERROR: {
        default: "Моля, проверете отбелязаните полета и опитайте отново.",
      },
      INTERNAL_SERVER_ERROR: {
        default:
          "Възникна неочаквана сървърна грешка. Моля, опитайте отново след малко.",
        user: "Не успяхме да обработим заявката за профила ви в момента. Опитайте по-късно.",
      },
      RATE_LIMITED:
        "Твърде много опити. Моля, изчакайте 10 секунди и опитайте отново.",
      NETWORK_ERROR:
        "Няма връзка със сървъра. Проверете интернет връзката си и опитайте отново.",
    },
    fields: {
      required: "Това поле е задължително.",
      invalid_type: "Въведената стойност е с невалиден формат.",
      too_long: "Стойността надвишава максимално допустимата дължина.",
      nameTooLong: "Името не може да надвишава максималната дължина.",
      descriptionTooLong: "Описанието не може да надвишава 1 000 символа.",
      notesTooLong: "Бележките не могат да надвишават 2 000 символа.",
      emailTooLong: "Имейл адресът не може да надвишава 255 символа.",
      invalid_uuid: "Избраният идентификатор не е валиден.",
      already_exists: "Тази стойност вече се използва.",
      invalid_email: "Моля, въведете валиден имейл адрес.",
      email_not_verified:
        "Имейл адресът ви все още не е потвърден. Проверете пощата си за връзката за потвърждение.",
      password_too_short: "Паролата трябва да бъде поне 8 символа.",
      password_too_long: "Паролата не може да надвишава 128 символа.",
      password_missing_uppercase:
        "Паролата трябва да съдържа поне една главна буква (A–Z).",
      password_missing_lowercase:
        "Паролата трябва да съдържа поне една малка буква (a–z).",
      password_missing_number:
        "Паролата трябва да съдържа поне една цифра (0–9).",
      password_missing_special:
        "Паролата трябва да съдържа поне един специален символ (напр. !@#$%).",
      invalid_or_expired_token:
        "Този код е невалиден, изтекъл или вече е бил използван.",
    },
  },
};
