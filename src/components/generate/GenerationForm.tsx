import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface GenerationFormProps {
  activeTab: 'video' | 'text' | 'presentation' | 'photo';
  prompt: string;
  onPromptChange: (value: string) => void;
  slideCount: number;
  onSlideCountChange: (value: number) => void;
  imageStyle: string;
  onImageStyleChange: (value: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

const GenerationForm = ({
  activeTab,
  prompt,
  onPromptChange,
  slideCount,
  onSlideCountChange,
  imageStyle,
  onImageStyleChange,
  isGenerating,
  onGenerate
}: GenerationFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="prompt">Описание</Label>
        <Textarea
          id="prompt"
          placeholder={
            activeTab === 'video' 
              ? 'Например: Космический корабль летит через туманность, неоновые цвета, кинематографичный стиль'
              : activeTab === 'text'
              ? 'Например: Напиши статью о пользе медитации, 500 слов, научный стиль'
              : activeTab === 'photo'
              ? 'Например: Красивый закат над океаном, фотореалистичный стиль, 4K качество'
              : 'Например: Презентация о цифровом маркетинге, современный стиль, минимализм'
          }
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>

      {activeTab === 'presentation' && (
        <div>
          <Label htmlFor="slideCount">Количество слайдов</Label>
          <Input
            id="slideCount"
            type="number"
            min={1}
            max={20}
            value={slideCount}
            onChange={(e) => onSlideCountChange(Math.min(20, Math.max(1, parseInt(e.target.value) || 5)))}
            className="w-32"
          />
        </div>
      )}

      {activeTab === 'photo' && (
        <div>
          <Label htmlFor="imageStyle">Стиль изображения</Label>
          <select
            id="imageStyle"
            value={imageStyle}
            onChange={(e) => onImageStyleChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="photorealistic">📸 Фотореалистичный</option>
            <option value="artistic">🎨 Художественный</option>
            <option value="cartoon">🎬 Мультяшный</option>
            <option value="abstract">🌈 Абстрактный</option>
          </select>
        </div>
      )}

      <Button 
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
            {activeTab === 'presentation' 
              ? `Создаю ${slideCount} слайдов параллельно...` 
              : 'Генерация... (это может занять 1-2 минуты)'}
          </>
        ) : (
          <>
            <Icon name="Sparkles" className="mr-2" size={20} />
            {activeTab === 'presentation' ? `Создать ${slideCount} слайдов` : 'Сгенерировать'}
          </>
        )}
      </Button>
    </div>
  );
};

export default GenerationForm;
