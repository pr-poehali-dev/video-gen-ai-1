import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';
import Header from '@/components/Header';
import GeneratorModals from '@/components/GeneratorModals';
import OfferModal from '@/components/OfferModal';
import AuthModal from '@/components/AuthModal';
import HeroSection from '@/components/index/HeroSection';
import GeneratorsSection from '@/components/index/GeneratorsSection';
import AboutPricingSection from '@/components/index/AboutPricingSection';
import ContactsSection from '@/components/index/ContactsSection';
import { 
  getDeviceFingerprint, 
  getRequestCount, 
  incrementRequestCount as incrementDeviceCount,
  isUserRegistered 
} from '@/utils/deviceFingerprint';

const Index = () => {
  const { toast } = useToast();
  const aboutSection = useScrollAnimation(0.2);
  const pricingSection = useScrollAnimation(0.2);
  const contactSection = useScrollAnimation(0.2);
  const typingText = useTypingAnimation('AI-решения с молодым драйвом и высоким качеством', 80);
  const [videoPrompt, setVideoPrompt] = useState('');
  const [textPrompt, setTextPrompt] = useState('');
  const [presentationTopic, setPresentationTopic] = useState('');
  const [photoPrompt, setPhotoPrompt] = useState('');
  
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const checkRequestLimit = () => {
    if (isUserRegistered()) return true;

    const count = getRequestCount(deviceId);
    if (count >= 2) {
      setIsAuthModalOpen(true);
      toast({
        title: 'Лимит исчерпан',
        description: `Вы использовали все ${count} бесплатных запроса с этого устройства. Зарегистрируйтесь для продолжения!`,
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleIncrementRequest = () => {
    if (!isUserRegistered()) {
      const newCount = incrementDeviceCount(deviceId);
      setRequestCount(newCount);
      
      const remaining = 2 - newCount;
      if (remaining > 0) {
        toast({
          title: 'Запрос выполнен',
          description: `Осталось бесплатных запросов: ${remaining}`,
        });
      }
    }
  };

  const simulateGeneration = async (type: 'video' | 'text' | 'presentation', prompt: string) => {
    if (!prompt.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните поле запроса',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const requestType = type === 'presentation' ? 'image' : type;
      
      const response = await fetch('https://functions.poehali.dev/34147c53-3589-4dc6-9c1b-3170886e1a99', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: requestType,
          prompt: prompt,
          params: type === 'video' ? { num_frames: 25, fps: 6 } : 
                  type === 'presentation' ? { provider: 'stability', width: 1024, height: 768 } :
                  { model: 'gpt-4', max_tokens: 1000 }
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Ошибка генерации');
      }

      clearInterval(interval);
      setIsGenerating(false);
      setProgress(100);

      if (type === 'video') {
        setGeneratedContent(result.status === 'processing' 
          ? 'Видео обрабатывается. ID: ' + result.prediction_id 
          : 'Видео успешно создано!');
      } else if (type === 'text') {
        setGeneratedContent(result.text || 'Текст сгенерирован успешно!');
      } else if (type === 'presentation') {
        setGeneratedContent(result.url ? 'Изображение для презентации создано!' : 'Презентация готова!');
      }

      toast({
        title: 'Готово!',
        description: 'Контент успешно сгенерирован',
      });
    } catch (error) {
      clearInterval(interval);
      setIsGenerating(false);
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось сгенерировать контент',
        variant: 'destructive',
      });
    }
  };

  const handleVideoGenerate = () => {
    if (!checkRequestLimit()) return;
    setIsVideoModalOpen(true);
    simulateGeneration('video', videoPrompt);
  };

  const handleTextGenerate = async () => {
    if (!textPrompt.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите запрос для генерации текста',
        variant: 'destructive',
      });
      return;
    }

    if (!checkRequestLimit()) return;

    setIsTextModalOpen(true);
    setIsGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 300);

    try {
      const response = await fetch('https://functions.poehali.dev/afb4ee36-6a99-4357-b02b-de653bf882bc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: textPrompt,
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      const data = await response.json();
      clearInterval(interval);
      setProgress(100);

      if (data.success) {
        setGeneratedContent(data.text);
        setIsGenerating(false);
        handleIncrementRequest();
        toast({
          title: 'Готово!',
          description: 'Текст успешно сгенерирован нейросетью',
        });
      } else {
        throw new Error(data.error || 'Ошибка генерации');
      }
    } catch (error) {
      clearInterval(interval);
      setIsGenerating(false);
      toast({
        title: 'Ошибка генерации',
        description: error instanceof Error ? error.message : 'Попробуйте позже',
        variant: 'destructive',
      });
    }
  };

  const handlePresentationGenerate = () => {
    if (!checkRequestLimit()) return;
    setIsPresentationModalOpen(true);
    simulateGeneration('presentation', presentationTopic);
  };

  const handlePhotoGenerate = async () => {
    if (!photoPrompt.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите описание для генерации фото',
        variant: 'destructive',
      });
      return;
    }

    if (!checkRequestLimit()) return;

    setIsPhotoModalOpen(true);
    setIsGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const response = await fetch('https://functions.poehali.dev/500cc697-682b-469a-b439-fa265e84c833?action=generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'image',
          prompt: photoPrompt
        })
      });

      const data = await response.json();
      clearInterval(interval);
      setProgress(100);

      if (data.success) {
        setGeneratedContent(data.content_url);
        setIsGenerating(false);
        handleIncrementRequest();
        toast({
          title: 'Готово!',
          description: 'Фото успешно сгенерировано',
        });
      } else {
        throw new Error(data.error || 'Ошибка генерации');
      }
    } catch (error) {
      clearInterval(interval);
      setIsGenerating(false);
      toast({
        title: 'Ошибка генерации',
        description: error instanceof Error ? error.message : 'Попробуйте позже',
        variant: 'destructive',
      });
    }
  };

  const handlePlanClick = (planName: string) => {
    setSelectedPlan(planName);
    setIsOfferModalOpen(true);
  };

  const handleOfferAccept = () => {
    setIsOfferModalOpen(false);
    toast({
      title: 'Отлично!',
      description: `Вы приняли условия тарифа "${selectedPlan}". Сейчас откроется страница оплаты.`,
    });
    setTimeout(() => {
      window.open('https://yoomoney.ru/to/410019573464131', '_blank');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0f1729] relative overflow-hidden">
      <div className="scan-line"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-cyan-500/10 rounded-full filter blur-3xl opacity-50 parallax-element glow-pulse-cyan"></div>
        <div className="absolute top-40 right-20 w-[700px] h-[700px] bg-purple-500/10 rounded-full filter blur-3xl opacity-40 parallax-slow glow-pulse-purple"></div>
        <div className="absolute -bottom-20 left-1/3 w-[500px] h-[500px] bg-blue-500/10 rounded-full filter blur-3xl opacity-30 parallax-fast"></div>
        <div className="absolute top-60 right-1/4 w-[400px] h-[400px] bg-pink-500/5 rounded-full filter blur-3xl opacity-30 parallax-element"></div>
        <div className="absolute bottom-40 left-20 w-[350px] h-[350px] bg-cyan-400/5 rounded-full filter blur-3xl opacity-25 parallax-slow"></div>
        
        <div className="absolute inset-0 grid-pulse" style={{
          backgroundImage: `
            linear-gradient(rgba(100, 255, 218, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 255, 218, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <Header 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        scrollToSection={scrollToSection}
      />

      {!isUserRegistered() && (
        <div className="fixed top-20 right-6 z-50 animate-fade-in">
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full px-6 py-3 shadow-2xl border-2 border-white/20">
            <div className="flex items-center gap-3">
              <Icon name="Zap" className="text-white" size={20} />
              <div className="text-white font-bold">
                <span className="text-sm opacity-90">Бесплатных запросов:</span>
                <div className="text-2xl">{2 - requestCount} / 2</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 pt-24">
        <HeroSection 
          typingText={typingText}
          scrollToSection={scrollToSection}
        />

        <GeneratorsSection
          videoPrompt={videoPrompt}
          setVideoPrompt={setVideoPrompt}
          textPrompt={textPrompt}
          setTextPrompt={setTextPrompt}
          presentationTopic={presentationTopic}
          setPresentationTopic={setPresentationTopic}
          photoPrompt={photoPrompt}
          setPhotoPrompt={setPhotoPrompt}
          handleVideoGenerate={handleVideoGenerate}
          handleTextGenerate={handleTextGenerate}
          handlePresentationGenerate={handlePresentationGenerate}
          handlePhotoGenerate={handlePhotoGenerate}
        />

        <AboutPricingSection
          aboutSection={aboutSection}
          pricingSection={pricingSection}
          handlePlanClick={handlePlanClick}
        />

        <ContactsSection
          contactSection={contactSection}
        />
      </main>

      <GeneratorModals
        isVideoModalOpen={isVideoModalOpen}
        setIsVideoModalOpen={setIsVideoModalOpen}
        isTextModalOpen={isTextModalOpen}
        setIsTextModalOpen={setIsTextModalOpen}
        isPresentationModalOpen={isPresentationModalOpen}
        setIsPresentationModalOpen={setIsPresentationModalOpen}
        isPhotoModalOpen={isPhotoModalOpen}
        setIsPhotoModalOpen={setIsPhotoModalOpen}
        isGenerating={isGenerating}
        progress={progress}
        generatedContent={generatedContent}
      />

      <OfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        onAccept={handleOfferAccept}
        planName={selectedPlan}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setRequestCount(0);
        }}
      />
    </div>
  );
};

export default Index;