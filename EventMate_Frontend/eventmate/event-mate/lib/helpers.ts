export const validatePassword = (password: string, confirmPassword: string) => {
    return {
      length: password.length >= 8 && password.length <= 32,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPassword && password.length > 0,
    };
  };
  