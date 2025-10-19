import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface BannerBioStepProps {
  onNext: (data: { coverImage?: File; bio: string }) => void;
  onBack: () => void;
  onClose: () => void;
  initialData?: { coverImage?: File; bio?: string };
}

export function BannerBioStep({ onNext, onBack, onClose, initialData }: BannerBioStepProps) {
  const [bio, setBio] = useState(initialData?.bio || '');
  const [coverImage, setCoverImage] = useState<File | null>(initialData?.coverImage || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { validateImage, createImagePreview } = useImageUpload();

  const handleImageSelect = async (file: File) => {
    // Validate image
    const validationError = validateImage(file, { type: 'cover', maxSizeMB: 10 });
    if (validationError) {
      setErrors(prev => ({ ...prev, coverImage: validationError }));
      return;
    }

    // Clear previous errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.coverImage;
      return newErrors;
    });

    // Set image and create preview
    setCoverImage(file);
    const preview = await createImagePreview(file);
    setPreviewUrl(preview);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleContinue = () => {
    onNext({
      coverImage: coverImage || undefined,
      bio: bio.trim(),
    });
  };

  const handleSkip = () => {
    onNext({
      bio: bio.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-black border-b dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-gray-600 dark:text-gray-400"
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>

          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Banner e biografia</h1>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400"
            data-testid="button-close"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-6">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Define o banner e a bio
          </h2>
        </div>

        {/* Banner Upload */}
        <div className="mb-8">
          <Label className="text-base font-medium mb-3 block">Banner</Label>
          <div
            className="w-full h-32 bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            data-testid="banner-upload"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Banner preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Upload className="w-4 h-4" />
                  <span>Clique para adicionar banner</span>
                </div>
              </div>
            )}
          </div>
          
          {errors.coverImage && (
            <p className="text-sm text-red-500 mt-2">{errors.coverImage}</p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* Bio Field */}
        <div className="space-y-2 mb-8">
          <Label htmlFor="bio">Era</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Conte um pouco sobre você e o tipo de conteúdo que você cria..."
            rows={6}
            className="resize-none"
            data-testid="input-bio"
          />
        </div>

        {/* Continue Button */}
        <div className="mt-auto space-y-3">
          <Button
            onClick={handleContinue}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white border-0"
            data-testid="button-continue"
          >
            Continuar
          </Button>
          
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="w-full text-gray-600 dark:text-gray-400"
            data-testid="button-skip"
          >
            Saltar por agora
          </Button>
        </div>
      </main>
    </div>
  );
}
