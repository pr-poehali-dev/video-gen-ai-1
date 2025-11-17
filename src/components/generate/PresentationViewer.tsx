import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface GeneratedImage {
  url: string;
  prompt: string;
  isLoading: boolean;
}

interface PresentationViewerProps {
  images: GeneratedImage[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onDownloadImage: (url: string, index: number) => void;
  onDownloadAll: () => void;
}

const PresentationViewer = ({
  images,
  selectedIndex,
  onSelectIndex,
  onDownloadImage,
  onDownloadAll
}: PresentationViewerProps) => {
  if (images.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">✨ Презентация из {images.length} слайдов готова!</h3>
        <Button 
          onClick={onDownloadAll}
          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
          size="sm"
        >
          <Icon name="Download" className="mr-2" size={16} />
          Скачать все слайды
        </Button>
      </div>

      <p className="text-sm text-slate-400 mb-4">Нажмите на слайд для просмотра • Используйте ← → для навигации</p>
      
      <div className="flex flex-col md:flex-row gap-4 h-auto md:h-[600px]">
        <div className="flex-1 relative min-h-[400px] md:min-h-0">
          {images[selectedIndex] && (
            <div className="h-full rounded-lg overflow-hidden bg-slate-900 border-2 border-pink-500/30 relative">
              {images[selectedIndex].isLoading ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center">
                  <Icon name="Loader2" className="animate-spin text-pink-400 mb-4" size={48} />
                  <p className="text-lg text-slate-300">Генерация слайда {selectedIndex + 1}...</p>
                </div>
              ) : images[selectedIndex].url ? (
                <>
                  <img
                    src={images[selectedIndex].url}
                    alt={`Слайд ${selectedIndex + 1}`}
                    className="w-full h-full object-contain min-h-[400px]"
                    style={{
                      animation: 'fadeInBlur 0.5s ease-out'
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-600 to-purple-600 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-white text-sm md:text-base font-semibold shadow-lg">
                    Слайд {selectedIndex + 1} из {images.length}
                  </div>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onDownloadImage(images[selectedIndex].url, selectedIndex)}
                      className="bg-white/90 text-black hover:bg-white shadow-lg"
                    >
                      <Icon name="Download" className="md:mr-2" size={16} />
                      <span className="hidden md:inline">Скачать</span>
                    </Button>
                  </div>

                  {selectedIndex > 0 && (
                    <Button
                      onClick={() => onSelectIndex(selectedIndex - 1)}
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 md:p-3"
                      size="sm"
                    >
                      <Icon name="ChevronLeft" size={20} className="md:w-6 md:h-6" />
                    </Button>
                  )}

                  {selectedIndex < images.length - 1 && (
                    <Button
                      onClick={() => onSelectIndex(selectedIndex + 1)}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 md:p-3"
                      size="sm"
                    >
                      <Icon name="ChevronRight" size={20} className="md:w-6 md:h-6" />
                    </Button>
                  )}
                </>
              ) : (
                <div className="h-full min-h-[400px] flex items-center justify-center">
                  <Icon name="AlertCircle" className="text-red-400" size={48} />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-full md:w-64 flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible md:overflow-y-auto pr-2 pb-2 md:pb-0 custom-scrollbar">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelectIndex(index)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer hover:scale-105 flex-shrink-0 md:flex-shrink ${
                selectedIndex === index 
                  ? 'border-pink-500 shadow-lg shadow-pink-500/50 scale-105' 
                  : 'border-slate-700 hover:border-pink-400'
              }`}
            >
              <div className="aspect-video bg-slate-800 w-48 md:w-auto">
                {image.isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center">
                    <Icon name="Loader2" className="animate-spin text-pink-400 mb-1" size={20} />
                    <p className="text-xs text-slate-400">Загрузка...</p>
                  </div>
                ) : image.url ? (
                  <img
                    src={image.url}
                    alt={`Слайд ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <Icon name="AlertCircle" className="text-red-400" size={20} />
                  </div>
                )}
              </div>
              <div className={`absolute bottom-1 left-1 px-2 py-0.5 rounded text-xs font-semibold ${
                selectedIndex === index
                  ? 'bg-pink-600 text-white'
                  : 'bg-black/70 text-white'
              }`}>
                Слайд {index + 1}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PresentationViewer;
