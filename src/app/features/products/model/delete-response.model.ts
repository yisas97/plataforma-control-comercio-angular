export interface DeleteProductResponse {
  success: boolean;
  message: string;
  errorCode?: string;
  markedInactive?: boolean;
  deleted?: boolean;
}

export interface ReactivateProductResponse {
  success: boolean;
  message: string;
  reactivated?: boolean;
}
