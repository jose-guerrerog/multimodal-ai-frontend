'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  MessageSquare, 
  ImageIcon, 
  FileText, 
  Sparkles,
  Brain,
  Send,
  X,
  Check,
  Loader2,
  Download
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Types
interface AnalysisResult {
  success: boolean;
  analysis: any;
  filename?: string;
  processing_time?: string;
  analysis_type?: string;
}

interface ChatMessage {
  user: string;
  ai: string;
  timestamp: string;
}

// Main App Component
export default function AIVisionHub() {
  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'chat'>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [textInput, setTextInput] = useState('');
  const [analysisType, setAnalysisType] = useState<'sentiment' | 'summary' | 'comprehensive'>('comprehensive');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);

  // File Upload Handler
  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_BASE_URL}/images/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAnalysisResult(response.data);
    } catch (error) {
      console.error('Image analysis failed:', error);
      setAnalysisResult({
        success: false,
        analysis: { error: 'Failed to analyze image. Please try again.' }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Text Analysis Handler
  const analyzeText = async () => {
    if (!textInput.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/text/analyze`, {
        text: textInput,
        analysis_type: analysisType
      });

      setAnalysisResult(response.data);
    } catch (error) {
      console.error('Text analysis failed:', error);
      setAnalysisResult({
        success: false,
        analysis: { error: 'Failed to analyze text. Please try again.' }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Chat Handler
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput('');

    try {
      const response = await axios.post(`${API_BASE_URL}/chat/message`, {
        message: userMessage,
        context: analysisResult ? JSON.stringify(analysisResult.analysis) : '',
        conversation_id: conversationId
      });

      const newMessage: ChatMessage = {
        user: userMessage,
        ai: response.data.response,
        timestamp: response.data.timestamp
      };

      setChatMessages(prev => [...prev, newMessage]);
      setConversationId(response.data.conversation_id);
    } catch (error) {
      console.error('Chat failed:', error);
    }
  };

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI Vision Hub</h1>
                <p className="text-sm text-gray-400">Multi-modal AI Analysis Platform</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                ✓ Connected
              </span>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Navigation */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Analysis Tools</h3>
              <nav className="space-y-2">
                <TabButton
                  icon={ImageIcon}
                  label="Image Analysis"
                  description="Upload and analyze images"
                  isActive={activeTab === 'upload'}
                  onClick={() => setActiveTab('upload')}
                />
                <TabButton
                  icon={FileText}
                  label="Text Analysis"
                  description="Analyze text content"
                  isActive={activeTab === 'text'}
                  onClick={() => setActiveTab('text')}
                />
                <TabButton
                  icon={MessageSquare}
                  label="AI Chat"
                  description="Chat about your content"
                  isActive={activeTab === 'chat'}
                  onClick={() => setActiveTab('chat')}
                />
              </nav>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-slate-700">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Session Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Images Analyzed</span>
                    <span className="text-white">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Texts Processed</span>
                    <span className="text-white">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Chat Messages</span>
                    <span className="text-white">{chatMessages.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
              <AnimatePresence mode="wait">
                {activeTab === 'upload' && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6"
                  >
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2 text-purple-400" />
                      Image Analysis
                    </h2>

                    {/* Upload Area */}
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                        isDragActive
                          ? 'border-purple-400 bg-purple-400/10'
                          : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <p className="text-white text-lg font-medium mb-2">
                        {isDragActive ? 'Drop your image here!' : 'Upload an image to analyze'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Supports JPEG, PNG, WebP • Max 10MB
                      </p>
                    </div>

                    {/* Analysis Results */}
                    <AnalysisResults 
                      isAnalyzing={isAnalyzing} 
                      result={analysisResult} 
                      type="image"
                    />
                  </motion.div>
                )}

                {activeTab === 'text' && (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6"
                  >
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-400" />
                      Text Analysis
                    </h2>

                    {/* Analysis Type Selector */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Analysis Type
                      </label>
                      <select
                        value={analysisType}
                        onChange={(e) => setAnalysisType(e.target.value as any)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="comprehensive">Comprehensive Analysis</option>
                        <option value="sentiment">Sentiment Analysis</option>
                        <option value="summary">Summary & Key Points</option>
                      </select>
                    </div>

                    {/* Text Input */}
                    <div className="mb-4">
                      <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Enter your text here for AI analysis..."
                        className="w-full h-32 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        maxLength={10000}
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {textInput.length}/10,000 characters
                        </span>
                        <button
                          onClick={analyzeText}
                          disabled={!textInput.trim() || isAnalyzing}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Analyze Text
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Analysis Results */}
                    <AnalysisResults 
                      isAnalyzing={isAnalyzing} 
                      result={analysisResult} 
                      type="text"
                    />
                  </motion.div>
                )}

                {activeTab === 'chat' && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 h-96 flex flex-col"
                  >
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-green-400" />
                      AI Chat Assistant
                    </h2>

                    {/* Chat Messages */}
                    <div className="flex-1 bg-slate-700/30 rounded-lg p-4 mb-4 overflow-y-auto">
                      {chatMessages.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">
                          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>Start a conversation with the AI assistant!</p>
                          <p className="text-sm mt-1">You can ask about analyzed content or anything else.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {chatMessages.map((msg, index) => (
                            <div key={index}>
                              <div className="bg-blue-600 text-white p-3 rounded-lg ml-8 mb-2">
                                {msg.user}
                              </div>
                              <div className="bg-slate-600 text-white p-3 rounded-lg mr-8">
                                {msg.ai}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                        placeholder="Ask the AI about your content or anything else..."
                        className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={sendChatMessage}
                        disabled={!chatInput.trim()}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({ icon: Icon, label, description, isActive, onClick }: {
  icon: any;
  label: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-all ${
        isActive
          ? 'bg-purple-600/20 border border-purple-500/30 text-white'
          : 'hover:bg-slate-700/50 text-gray-300'
      }`}
    >
      <div className="flex items-start space-x-3">
        <Icon className={`w-5 h-5 mt-0.5 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
        <div>
          <div className="font-medium">{label}</div>
          <div className="text-xs text-gray-400 mt-1">{description}</div>
        </div>
      </div>
    </button>
  );
}

// Analysis Results Component
function AnalysisResults({ isAnalyzing, result, type }: {
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  type: 'image' | 'text';
}) {
  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 bg-slate-700/30 rounded-lg p-6"
      >
        <div className="flex items-center justify-center space-x-3">
          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          <span className="text-white">Analyzing with Google Gemini AI...</span>
        </div>
      </motion.div>
    );
  }

  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 bg-slate-700/30 rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          {result.success ? (
            <>
              <Check className="w-5 h-5 text-green-400 mr-2" />
              Analysis Complete
            </>
          ) : (
            <>
              <X className="w-5 h-5 text-red-400 mr-2" />
              Analysis Failed
            </>
          )}
        </h3>
        {result.processing_time && (
          <span className="text-sm text-gray-400">
            {result.processing_time}
          </span>
        )}
      </div>

      {result.success ? (
        <div className="space-y-4">
          {type === 'image' && result.analysis.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Description</h4>
              <p className="text-white">{result.analysis.description}</p>
            </div>
          )}

          {result.analysis.objects && Array.isArray(result.analysis.objects) && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Objects Detected</h4>
              <div className="flex flex-wrap gap-2">
                {result.analysis.objects.map((obj: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-sm">
                    {obj}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.analysis.sentiment && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Sentiment Analysis</h4>
              <div className="bg-slate-600/50 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white capitalize">{result.analysis.sentiment.overall}</span>
                  <span className="text-green-400">{(result.analysis.sentiment.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-600">
            <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
              <Download className="w-4 h-4 mr-1" />
              Export Results
            </button>
          </div>
        </div>
      ) : (
        <div className="text-red-400">
          {result.analysis.error || 'Analysis failed. Please try again.'}
        </div>
      )}
    </motion.div>
  );
}