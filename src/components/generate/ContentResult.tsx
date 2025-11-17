import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ContentResultProps {
  activeTab: 'video' | 'text' | 'presentation' | 'photo';
  content: string | null;
  onCopyOrDownload: () => void;
  isGenerating?: boolean;
}

const ContentResult = ({ activeTab, content, onCopyOrDownload, isGenerating = false }: ContentResultProps) => {
  if (activeTab === 'presentation') return null;

  // Показываем loader для видео во время генерации
  if (isGenerating && activeTab === 'video') {
    return (
      <div className="mt-6 p-8 border border-purple-500/30 rounded-lg bg-gradient-to-br from-purple-950/30 to-pink-950/30">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-4 border-purple-200/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-purple-500 border-r-pink-500 rounded-full animate-spin"></div>
            <Icon name="Video" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400" size={48} />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">Создаю видео...</h3>
            <p className="text-slate-400">Генерация займет 1-3 минуты</p>
            <p className="text-sm text-slate-500">Используется AI модель высокого качества</p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-purple-300">Обработка запроса</span>
          </div>
        </div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="mt-6 p-4 border border-slate-700 rounded-lg bg-slate-900/50">
      <h3 className="text-lg font-semibold mb-4 text-white">Результат:</h3>
      
      {activeTab === 'video' && (
        <video 
          src={content} 
          controls 
          className="w-full rounded-lg"
        />
      )}

      {activeTab === 'text' && (
        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-wrap text-slate-300">{content}</p>
        </div>
      )}

      {activeTab === 'photo' && (
        <img 
          src={content} 
          alt="Generated photo" 
          className="w-full rounded-lg"
        />
      )}

      <Button 
        onClick={onCopyOrDownload}
        variant="outline"
        className="mt-4"
      >
        <Icon name={activeTab === 'text' ? 'Copy' : 'Download'} className="mr-2" size={18} />
        {activeTab === 'text' ? 'Скопировать' : 'Скачать'}
      </Button>
    </div>
  );
};

export default ContentResult;