// src/types/api.type.ts

// ✅ Generic API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

// ✅ Untuk pagination (optional)
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ✅ Response pagination
export interface ApiPaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
  message?: string;
  success?: boolean;
}

// ✅ Error response (Laravel biasanya seperti ini)
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
