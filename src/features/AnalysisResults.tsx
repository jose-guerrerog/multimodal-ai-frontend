import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Download, Eye, Palette, Type, Lightbulb } from 'lucide-react';
import { ImageAnalysisResult, TextAnalysisResult } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadSpinner';

interface AnalysisResultsProps {
  isAnalyzing: boolean;
  result: ImageAnalysisResult | TextAnalysisResult | null;
  type: 'image' | 'text';
}

export function AnalysisResults({ isAnalyzing, result, type }: AnalysisResultsProps) {
  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <Card className="p-6">
          <LoadingSpinner 
            size="lg" 
            text="Analyzing with Google Gemini AI..." 
            className="justify-center"
          />
        </Card>
      </motion.div>
    );
  }

  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6"
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
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
          <div className="flex items-center space-x-3">
            {result.processing_time && (
              <Badge variant="info" size="sm">
                {result.processing_time}
              </Badge>
            )}
            {result.success && (
              <Button
                variant="ghost"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={() => {
                  const dataStr = JSON.stringify(result, null, 2);
                  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                  const exportFileDefaultName = `analysis-results-${Date.now()}.json`;
                  
                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUri);
                  linkElement.setAttribute('download', exportFileDefaultName);
                  linkElement.click();
                }}
              >
                Export
              </Button>
            )}
          </div>
        </div>

        {result.success ? (
          <div className="space-y-6">
            {type === 'image' && (
              <ImageAnalysisDisplay result={result as ImageAnalysisResult} />
            )}
            {type === 'text' && (
              <TextAnalysisDisplay result={result as TextAnalysisResult} />
            )}
          </div>
        ) : (
          <div className="text-red-400 bg-red-600/10 border border-red-600/20 rounded-lg p-4">
            Analysis failed. Please try again.
          </div>
        )}
      </Card>
    </motion.div>
  );
}

function ImageAnalysisDisplay({ result }: { result: ImageAnalysisResult }) {
  const { analysis } = result;

  return (
    <div className="space-y-6">
      {/* Description */}
      {analysis.description && (
        <div>
          <h4 className="text-white font-medium mb-3 flex items-center">
            <Eye className="w-4 h-4 mr-2 text-blue-400" />
            Visual Description
          </h4>
          <p className="text-gray-300 leading-relaxed">{analysis.description}</p>
        </div>
      )}

      {/* Objects Detected */}
      {analysis.objects && Array.isArray(analysis.objects) && analysis.objects.length > 0 && (
        <div>
          <h4 className="text-white font-medium mb-3">Objects Detected</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.objects.map((obj: string, index: number) => (
              <Badge key={index} variant="info">
                {obj}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {analysis.colors && Array.isArray(analysis.colors) && analysis.colors.length > 0 && (
        <div>
          <h4 className="text-white font-medium mb-3 flex items-center">
            <Palette className="w-4 h-4 mr-2 text-purple-400" />
            Dominant Colors
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.colors.map((color: string, index: number) => (
              <Badge key={index} variant="default">
                {color}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Text Detected */}
      {analysis.text_detected && (
        <div>
          <h4 className="text-white font-medium mb-3 flex items-center">
            <Type className="w-4 h-4 mr-2 text-green-400" />
            Text Detected
          </h4>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-gray-300">{analysis.text_detected}</p>
          </div>
        </div>
      )}

      {/* Mood & Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysis.mood && (
          <div>
            <h4 className="text-white font-medium mb-2">Mood & Atmosphere</h4>
            <p className="text-gray-300 text-sm">{analysis.mood}</p>
          </div>
        )}
        {analysis.suggestions && (
          <div>
            <h4 className="text-white font-medium mb-2 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
              Suggestions
            </h4>
            <p className="text-gray-300 text-sm">{analysis.suggestions}</p>
          </div>
        )}
      </div>

      {/* Confidence Score */}
      {analysis.confidence && (
        <div>
          <h4 className="text-white font-medium mb-2">Confidence Score</h4>
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Accuracy</span>
              <span className="text-green-400 font-medium">
                {(analysis.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 bg-slate-600 rounded-full h-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysis.confidence * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Text Analysis Display Component
function TextAnalysisDisplay({ result }: { result: TextAnalysisResult }) {
  const { analysis, word_count, character_count } = result;

  return (
    <div className="space-y-6">
      {/* Text Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Word Count</p>
          <p className="text-white text-2xl font-bold">{word_count}</p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Characters</p>
          <p className="text-white text-2xl font-bold">{character_count}</p>
        </div>
      </div>

      {/* Sentiment Analysis */}
      {analysis.sentiment && (
        <div>
          <h4 className="text-white font-medium mb-3">Sentiment Analysis</h4>
          <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Overall Sentiment</span>
              <Badge 
                variant={
                  analysis.sentiment.overall === 'positive' ? 'success' :
                  analysis.sentiment.overall === 'negative' ? 'error' : 'default'
                }
              >
                {analysis.sentiment.overall}
              </Badge>
            </div>
            {analysis.sentiment.confidence && (
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Confidence</span>
                <span className="text-green-400 font-medium">
                  {(analysis.sentiment.confidence * 100).toFixed(1)}%
                </span>
              </div>
            )}
            {analysis.sentiment.emotions && (
              <div>
                <span className="text-gray-300 text-sm block mb-2">Emotions</span>
                <div className="flex flex-wrap gap-1">
                  {analysis.sentiment.emotions.map((emotion, index) => (
                    <Badge key={index} variant="info" size="sm">
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      {analysis.summary && (
        <div>
          <h4 className="text-white font-medium mb-3">Summary</h4>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
          </div>
        </div>
      )}

      {/* Key Topics */}
      {analysis.key_topics && Array.isArray(analysis.key_topics) && (
        <div>
          <h4 className="text-white font-medium mb-3">Key Topics</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.key_topics.map((topic, index) => (
              <Badge key={index} variant="default">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Additional Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysis.writing_style && (
          <div>
            <h4 className="text-white font-medium mb-2">Writing Style</h4>
            <p className="text-gray-300 text-sm">{analysis.writing_style}</p>
          </div>
        )}
        {analysis.readability && (
          <div>
            <h4 className="text-white font-medium mb-2">Readability</h4>
            <Badge 
              variant={
                analysis.readability === 'easy' ? 'success' :
                analysis.readability === 'difficult' ? 'warning' : 'default'
              }
            >
              {analysis.readability}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}