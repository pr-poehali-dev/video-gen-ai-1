import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import GeneratorModals from '@/components/GeneratorModals';
import OfferModal from '@/components/OfferModal';
import AuthModal from '@/components/AuthModal';
import HeroSection from '@/components/index/HeroSection';
import GeneratorsSection from '@/components/index/GeneratorsSection';
import AboutPricingSection from '@/components/index/AboutPricingSection';
import ContactsSection from '@/components/index/ContactsSection';
import { isUserRegistered } from '@/utils/deviceFingerprint';
import { useIndexState } from '@/components/index/useIndexState';
import { useIndexHelpers } from '@/components/index/useIndexHelpers';
import { useIndexGenerators } from '@/components/index/useIndexGenerators';

const Index = () => {
  const state = useIndexState();
  
  const {
    scrollToSection,
    checkRequestLimit,
    handleIncrementRequest
  } = useIndexHelpers(
    state.deviceId,
    state.setRequestCount,
    state.setIsAuthModalOpen,
    state.setIsMobileMenuOpen,
    state.toast
  );

  const {
    handleVideoGenerate,
    handleTextGenerate,
    handlePresentationGenerate,
    handlePhotoGenerate
  } = useIndexGenerators(
    state.toast,
    state.setIsGenerating,
    state.setProgress,
    state.setGeneratedContent,
    state.setGeneratedSlides,
    handleIncrementRequest
  );

  const handlePlanClick = (planName: string, price: number) => {
    window.location.href = `/payment?plan=${encodeURIComponent(planName)}&amount=${price}`;
  };

  const handleOfferAccept = () => {
    state.setIsOfferModalOpen(false);
    state.toast({
      title: 'Отлично!',
      description: `Вы приняли условия тарифа "${state.selectedPlan}". Сейчас откроется страница оплаты.`,
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
        isMobileMenuOpen={state.isMobileMenuOpen}
        setIsMobileMenuOpen={state.setIsMobileMenuOpen}
        scrollToSection={scrollToSection}
      />

      {!isUserRegistered() && (
        <div className="fixed top-20 right-6 z-50 animate-fade-in">
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full px-6 py-3 shadow-2xl border-2 border-white/20">
            <div className="flex items-center gap-3">
              <Icon name="Zap" className="text-white" size={20} />
              <div className="text-white font-bold">
                <span className="text-sm opacity-90">Бесплатных запросов:</span>
                <div className="text-2xl">{2 - state.requestCount} / 2</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 pt-24">
        <HeroSection 
          typingText={state.typingText}
          scrollToSection={scrollToSection}
        />

        <GeneratorsSection
          videoPrompt={state.videoPrompt}
          setVideoPrompt={state.setVideoPrompt}
          videoDuration={state.videoDuration}
          setVideoDuration={state.setVideoDuration}
          videoStyle={state.videoStyle}
          setVideoStyle={state.setVideoStyle}
          textPrompt={state.textPrompt}
          setTextPrompt={state.setTextPrompt}
          presentationTopic={state.presentationTopic}
          setPresentationTopic={state.setPresentationTopic}
          presentationSlides={state.presentationSlides}
          setPresentationSlides={state.setPresentationSlides}
          presentationStyle={state.presentationStyle}
          setPresentationStyle={state.setPresentationStyle}
          photoPrompt={state.photoPrompt}
          setPhotoPrompt={state.setPhotoPrompt}
          photoStyle={state.photoStyle}
          setPhotoStyle={state.setPhotoStyle}
          photoResolution={state.photoResolution}
          setPhotoResolution={state.setPhotoResolution}
          handleVideoGenerate={() => handleVideoGenerate(
            state.videoPrompt,
            state.videoDuration,
            state.videoStyle,
            state.setIsVideoModalOpen,
            checkRequestLimit
          )}
          handleTextGenerate={() => handleTextGenerate(
            state.textPrompt,
            state.setIsTextModalOpen,
            checkRequestLimit
          )}
          handlePresentationGenerate={() => handlePresentationGenerate(
            state.presentationTopic,
            state.presentationSlides,
            state.presentationStyle,
            state.setIsPresentationModalOpen,
            checkRequestLimit
          )}
          handlePhotoGenerate={() => handlePhotoGenerate(
            state.photoPrompt,
            state.photoStyle,
            state.photoResolution,
            state.setIsPhotoModalOpen,
            checkRequestLimit
          )}
        />

        <AboutPricingSection
          aboutSection={state.aboutSection}
          pricingSection={state.pricingSection}
          handlePlanClick={handlePlanClick}
        />

        <ContactsSection contactSection={state.contactSection} />
      </main>

      <GeneratorModals 
        isVideoModalOpen={state.isVideoModalOpen}
        setIsVideoModalOpen={state.setIsVideoModalOpen}
        isTextModalOpen={state.isTextModalOpen}
        setIsTextModalOpen={state.setIsTextModalOpen}
        isPresentationModalOpen={state.isPresentationModalOpen}
        setIsPresentationModalOpen={state.setIsPresentationModalOpen}
        isPhotoModalOpen={state.isPhotoModalOpen}
        setIsPhotoModalOpen={state.setIsPhotoModalOpen}
        isGenerating={state.isGenerating}
        progress={state.progress}
        generatedContent={state.generatedContent}
        generatedSlides={state.generatedSlides}
      />

      <OfferModal 
        isOpen={state.isOfferModalOpen}
        onClose={() => state.setIsOfferModalOpen(false)}
        onAccept={handleOfferAccept}
        planName={state.selectedPlan}
      />

      <AuthModal 
        isOpen={state.isAuthModalOpen}
        onClose={() => state.setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Index;