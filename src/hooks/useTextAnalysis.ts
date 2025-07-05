import { useCallback } from 'react';
import { useApi } from './useApi';
import { api } from '@/lib/api';
import { TextAnalysisRequest, TextAnalysisResult } from '@/types';
import { validateTextLength } from '@/utils/validation';
import { TEXT_LIMITS } from '@/utils/constants';
import { handleValidationError } from '@/utils/errors';

export function useTextAnalysis() {
  const apiHook = useApi<TextAnalysisResult>(api.text.analyze);

  const analyzeText = useCallback(async (request: TextAnalysisRequest): Promise<TextAnalysisResult | null> => {
    // Validate text length
    if (!validateTextLength(request.text, TEXT_LIMITS.MAX_LENGTH)) {
      const error = handleValidationError(`Text too long. Maximum length is ${TEXT_LIMITS.MAX_LENGTH} characters.`);
      return null;
    }

    if (request.text.trim().length < TEXT_LIMITS.MIN_LENGTH) {
      const error = handleValidationError('Text cannot be empty.');
      return null;
    }

    return await apiHook.execute(request);
  }, [apiHook]);

  return {
    ...apiHook,
    analyzeText,
  };
}
