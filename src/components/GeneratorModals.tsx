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
            <DialogTitle className="text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
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
                    <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                    <Icon name="Video" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={32} />
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
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="Video" className="mx-auto mb-4 text-blue-600" size={64} />
                    <p className="text-lg font-medium text-gray-700">Видео плеер</p>
                    <p className="text-sm text-gray-500 mt-2">{generatedContent}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white">
                    <Icon name="Download" className="mr-2" size={18} />
                    Скачать видео
                  </Button>
                  <Button variant="outline" className="flex-1 border-blue-300">
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
            <DialogTitle className="text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
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
                    <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                    <Icon name="FileText" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={32} />
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
                  <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white">
                    <Icon name="Copy" className="mr-2" size={18} />
                    Копировать текст
                  </Button>
                  <Button variant="outline" className="flex-1 border-blue-300">
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
            <DialogTitle className="text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
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
                    <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                    <Icon name="Presentation" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={32} />
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
                    <div key={slide} className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-2 sm:p-4 flex flex-col items-center justify-center border-2 border-blue-200">
                      <Icon name="FileText" className="text-blue-600 mb-1 sm:mb-2" size={20} />
                      <p className="text-xs font-medium">Слайд {slide}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white/60 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{generatedContent}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white">
                    <Icon name="Download" className="mr-2" size={18} />
                    Скачать PPT
                  </Button>
                  <Button variant="outline" className="flex-1 border-blue-300">
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
