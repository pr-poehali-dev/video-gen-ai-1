import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';

interface GeneratedImage {
  url: string;
  prompt: string;
  isLoading: boolean;
}

const GenerateContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'video' | 'text' | 'presentation' | 'photo'>('video');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [presentationImages, setPresentationImages] = useState<GeneratedImage[]>([]);
  const [slideCount, setSlideCount] = useState<number>(5);

  const generateSingleImage = async (slidePrompt: string, index: number) => {
    const token = localStorage.getItem('auth_token') || 'demo';
    
    try {
      const response = await fetch('https://functions.poehali.dev/500cc697-682b-469a-b439-fa265e84c833?action=generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Token': token
        },
        body: JSON.stringify({
          type: 'image',
          prompt: slidePrompt
        })
      });

      const data = await response.json();

      if (data.success) {
        setPresentationImages(prev => 
          prev.map((img, i) => 
            i === index ? { ...img, url: data.content_url, isLoading: false } : img
          )
        );
      } else {
        setPresentationImages(prev => 
          prev.map((img, i) => 
            i === index ? { ...img, isLoading: false } : img
          )
        );
        throw new Error(data.error);
      }
    } catch (error) {
      console.error(`Ошибка генерации слайда ${index + 1}:`, error);
    }
  };

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, введите описание',
        variant: 'destructive'
      });
      return;
    }

    const isAuth = localStorage.getItem('isAuthenticated');
    if (!isAuth) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите в аккаунт для генерации контента',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent(null);

    if (activeTab === 'presentation') {
      const initialImages: GeneratedImage[] = Array.from({ length: slideCount }, (_, i) => ({
        url: '',
        prompt: `${prompt}, slide ${i + 1}, professional presentation style`,
        isLoading: true
      }));
      
      setPresentationImages(initialImages);
      
      toast({
        title: '🚀 Запущена генерация',
        description: `Создаю ${slideCount} изображений для презентации...`,
      });

      Promise.all(
        initialImages.map((img, index) => generateSingleImage(img.prompt, index))
      ).then(() => {
        setIsGenerating(false);
        toast({
          title: '✅ Презентация готова!',
          description: `Все ${slideCount} слайдов успешно созданы`,
        });
      });

      return;
    }

    try {
      const token = localStorage.getItem('auth_token') || 'demo';
      const response = await fetch('https://functions.poehali.dev/500cc697-682b-469a-b439-fa265e84c833?action=generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Token': token
        },
        body: JSON.stringify({
          type: activeTab === 'photo' ? 'image' : activeTab,
          prompt: prompt
        })
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedContent(data.content_url);
        setIsDemo(data.is_demo || false);
        toast({
          title: data.is_demo ? '✨ Демо-версия' : 'Готово!',
          description: data.message || `${activeTab === 'video' ? 'Видео' : activeTab === 'text' ? 'Текст' : 'Изображение'} успешно создано`,
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

  const downloadImage = async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `slide-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: '✅ Скачано',
        description: `Слайд ${index + 1} сохранен`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось скачать изображение',
        variant: 'destructive'
      });
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



        <div className="grid gap-6 md:grid-cols-4 mb-8">
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
              <CardDescription>Создайте серию изображений для презентации</CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${activeTab === 'photo' ? 'border-green-500 bg-green-500/10' : 'border-slate-700'}`}
            onClick={() => setActiveTab('photo')}
          >
            <CardHeader>
              <Icon name="Image" className="mb-2 text-green-400" size={32} />
              <CardTitle>Фото</CardTitle>
              <CardDescription>Генерация изображений через AI</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="border-slate-700">
          <CardHeader>
            <CardTitle>
              {activeTab === 'video' && 'Создать видео'}
              {activeTab === 'text' && 'Сгенерировать текст'}
              {activeTab === 'presentation' && 'Создать презентацию'}
              {activeTab === 'photo' && 'Создать фото'}
            </CardTitle>
            <CardDescription>
              {activeTab === 'video' && 'Опишите, какое видео вы хотите создать (сцены, стиль, настроение)'}
              {activeTab === 'text' && 'Опишите, какой текст нужен (тема, стиль, объем)'}
              {activeTab === 'presentation' && 'Опишите тему презентации, и я создам серию уникальных изображений для слайдов'}
              {activeTab === 'photo' && 'Опишите, какое изображение вы хотите создать'}
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
                    : activeTab === 'photo'
                    ? 'Например: Красивый закат над океаном, фотореалистичный стиль, 4K качество'
                    : 'Например: Презентация о цифровом маркетинге, современный стиль, минимализм'
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
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
                  onChange={(e) => setSlideCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 5)))}
                  className="w-32"
                />
              </div>
            )}

            <Button 
              onClick={generateContent}
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

            {activeTab === 'presentation' && presentationImages.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Галерея слайдов:</h3>
                  <Button 
                    onClick={() => {
                      presentationImages.forEach((img, i) => {
                        if (img.url && !img.isLoading) {
                          setTimeout(() => downloadImage(img.url, i), i * 200);
                        }
                      });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Icon name="Download" className="mr-2" size={16} />
                    Скачать все
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {presentationImages.map((image, index) => (
                    <Card key={index} className="border-slate-700 overflow-hidden group">
                      <div className="relative aspect-video bg-slate-800">
                        {image.isLoading ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Icon name="Loader2" className="animate-spin text-pink-400 mb-2" size={32} />
                            <p className="text-sm text-slate-400">Генерация слайда {index + 1}...</p>
                          </div>
                        ) : image.url ? (
                          <>
                            <img
                              src={image.url}
                              alt={`Slide ${index + 1}`}
                              className="w-full h-full object-cover transition-all duration-700 ease-out"
                              style={{
                                animation: 'fadeInBlur 1s ease-out'
                              }}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => downloadImage(image.url, index)}
                                className="bg-white/90 text-black hover:bg-white"
                              >
                                <Icon name="Download" size={16} />
                              </Button>
                            </div>
                            <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                              Слайд {index + 1}
                            </div>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon name="AlertCircle" className="text-red-400" size={32} />
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {generatedContent && activeTab !== 'presentation' && (
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

                {activeTab === 'presentation' && presentationImages.length === 0 && (
                  <img 
                    src={generatedContent} 
                    alt="Generated slide" 
                    className="w-full rounded-lg"
                  />
                )}

                {activeTab === 'photo' && (
                  <img 
                    src={generatedContent} 
                    alt="Generated photo" 
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
      <Footer />
    </div>
  );
};

export default GenerateContent;