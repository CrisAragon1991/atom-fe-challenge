export type GeneralResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};