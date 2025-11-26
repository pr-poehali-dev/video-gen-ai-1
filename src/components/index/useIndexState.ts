import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';
import { 
  getDeviceFingerprint, 
  getRequestCount, 
  isUserRegistered 
} from '@/utils/deviceFingerprint';

export const useIndexState = () => {
  const { toast } = useToast();
  const aboutSection = useScrollAnimation(0.2);
  const pricingSection = useScrollAnimation(0.2);
  const contactSection = useScrollAnimation(0.2);
  const typingText = useTypingAnimation('AI-решения с молодым драйвом и высоким качеством', 80);
  
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoDuration, setVideoDuration] = useState(5);
  const [videoStyle, setVideoStyle] = useState('cinematic');
  const [textPrompt, setTextPrompt] = useState('');
  const [presentationTopic, setPresentationTopic] = useState('');
  const [presentationSlides, setPresentationSlides] = useState(5);
  const [presentationStyle, setPresentationStyle] = useState('minimalist');
  const [generatedSlides, setGeneratedSlides] = useState<string[]>([]);
  const [photoPrompt, setPhotoPrompt] = useState('');
  const [photoStyle, setPhotoStyle] = useState('photorealistic');
  const [photoResolution, setPhotoResolution] = useState('1024x1024');
  
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isPresentationModalOpen, setIsPresentationModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [deviceId, setDeviceId] = useState<string>('');

  useEffect(() => {
    const fingerprint = getDeviceFingerprint();
    setDeviceId(fingerprint);
    
    const count = getRequestCount(fingerprint);
    setRequestCount(count);

    const isRegistered = isUserRegistered();
    const userData = localStorage.getItem('user_data');
    
    if (isRegistered && userData) {
      const user = JSON.parse(userData);
      console.log('Пользователь авторизован:', user);
      console.log('Device ID:', fingerprint);
    } else {
      console.log('Незарегистрированное устройство:', fingerprint);
      console.log('Использовано запросов:', count, '/ 2');
    }
  }, []);

  return {
    toast,
    aboutSection,
    pricingSection,
    contactSection,
    typingText,
    videoPrompt,
    setVideoPrompt,
    videoDuration,
    setVideoDuration,
    videoStyle,
    setVideoStyle,
    textPrompt,
    setTextPrompt,
    presentationTopic,
    setPresentationTopic,
    presentationSlides,
    setPresentationSlides,
    presentationStyle,
    setPresentationStyle,
    generatedSlides,
    setGeneratedSlides,
    photoPrompt,
    setPhotoPrompt,
    photoStyle,
    setPhotoStyle,
    photoResolution,
    setPhotoResolution,
    isVideoModalOpen,
    setIsVideoModalOpen,
    isTextModalOpen,
    setIsTextModalOpen,
    isPresentationModalOpen,
    setIsPresentationModalOpen,
    isPhotoModalOpen,
    setIsPhotoModalOpen,
    isOfferModalOpen,
    setIsOfferModalOpen,
    selectedPlan,
    setSelectedPlan,
    isGenerating,
    setIsGenerating,
    progress,
    setProgress,
    generatedContent,
    setGeneratedContent,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    requestCount,
    setRequestCount,
    deviceId,
    setDeviceId
  };
};
