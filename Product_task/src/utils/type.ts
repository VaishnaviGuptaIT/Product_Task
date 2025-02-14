
export interface AuthSlice {
  isAuth: boolean;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
}
export interface SignupFormInputs extends User {
  confirmPassword: string;
}
export interface LoginInputs {
  email: string;
  password: string;
}
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  thumbnail: string;
  rating: number;
  discountPercentage: number;
}
export interface ProfileFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

export interface PasswordFormInputs {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
