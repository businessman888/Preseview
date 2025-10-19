import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, ArrowLeft, Camera, Upload } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ProfilePhotoStepProps {
  onNext: (data: { profilePicture?: File; displayName: string; username: string }) => void;
  onBack: () => void;
  onClose: () => void;
  initialData?: { profilePicture?: File; displayName?: string; username?: string };
}

export function ProfilePhotoStep({ onNext, onBack, onClose, initialData }: ProfilePhotoStepProps) {
  const [displayName, setDisplayName] = useState(initialData?.displayName || '');
  const [username, setUsername] = useState(initialData?.username || '');
  const [profilePicture, setProfilePicture] = useState<File | null>(initialData?.profilePicture || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { validateImage, createImagePreview } = useImageUpload();

  const handleImageSelect = async (file: File) => {
    // Validate image
    const validationError = validateImage(file, { type: 'profile', maxSizeMB: 5 });
    if (validationError) {
      setErrors(prev => ({ ...prev, profilePicture: validationError }));
      return;
    }

    // Clear previous errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.profilePicture;
      return newErrors;
    });

    // Set image and create preview
    setProfilePicture(file);
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!displayName.trim()) {
      newErrors.displayName = 'Nome de exibição é obrigatório';
    } else if (displayName.trim().length < 2) {
      newErrors.displayName = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!username.trim()) {
      newErrors.username = 'Username é obrigatório';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username deve ter pelo menos 3 caracteres';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(username.trim())) {
      newErrors.username = 'Username pode conter apenas letras, números, _ e -';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      onNext({
        profilePicture: profilePicture || undefined,
        displayName: displayName.trim(),
        username: username.trim(),
      });
    }
  };

  const handleSkip = () => {
    if (validateForm()) {
      onNext({
        displayName: displayName.trim(),
        username: username.trim(),
      });
    }
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

          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Foto de perfil e @handle</h1>

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
            Define a tua foto de perfil e @handle
          </h2>
        </div>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            data-testid="profile-picture-upload"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="text-center">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Selecionar</span>
              </div>
            )}
          </div>
          
          {errors.profilePicture && (
            <p className="text-sm text-red-500 mt-2">{errors.profilePicture}</p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">Nome de exibição</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Superb Aardvark"
              className={errors.displayName ? 'border-red-500' : ''}
              data-testid="input-display-name"
            />
            {errors.displayName && (
              <p className="text-sm text-red-500">{errors.displayName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Líder</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="superb-aardvark-79"
              className={errors.username ? 'border-red-500' : ''}
              data-testid="input-username"
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username}</p>
            )}
          </div>
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
