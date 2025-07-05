import { AppError } from '@/types';

export const createError = (
  message: string, 
  type: AppError['type'] = 'api', 
  code?: string
): AppError => ({
  message,
  type,
  code,
  timestamp: new Date().toISOString(),
});

export const handleApiError = (error: any): AppError => {
  if (error.response?.data?.detail) {
    return createError(error.response.data.detail, 'api');
  }
  
  if (error.message) {
    return createError(error.message, 'network');
  }
  
  return createError('An unexpected error occurred', 'api');
};

export const handleFileError = (error: string): AppError => {
  return createError(error, 'upload');
};

export const handleValidationError = (error: string): AppError => {
  return createError(error, 'validation');
};