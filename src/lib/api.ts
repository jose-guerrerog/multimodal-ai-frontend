import apiClient from '@/utils/api';
import { 
  ImageAnalysisResult,
  TextAnalysisRequest,
  TextAnalysisResult,
  ChatRequest,
  ChatResponse,
  Conversation,
  ConversationSummary,
  HealthCheckResponse
} from '@/types';

// Health Check API
export const healthApi = {
  check: async (): Promise<HealthCheckResponse> => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

// Image Analysis API
export const imageApi = {
  analyze: async (file: File): Promise<ImageAnalysisResult> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/images/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};

// Text Analysis API
export const textApi = {
  analyze: async (request: TextAnalysisRequest): Promise<TextAnalysisResult> => {
    const response = await apiClient.post('/text/analyze', request);
    return response.data;
  },
};

// Chat API
export const chatApi = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post('/chat/message', request);
    return response.data;
  },
  
  getConversation: async (conversationId: string): Promise<Conversation> => {
    const response = await apiClient.get(`/chat/conversations/${conversationId}`);
    return response.data;
  },
  
  listConversations: async (): Promise<ConversationSummary[]> => {
    const response = await apiClient.get('/chat/conversations');
    return response.data;
  },
  
  deleteConversation: async (conversationId: string): Promise<void> => {
    await apiClient.delete(`/chat/conversations/${conversationId}`);
  },
  
  getStats: async (): Promise<any> => {
    const response = await apiClient.get('/chat/stats');
    return response.data;
  },
};

// Combined API object
export const api = {
  health: healthApi,
  image: imageApi,
  text: textApi,
  chat: chatApi,
};