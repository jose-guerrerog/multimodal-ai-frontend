import { useCallback } from 'react';
import { useApi } from './useApi';
import { api } from '@/lib/api';
import { ImageAnalysisResult } from '@/types';
import { validateFileType, validateFileSize } from '@/utils/validation';
import { FILE_CONFIG } from '@/utils/constants';
import { handleFileError } from '@/utils/errors';

export function useImageAnalysis() {
  const apiHook = useApi<ImageAnalysisResult>(api.image.analyze);

  const analyzeImage = useCallback(async (file: File): Promise<ImageAnalysisResult | null> => {
    // Validate file type
    if (!validateFileType(file, FILE_CONFIG.ALLOWED_IMAGE_TYPES)) {
      apiHook.reset();
      const error = handleFileError('Invalid file type. Please upload JPEG, PNG, or WebP images.');
      return null;
    }

    // Validate file size
    if (!validateFileSize(file, FILE_CONFIG.MAX_SIZE_MB)) {
      apiHook.reset();
      const error = handleFileError(`File too large. Maximum size is ${FILE_CONFIG.MAX_SIZE_MB}MB.`);
      return null;
    }

    return await apiHook.execute(file);
  }, [apiHook]);

  return {
    ...apiHook,
    analyzeImage,
  };
}
