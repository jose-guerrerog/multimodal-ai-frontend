import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { FILE_CONFIG } from '@/utils/constants';
import { formatFileSize } from '@/utils/format';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  selectedFile?: File | null;
  onRemoveFile?: () => void;
}

export function ImageUpload({
  onFileSelect,
  disabled = false,
  selectedFile,
  onRemoveFile,
}: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': FILE_CONFIG.ALLOWED_IMAGE_TYPES.map(type => `.${type.split('/')[1]}`)
    },
    maxSize: FILE_CONFIG.MAX_SIZE_MB * 1024 * 1024,
    multiple: false,
    disabled,
  });

  if (selectedFile) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium">Selected Image</h4>
            {onRemoveFile && (
              <button
                onClick={onRemoveFile}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {selectedFile.name}
              </p>
              <p className="text-gray-400 text-xs">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
        {
          'border-blue-400 bg-blue-400/10': isDragActive && !isDragReject,
          'border-red-400 bg-red-400/10': isDragReject,
          'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30': !isDragActive && !disabled,
          'border-slate-700 cursor-not-allowed opacity-50': disabled,
        }
      )}
    >
      <input {...getInputProps()} />
      <motion.div
        animate={{ scale: isDragActive ? 1.05 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <Upload className={cn(
          'w-12 h-12 mx-auto mb-4',
          {
            'text-blue-400': isDragActive && !isDragReject,
            'text-red-400': isDragReject,
            'text-purple-400': !isDragActive && !isDragReject,
          }
        )} />
        <p className="text-white text-lg font-medium mb-2">
          {isDragActive
            ? isDragReject
              ? 'Invalid file type!'
              : 'Drop your image here!'
            : 'Upload an image to analyze'
          }
        </p>
        <p className="text-gray-400 text-sm">
          Supports JPEG, PNG, WebP • Max {FILE_CONFIG.MAX_SIZE_MB}MB
        </p>
      </motion.div>
    </div>
  );
}