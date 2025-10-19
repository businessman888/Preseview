import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ProgressDots } from "@/components/ProgressDots";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Import steps
import { PasswordStep } from "./register-creator/steps/PasswordStep";
import { GenderStep } from "./become-creator/steps/GenderStep";
import { ProfilePhotoStep } from "./become-creator/steps/ProfilePhotoStep";
import { BannerBioStep } from "./become-creator/steps/BannerBioStep";
import { SubscriptionPriceStep } from "./become-creator/steps/SubscriptionPriceStep";
import { VerificationStep } from "./become-creator/steps/VerificationStep";

interface FormData {
  name?: string;
  email?: string;
  password?: string;
  gender?: string;
  profilePicture?: File;
  displayName?: string;
  username?: string;
  coverImage?: File;
  bio?: string;
  subscriptionPrice?: number;
  verificationStatus?: string;
  verificationSkipped?: boolean;
}

const STEPS = [
  { id: 0, component: PasswordStep, title: 'Dados de acesso' },
  { id: 1, component: GenderStep, title: 'Gênero' },
  { id: 2, component: ProfilePhotoStep, title: 'Foto de perfil e @handle' },
  { id: 3, component: BannerBioStep, title: 'Banner e biografia' },
  { id: 4, component: SubscriptionPriceStep, title: 'Preço de assinatura' },
  { id: 5, component: VerificationStep, title: 'Verificar identidade' }
];

export default function RegisterCreatorPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});

  useEffect(() => {
    // Load saved progress from localStorage
    const savedProgress = localStorage.getItem('register-creator-progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setCurrentStep(parsed.currentStep || 0);
        setFormData(parsed.formData || {});
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = () => {
    localStorage.setItem('register-creator-progress', JSON.stringify({
      currentStep,
      formData: { ...formData }
    }));
  };

  // Handle step navigation
  const handleNext = (stepData: any) => {
    const newFormData = { ...formData, ...stepData };
    setFormData(newFormData);
    
    if (currentStep < STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Save progress
      localStorage.setItem('register-creator-progress', JSON.stringify({
        currentStep: nextStep,
        formData: newFormData
      }));
    } else {
      // All steps completed, submit the form
      handleComplete(newFormData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      // Save progress
      localStorage.setItem('register-creator-progress', JSON.stringify({
        currentStep: prevStep,
        formData
      }));
    } else {
      // Go back to auth page
      setLocation("/auth");
    }
  };

  const handleClose = () => {
    // Clear saved progress and go back to auth page
    localStorage.removeItem('register-creator-progress');
    setLocation("/auth");
  };

  const registerCreatorMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/register/creator", data);
      if (!response.ok) {
        let errorMessage = "Erro ao criar conta de criador";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If response is not JSON, try to get text
          const textError = await response.text();
          console.error("Non-JSON error response:", textError);
          errorMessage = "Erro no servidor. Tente novamente.";
        }
        throw new Error(errorMessage);
      }
      return await response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      localStorage.removeItem('register-creator-progress');
      toast({
        title: "Parabéns! 🎉",
        description: "Sua conta de criador foi criada com sucesso! Bem-vindo à plataforma!",
      });
      // Redirect to main app (user will be automatically redirected to creator version)
      setLocation("/");
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar conta de criador. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleComplete = async (finalData: FormData) => {
    // Upload images if provided
    try {
      let profileImageUrl = '';
      let coverImageUrl = '';

      if (finalData.profilePicture) {
        // TODO: Implement image upload
        // profileImageUrl = await uploadImage(finalData.profilePicture, 'profile');
      }

      if (finalData.coverImage) {
        // TODO: Implement image upload
        // coverImageUrl = await uploadImage(finalData.coverImage, 'cover');
      }

      // Prepare data for submission
      const submitData = {
        name: finalData.name,
        email: finalData.email,
        password: finalData.password,
        gender: finalData.gender,
        profileImage: profileImageUrl,
        displayName: finalData.displayName,
        username: finalData.username,
        coverImage: coverImageUrl,
        bio: finalData.bio,
        subscriptionPrice: finalData.subscriptionPrice || 0,
        verificationStatus: finalData.verificationStatus || 'pending',
      };

      registerCreatorMutation.mutate(submitData);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao fazer upload das imagens.",
        variant: "destructive",
      });
    }
  };

  // Render current step
  const renderCurrentStep = () => {
    const step = STEPS.find(s => s.id === currentStep);
    if (!step) return null;

    const StepComponent = step.component;

    return (
      <StepComponent
        onNext={handleNext}
        onBack={handleBack}
        onClose={handleClose}
        initialData={formData}
      />
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Progress Indicator */}
      <div className="sticky top-0 z-20 bg-white dark:bg-black border-b dark:border-gray-800 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <ProgressDots 
            currentStep={currentStep + 1} 
            totalSteps={STEPS.length}
            className="mb-2"
          />
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Etapa {currentStep + 1} de {STEPS.length}
          </p>
        </div>
      </div>

      {/* Current Step */}
      {renderCurrentStep()}
    </div>
  );
}
