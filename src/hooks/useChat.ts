import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import { api } from '@/lib/api';
import { ChatMessage, ChatRequest, ChatResponse } from '@/types';
import { validateTextLength } from '@/utils/validation';
import { TEXT_LIMITS } from '@/utils/constants';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const apiHook = useApi<ChatResponse>(api.chat.sendMessage);

  const sendMessage = useCallback(async (
    message: string, 
    context?: string
  ): Promise<boolean> => {
    // Validate message length
    if (!validateTextLength(message, TEXT_LIMITS.CHAT_MESSAGE_MAX)) {
      return false;
    }

    if (message.trim().length < TEXT_LIMITS.MIN_LENGTH) {
      return false;
    }

    const request: ChatRequest = {
      message: message.trim(),
      context,
      conversation_id: conversationId || undefined,
    };

    const response = await apiHook.execute(request);
    
    if (response) {
      const newMessage: ChatMessage = {
        user: message,
        ai: response.response,
        timestamp: response.timestamp,
      };
      
      setMessages(prev => [...prev, newMessage]);
      setConversationId(response.conversation_id);
      return true;
    }
    
    return false;
  }, [apiHook, conversationId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    apiHook.reset();
  }, [apiHook]);

  return {
    messages,
    conversationId,
    loading: apiHook.loading,
    error: apiHook.error,
    sendMessage,
    clearMessages,
  };
}