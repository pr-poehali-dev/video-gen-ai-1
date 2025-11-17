import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ContentTypeTabsProps {
  activeTab: 'video' | 'text' | 'presentation' | 'photo';
  onTabChange: (tab: 'video' | 'text' | 'presentation' | 'photo') => void;
}

const ContentTypeTabs = ({ activeTab, onTabChange }: ContentTypeTabsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-4 mb-8">
      <Card 
        className={`cursor-pointer transition-all ${activeTab === 'video' ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700'}`}
        onClick={() => onTabChange('video')}
      >
        <CardHeader>
          <Icon name="Video" className="mb-2 text-purple-400" size={32} />
          <CardTitle>Видео</CardTitle>
          <CardDescription>Генерация видео из текста через AI</CardDescription>
        </CardHeader>
      </Card>

      <Card 
        className={`cursor-pointer transition-all ${activeTab === 'text' ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700'}`}
        onClick={() => onTabChange('text')}
      >
        <CardHeader>
          <Icon name="FileText" className="mb-2 text-cyan-400" size={32} />
          <CardTitle>Текст</CardTitle>
          <CardDescription>Создание текстов через GPT-4</CardDescription>
        </CardHeader>
      </Card>

      <Card 
        className={`cursor-pointer transition-all ${activeTab === 'presentation' ? 'border-pink-500 bg-pink-500/10' : 'border-slate-700'}`}
        onClick={() => onTabChange('presentation')}
      >
        <CardHeader>
          <Icon name="Presentation" className="mb-2 text-pink-400" size={32} />
          <CardTitle>Презентация</CardTitle>
          <CardDescription>Создайте серию изображений для презентации</CardDescription>
        </CardHeader>
      </Card>

      <Card 
        className={`cursor-pointer transition-all ${activeTab === 'photo' ? 'border-green-500 bg-green-500/10' : 'border-slate-700'}`}
        onClick={() => onTabChange('photo')}
      >
        <CardHeader>
          <Icon name="Image" className="mb-2 text-green-400" size={32} />
          <CardTitle>Фото</CardTitle>
          <CardDescription>Генерация изображений через AI</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ContentTypeTabs;
