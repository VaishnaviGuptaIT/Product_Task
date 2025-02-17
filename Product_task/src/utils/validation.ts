
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MOBILE: /^[0-9]{10}$/,
  PASSWORD_LOWERCASE: /[a-z]/,
  PASSWORD_UPPERCASE: /[A-Z]/,
  PASSWORD_DIGIT: /\d/,
  PASSWORD_SPECIAL: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
  NO_SPACES: /\s/,
};

export const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  MIN_LENGTH: (field: string, length: number) =>
    `${field} must be at least ${length} characters`,
  MAX_LENGTH: (field: string, length: number) =>
    `${field} must not exceed ${length} characters`,
  NO_SPACES: (field: string) => `${field} cannot contain spaces`,
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_MOBILE: "Please enter a valid 10-digit mobile number",
  PASSWORD_REQUIREMENTS: {
    LOWERCASE: "Password must contain at least one lowercase letter",
    UPPERCASE: "Password must contain at least one uppercase letter",
    DIGIT: "Password must contain at least one number",
    SPECIAL: "Password must contain at least one special character",
  },
  PASSWORDS_DO_NOT_MATCH: "Passwords do not match",
  EMAIL_EXISTS: "This email is already registered. Please use a different one.",
  USER_LIMIT_REACHED: "Registration limit reached. Maximum of 5 users allowed.",
  GENERAL_ERROR: "Something went wrong. Please try again later.",
  INVALID_CREDENTIALS: "Invalid email or password",
};


export const getValidationRules = {
  name: (fieldName: string) => ({
    required: VALIDATION_MESSAGES.REQUIRED(fieldName),
    minLength: {
      value: 2,
      message: VALIDATION_MESSAGES.MIN_LENGTH(fieldName, 2),
    },
    validate: {
      noSpaces: (value: string) =>
        !VALIDATION_PATTERNS.NO_SPACES.test(value) ||
        VALIDATION_MESSAGES.NO_SPACES(fieldName),
    },
  }),

  email: {
    required: VALIDATION_MESSAGES.REQUIRED("Email"),
    pattern: {
      value: VALIDATION_PATTERNS.EMAIL,
      message: VALIDATION_MESSAGES.INVALID_EMAIL,
    },
    validate: {
      noSpaces: (value: string) =>
        !VALIDATION_PATTERNS.NO_SPACES.test(value) ||
        VALIDATION_MESSAGES.NO_SPACES("Email"),
    },
  },

  mobile: {
    required: VALIDATION_MESSAGES.REQUIRED("Mobile number"),
    pattern: {
      value: VALIDATION_PATTERNS.MOBILE,
      message: VALIDATION_MESSAGES.INVALID_MOBILE,
    },
    validate: {
      noSpaces: (value: string) =>
        !VALIDATION_PATTERNS.NO_SPACES.test(value) ||
        VALIDATION_MESSAGES.NO_SPACES("Mobile number"),
    },
  },

  password: {
    required: VALIDATION_MESSAGES.REQUIRED("Password"),
    minLength: {
      value: 8,
      message: VALIDATION_MESSAGES.MIN_LENGTH("Password", 8),
    },
    maxLength: {
      value: 32,
      message: VALIDATION_MESSAGES.MAX_LENGTH("Password", 32),
    },
    validate: {
      noSpaces: (value: string) =>
        !VALIDATION_PATTERNS.NO_SPACES.test(value) ||
        VALIDATION_MESSAGES.NO_SPACES("Password"),
      lowercase: (value: string) =>
        VALIDATION_PATTERNS.PASSWORD_LOWERCASE.test(value) ||
        VALIDATION_MESSAGES.PASSWORD_REQUIREMENTS.LOWERCASE,
      uppercase: (value: string) =>
        VALIDATION_PATTERNS.PASSWORD_UPPERCASE.test(value) ||
        VALIDATION_MESSAGES.PASSWORD_REQUIREMENTS.UPPERCASE,
      digit: (value: string) =>
        VALIDATION_PATTERNS.PASSWORD_DIGIT.test(value) ||
        VALIDATION_MESSAGES.PASSWORD_REQUIREMENTS.DIGIT,
      specialChar: (value: string) =>
        VALIDATION_PATTERNS.PASSWORD_SPECIAL.test(value) ||
        VALIDATION_MESSAGES.PASSWORD_REQUIREMENTS.SPECIAL,
    },
  },
};

export const inputHandlers = {
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  },

  handlePaste: (
    e: React.ClipboardEvent<HTMLInputElement>,
    field: string,
    setValue: Function,
    getValues: Function
  ) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").replace(/\s/g, "");
    setValue(field, getValues(field) + pastedText);
  },

  handleMobileInput: (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLInputElement>,
    setValue: Function
  ) => {
    if ("key" in e) {
      if (
        !/^\d$/.test(e.key) &&
        !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(
          e.key
        )
      ) {
        e.preventDefault();
      }
      if (/^\d$/.test(e.key) && e.currentTarget.value.length >= 10) {
        e.preventDefault();
      }
    } else {
      const value = e.target.value.replace(/\D/g, "").slice(0, 10);
      setValue("mobile", value);
    }
  },

  handleMobilePaste: (
    e: React.ClipboardEvent<HTMLInputElement>,
    setValue: Function
  ) => {
    e.preventDefault();
    const pastedText = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 10);
    setValue("mobile", pastedText);
  },
};

export const handleFormError = (error: any, toast: any) => {
  console.error("Form error:", error);
  toast.error(error.message || VALIDATION_MESSAGES.GENERAL_ERROR);
};
