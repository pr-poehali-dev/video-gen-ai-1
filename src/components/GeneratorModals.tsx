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
  isGenerating: boolean;
  progress: number;
  generatedContent: string;
}

const GeneratorModals = ({
  isVideoModalOpen,
  setIsVideoModalOpen,
  isTextModalOpen,
  setIsTextModalOpen,
  isPresentationModalOpen,
  setIsPresentationModalOpen,
  isGenerating,
  progress,
  generatedContent,
}: GeneratorModalsProps) => {
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
                <div className="aspect-video bg-gradient-to-br from-purple-100 via-pink-100 to-violet-100 rounded-lg flex items-center justify-center border-2 border-purple-200">
                  <div className="text-center">
                    <Icon name="Video" className="mx-auto mb-4 text-purple-600" size={64} />
                    <p className="text-lg font-bold text-gray-700">Видео плеер</p>
                    <p className="text-sm text-gray-500 mt-2">{generatedContent}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                    <Icon name="Download" className="mr-2" size={18} />
                    Скачать видео
                  </Button>
                  <Button variant="outline" className="flex-1 border-purple-300 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300">
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
                <div className="bg-white/80 p-6 rounded-lg min-h-[300px] whitespace-pre-wrap font-sans">
                  {generatedContent}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                    <Icon name="Copy" className="mr-2" size={18} />
                    Копировать текст
                  </Button>
                  <Button variant="outline" className="flex-1 border-violet-300 hover:border-violet-400 hover:bg-violet-50 transition-all duration-300">
                    <Icon name="Download" className="mr-2" size={18} />
                    Скачать .docx
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
              {isGenerating ? 'Создаем профессиональную презентацию...' : 'Ваша презентация готова!'}
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {[1, 2, 3, 4, 5, 6].map((slide) => (
                    <div key={slide} className="aspect-video bg-gradient-to-br from-pink-100 via-purple-100 to-violet-100 rounded-lg p-2 sm:p-4 flex flex-col items-center justify-center border-2 border-pink-200">
                      <Icon name="FileText" className="text-pink-600 mb-1 sm:mb-2" size={20} />
                      <p className="text-xs font-semibold">Слайд {slide}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{generatedContent}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-700 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                    <Icon name="Download" className="mr-2" size={18} />
                    Скачать PPT
                  </Button>
                  <Button variant="outline" className="flex-1 border-pink-300 hover:border-pink-400 hover:bg-pink-50 transition-all duration-300">
                    <Icon name="FileText" className="mr-2" size={18} />
                    Скачать PDF
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GeneratorModals;