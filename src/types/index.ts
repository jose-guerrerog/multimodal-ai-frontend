export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Image Analysis Types
export interface ImageAnalysisResult {
  success: boolean;
  filename: string;
  analysis: ImageAnalysisData;
  processing_time: string;
  file_size?: number;
}

export interface ImageAnalysisData {
  description: string;
  objects: string[];
  colors: string[];
  text_detected: string;
  mood: string;
  composition: string;
  suggestions: string;
  confidence: number;
  image_info?: {
    width: number;
    height: number;
    format: string;
    mode: string;
    size_mb: number;
  };
}

// Text Analysis Types
export type TextAnalysisType = 'sentiment' | 'summary' | 'comprehensive';

export interface TextAnalysisRequest {
  text: string;
  analysis_type: TextAnalysisType;
}

export interface TextAnalysisResult {
  success: boolean;
  analysis_type: string;
  analysis: TextAnalysisData;
  word_count: number;
  character_count: number;
  processing_time: string;
}

export interface TextAnalysisData {
  // Sentiment Analysis
  sentiment?: {
    overall: 'positive' | 'negative' | 'neutral';
    confidence: number;
    emotions: string[];
  };
  
  // Summary Analysis
  summary?: string;
  key_points?: string[];
  themes?: string[];
  
  // Comprehensive Analysis
  key_topics?: string[];
  writing_style?: string;
  readability?: 'easy' | 'moderate' | 'difficult';
  target_audience?: string;
  intent?: string;
  entities?: string[];
  suggestions?: string;
  
  // Common fields
  overall_sentiment?: string;
  confidence_score?: number;
  emotions?: string[];
  key_phrases?: string[];
  tone?: string;
  subjectivity?: string;
  intensity?: string;
}

// Chat Types
export interface ChatMessage {
  user: string;
  ai: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  context?: string;
  conversation_id?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  timestamp: string;
}

export interface Conversation {
  conversation_id: string;
  messages: ChatMessage[];
  created_at: string;
  last_activity: string;
}

export interface ConversationSummary {
  conversation_id: string;
  message_count: number;
  created_at: string;
  last_activity: string;
  preview: string;
}

// UI State Types
export type TabType = 'upload' | 'text' | 'chat';

export interface AppState {
  activeTab: TabType;
  isAnalyzing: boolean;
  analysisResult: ImageAnalysisResult | TextAnalysisResult | null;
  chatMessages: ChatMessage[];
  conversationId: string | null;
}

// Component Props Types
export interface TabButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}

export interface AnalysisResultsProps {
  isAnalyzing: boolean;
  result: ImageAnalysisResult | TextAnalysisResult | null;
  type: 'image' | 'text';
}

// Upload Types
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploadState {
  isUploading: boolean;
  progress: UploadProgress | null;
  error: string | null;
}

// Health Check Types
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  gemini_api: 'connected' | 'disconnected';
  timestamp: string;
  version: string;
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  timestamp: string;
  type: 'api' | 'upload' | 'validation' | 'network';
}