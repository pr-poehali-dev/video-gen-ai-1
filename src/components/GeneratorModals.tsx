import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface GeneratorModalsProps {
  isVideoModalOpen: boolean;
  setIsVideoModalOpen: (open: boolean) => void;
  isTextModalOpen: boolean;
  setIsTextModalOpen: (open: boolean) => void;
  isPresentationModalOpen: boolean;
  setIsPresentationModalOpen: (open: boolean) => void;
  isPhotoModalOpen?: boolean;
  setIsPhotoModalOpen?: (open: boolean) => void;
  isGenerating: boolean;
  progress: number;
  generatedContent: string;
  generatedSlides?: string[];
}

const GeneratorModals = ({
  isVideoModalOpen,
  setIsVideoModalOpen,
  isTextModalOpen,
  setIsTextModalOpen,
  isPresentationModalOpen,
  setIsPresentationModalOpen,
  isPhotoModalOpen,
  setIsPhotoModalOpen,
  isGenerating,
  progress,
  generatedContent,
  generatedSlides = [],
}: GeneratorModalsProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (generatedContent && !isGenerating && isTextModalOpen) {
      setDisplayedText('');
      setIsTyping(true);
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex < generatedContent.length) {
          setDisplayedText(generatedContent.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 20);

      return () => clearInterval(typingInterval);
    }
  }, [generatedContent, isGenerating, isTextModalOpen]);

  return (
    <>
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-3xl w-[95vw] sm:w-full gradient-blur border-white/40">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-violet-600 bg-clip-text text-transparent font-bold">
              Генерация видео
            </DialogTitle>
            <DialogDescription>
              {isGenerating ? 'Создаем ваше видео с помощью AI...' : 'Ваше видео готово!'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {isGenerating ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    <Icon name="Video" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600" size={32} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Прогресс</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="text-center text-sm text-gray-600">
                  <p>Обрабатываем ваш запрос и создаем видео...</p>
                  <p className="mt-2 text-xs">Это может занять несколько секунд</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden border-2 border-purple-200">
                  {generatedContent ? (
                    <video 
                      src={generatedContent} 
                      controls 
                      autoPlay
                      loop
                      className="w-full h-full object-contain"
                    >
                      Ваш браузер не поддерживает видео
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-violet-100">
                      <div className="text-center">
                        <Icon name="Video" className="mx-auto mb-4 text-purple-600" size={64} />
                        <p className="text-lg font-bold text-gray-700">Видео готовится...</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => window.open(generatedContent, '_blank')}
                    disabled={!generatedContent}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold disabled:opacity-50"
                  >
                    <Icon name="Download" className="mr-2" size={18} />
                    Скачать видео
                  </Button>
                  <Button 
                    variant="outline" 
                    disabled={!generatedContent}
                    className="flex-1 border-purple-300 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 disabled:opacity-50"
                  >
                    <Icon name="Share2" className="mr-2" size={18} />
                    Поделиться
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTextModalOpen} onOpenChange={setIsTextModalOpen}>
        <DialogContent className="max-w-4xl w-[95vw] sm:w-full max-h-[80vh] gradient-blur border-white/40">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent font-bold">
              Генерация текста
            </DialogTitle>
            <DialogDescription>
              {isGenerating ? 'Пишем текст с помощью AI...' : 'Ваш текст готов!'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 overflow-y-auto max-h-[60vh]">
            {isGenerating ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
                    <Icon name="FileText" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-600" size={32} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Прогресс</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="text-center text-sm text-gray-600">
                  <p>Генерируем уникальный текст на основе вашего запроса...</p>
                  <p className="mt-2 text-xs">AI анализирует требования и создает контент</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative bg-gradient-to-br from-violet-50 via-fuchsia-50 to-purple-50 p-8 rounded-xl border-2 border-violet-200 shadow-2xl min-h-[300px]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-500 rounded-t-xl"></div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-violet-200">
                      <Icon name="Sparkles" className="text-violet-600 animate-pulse" size={16} />
                      <span className="text-xs font-semibold text-violet-700">AI Generated</span>
                    </div>
                  </div>
                  <div className="text-gray-900 text-base leading-relaxed whitespace-pre-wrap font-sans mt-8">
                    {displayedText}
                    {isTyping && <span className="inline-block w-0.5 h-5 bg-violet-600 animate-pulse ml-0.5"></span>}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(generatedContent);
                    }}
                    disabled={isTyping}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold disabled:opacity-50"
                  >
                    <Icon name="Copy" className="mr-2" size={18} />
                    {isTyping ? 'Генерация...' : 'Копировать текст'}
                  </Button>
                  <Button 
                    variant="outline" 
                    disabled={isTyping}
                    className="flex-1 border-violet-300 hover:border-violet-400 hover:bg-violet-50 transition-all duration-300 disabled:opacity-50"
                  >
                    <Icon name="Download" className="mr-2" size={18} />
                    Скачать .txt
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPresentationModalOpen} onOpenChange={setIsPresentationModalOpen}>
        <DialogContent className="max-w-4xl w-[95vw] sm:w-full gradient-blur border-white/40">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl bg-gradient-to-r from-pink-600 to-purple-500 bg-clip-text text-transparent font-bold">
              Генерация презентации
            </DialogTitle>
            <DialogDescription>
              {isGenerating ? `Создаю слайды... ${generatedSlides && generatedSlides.length > 0 ? `${generatedSlides.length} готово` : ''}` : `Презентация готова! ${generatedSlides && generatedSlides.length > 0 ? `${generatedSlides.length} слайдов` : ''}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {isGenerating ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
                    <Icon name="Presentation" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-600" size={32} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Прогресс</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="text-center text-sm text-gray-600">
                  <p>Создаем слайды и подбираем дизайн...</p>
                  <p className="mt-2 text-xs">Генерируем структуру и контент презентации</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {generatedSlides && generatedSlides.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedSlides.map((slide, index) => (
                        <div key={index} className="relative group">
                          <div className="absolute top-2 left-2 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                            Слайд {index + 1}
                          </div>
                          <img 
                            src={slide} 
                            alt={`Слайд ${index + 1}`} 
                            className="w-full aspect-video object-cover rounded-lg border-2 border-pink-200 hover:border-pink-400 transition-all cursor-pointer"
                            onClick={() => window.open(slide, '_blank')}
                          />
                          <Button
                            onClick={() => window.open(slide, '_blank')}
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-pink-600 hover:bg-pink-700"
                            size="sm"
                          >
                            <Icon name="Download" size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white/60 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 font-semibold">✨ Презентация из {generatedSlides.length} слайдов готова!</p>
                      <p className="text-xs text-gray-600 mt-1">Нажмите на слайд для просмотра в полном размере</p>
                    </div>
                    <Button 
                      onClick={() => generatedSlides.forEach(url => window.open(url, '_blank'))}
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-700 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                    >
                      <Icon name="Download" className="mr-2" size={18} />
                      Скачать все слайды
                    </Button>
                  </>
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-violet-100 rounded-lg">
                    <div className="text-center">
                      <Icon name="Presentation" className="mx-auto mb-4 text-pink-600" size={64} />
                      <p className="text-lg font-bold text-gray-700">Презентация готовится...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {isPhotoModalOpen !== undefined && setIsPhotoModalOpen && (
        <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
          <DialogContent className="max-w-3xl w-[95vw] sm:w-full gradient-blur border-white/40">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent font-bold">
                Генерация фото
              </DialogTitle>
              <DialogDescription>
                {isGenerating ? 'Создаем ваше фото с помощью AI...' : 'Ваше фото готово!'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {isGenerating ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center py-12">
                    <div className="relative">
                      <div className="w-24 h-24 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                      <Icon name="Image" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-600" size={32} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Прогресс</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    <p>Создаем уникальное изображение на основе вашего описания...</p>
                    <p className="mt-2 text-xs">Это может занять несколько секунд</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="aspect-video bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-lg flex items-center justify-center border-2 border-green-200 overflow-hidden">
                    {generatedContent ? (
                      <img src={generatedContent} alt="Generated photo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Icon name="Image" className="mx-auto mb-4 text-green-600" size={64} />
                        <p className="text-lg font-bold text-gray-700">Фото генератор</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={() => window.open(generatedContent, '_blank')}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                    >
                      <Icon name="Download" className="mr-2" size={18} />
                      Скачать фото
                    </Button>
                    <Button variant="outline" className="flex-1 border-green-300 hover:border-green-400 hover:bg-green-50 transition-all duration-300">
                      <Icon name="Share2" className="mr-2" size={18} />
                      Поделиться
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default GeneratorModals;