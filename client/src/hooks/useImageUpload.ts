import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface UploadOptions {
  type: 'profile' | 'cover';
  maxSizeMB?: number;
  allowedTypes?: string[];
}

interface UploadResult {
  url: string;
  filename: string;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = async (
    file: File,
    options: UploadOptions
  ): Promise<UploadResult> => {
    const { type, maxSizeMB = 10, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options;

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo não suportado. Use JPG, PNG ou WEBP.');
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`);
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', type);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await apiRequest('POST', '/api/upload/image', formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao fazer upload da imagem');
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer upload da imagem');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const validateImage = (file: File, options: UploadOptions): string | null => {
    const { maxSizeMB = 10, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options;

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return 'Tipo de arquivo não suportado. Use JPG, PNG ou WEBP.';
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`;
    }

    return null;
  };

  const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return {
    uploadImage,
    validateImage,
    createImagePreview,
    isUploading,
    uploadProgress,
  };
}
