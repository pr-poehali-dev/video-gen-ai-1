import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ContentResultProps {
  activeTab: 'video' | 'text' | 'presentation' | 'photo';
  content: string | null;
  onCopyOrDownload: () => void;
}

const ContentResult = ({ activeTab, content, onCopyOrDownload }: ContentResultProps) => {
  if (!content || activeTab === 'presentation') return null;

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
