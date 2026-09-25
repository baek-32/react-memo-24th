export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message: null;
};

export type ApiErrorResponse = {
  success: false;
  data: null;
  message: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
