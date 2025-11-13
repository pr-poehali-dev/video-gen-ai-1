import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const GenerateContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'video' | 'text' | 'presentation'>('video');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, введите описание',
        variant: 'destructive'
      });
      return;
    }

    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      const response = await fetch('https://functions.poehali.dev/500cc697-682b-469a-b439-fa265e84c833?action=generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Token': token
        },
        body: JSON.stringify({
          type: activeTab,
          prompt: prompt
        })
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedContent(data.content_url);
        toast({
          title: 'Готово!',
          description: `${activeTab === 'video' ? 'Видео' : activeTab === 'text' ? 'Текст' : 'Изображение'} успешно создано`,
        });
      } else {
        throw new Error(data.error || 'Ошибка генерации');
      }
    } catch (error) {
      toast({
        title: 'Ошибка генерации',
        description: error instanceof Error ? error.message : 'Попробуйте позже',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Генерация контента</h1>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            <Icon name="ArrowLeft" className="mr-2" size={18} />
            Назад
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card 
            className={`cursor-pointer transition-all ${activeTab === 'video' ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700'}`}
            onClick={() => setActiveTab('video')}
          >
            <CardHeader>
              <Icon name="Video" className="mb-2 text-purple-400" size={32} />
              <CardTitle>Видео</CardTitle>
              <CardDescription>Генерация видео из текста через AI</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${activeTab === 'text' ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700'}`}
            onClick={() => setActiveTab('text')}
          >
            <CardHeader>
              <Icon name="FileText" className="mb-2 text-cyan-400" size={32} />
              <CardTitle>Текст</CardTitle>
              <CardDescription>Создание текстов через GPT-4</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${activeTab === 'presentation' ? 'border-pink-500 bg-pink-500/10' : 'border-slate-700'}`}
            onClick={() => setActiveTab('presentation')}
          >
            <CardHeader>
              <Icon name="Presentation" className="mb-2 text-pink-400" size={32} />
              <CardTitle>Презентация</CardTitle>
              <CardDescription>Изображения для слайдов</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="border-slate-700">
          <CardHeader>
            <CardTitle>
              {activeTab === 'video' && 'Создать видео'}
              {activeTab === 'text' && 'Сгенерировать текст'}
              {activeTab === 'presentation' && 'Создать изображение для слайда'}
            </CardTitle>
            <CardDescription>
              {activeTab === 'video' && 'Опишите, какое видео вы хотите создать (сцены, стиль, настроение)'}
              {activeTab === 'text' && 'Опишите, какой текст нужен (тема, стиль, объем)'}
              {activeTab === 'presentation' && 'Опишите, что должно быть на изображении для слайда'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="prompt">Описание</Label>
              <Textarea
                id="prompt"
                placeholder={
                  activeTab === 'video' 
                    ? 'Например: Космический корабль летит через туманность, неоновые цвета, кинематографичный стиль'
                    : activeTab === 'text'
                    ? 'Например: Напиши статью о пользе медитации, 500 слов, научный стиль'
                    : 'Например: Современный офис с командой за работой, профессиональный стиль'
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            <Button 
              onClick={generateContent}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                  Генерация... (это может занять 1-2 минуты)
                </>
              ) : (
                <>
                  <Icon name="Sparkles" className="mr-2" size={20} />
                  Сгенерировать
                </>
              )}
            </Button>

            {generatedContent && (
              <div className="mt-6 p-4 border border-slate-700 rounded-lg bg-slate-900/50">
                <h3 className="text-lg font-semibold mb-4 text-white">Результат:</h3>
                
                {activeTab === 'video' && (
                  <video 
                    src={generatedContent} 
                    controls 
                    className="w-full rounded-lg"
                  />
                )}

                {activeTab === 'text' && (
                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-wrap text-slate-300">{generatedContent}</p>
                  </div>
                )}

                {activeTab === 'presentation' && (
                  <img 
                    src={generatedContent} 
                    alt="Generated slide" 
                    className="w-full rounded-lg"
                  />
                )}

                <Button 
                  onClick={() => {
                    if (activeTab === 'text') {
                      navigator.clipboard.writeText(generatedContent);
                      toast({ title: 'Скопировано!', description: 'Текст скопирован в буфер обмена' });
                    } else {
                      window.open(generatedContent, '_blank');
                    }
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  <Icon name={activeTab === 'text' ? 'Copy' : 'Download'} className="mr-2" size={18} />
                  {activeTab === 'text' ? 'Скопировать' : 'Скачать'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenerateContent;