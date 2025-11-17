import { useState, useEffect } from 'react';
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
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(0);
  const [imageStyle, setImageStyle] = useState<string>('photorealistic');

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
          prompt: prompt,
          style: activeTab === 'photo' ? imageStyle : undefined
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab === 'presentation' && presentationImages.length > 0) {
        if (e.key === 'ArrowLeft' && selectedSlideIndex > 0) {
          setSelectedSlideIndex(prev => prev - 1);
        } else if (e.key === 'ArrowRight' && selectedSlideIndex < presentationImages.length - 1) {
          setSelectedSlideIndex(prev => prev + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, presentationImages.length, selectedSlideIndex]);

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

            {activeTab === 'photo' && (
              <div>
                <Label htmlFor="imageStyle">Стиль изображения</Label>
                <select
                  id="imageStyle"
                  value={imageStyle}
                  onChange={(e) => setImageStyle(e.target.value)}
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
                  <h3 className="text-lg font-semibold text-white">✨ Презентация из {presentationImages.length} слайдов готова!</h3>
                  <Button 
                    onClick={() => {
                      presentationImages.forEach((img, i) => {
                        if (img.url && !img.isLoading) {
                          setTimeout(() => downloadImage(img.url, i), i * 200);
                        }
                      });
                    }}
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
                    {presentationImages[selectedSlideIndex] && (
                      <div className="h-full rounded-lg overflow-hidden bg-slate-900 border-2 border-pink-500/30 relative">
                        {presentationImages[selectedSlideIndex].isLoading ? (
                          <div className="h-full min-h-[400px] flex flex-col items-center justify-center">
                            <Icon name="Loader2" className="animate-spin text-pink-400 mb-4" size={48} />
                            <p className="text-lg text-slate-300">Генерация слайда {selectedSlideIndex + 1}...</p>
                          </div>
                        ) : presentationImages[selectedSlideIndex].url ? (
                          <>
                            <img
                              src={presentationImages[selectedSlideIndex].url}
                              alt={`Слайд ${selectedSlideIndex + 1}`}
                              className="w-full h-full object-contain min-h-[400px]"
                              style={{
                                animation: 'fadeInBlur 0.5s ease-out'
                              }}
                            />
                            <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-600 to-purple-600 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-white text-sm md:text-base font-semibold shadow-lg">
                              Слайд {selectedSlideIndex + 1} из {presentationImages.length}
                            </div>
                            <div className="absolute bottom-4 right-4 flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => downloadImage(presentationImages[selectedSlideIndex].url, selectedSlideIndex)}
                                className="bg-white/90 text-black hover:bg-white shadow-lg"
                              >
                                <Icon name="Download" className="md:mr-2" size={16} />
                                <span className="hidden md:inline">Скачать</span>
                              </Button>
                            </div>

                            {selectedSlideIndex > 0 && (
                              <Button
                                onClick={() => setSelectedSlideIndex(prev => prev - 1)}
                                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 md:p-3"
                                size="sm"
                              >
                                <Icon name="ChevronLeft" size={20} className="md:w-6 md:h-6" />
                              </Button>
                            )}

                            {selectedSlideIndex < presentationImages.length - 1 && (
                              <Button
                                onClick={() => setSelectedSlideIndex(prev => prev + 1)}
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
                    {presentationImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSlideIndex(index)}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer hover:scale-105 flex-shrink-0 md:flex-shrink ${
                          selectedSlideIndex === index 
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
                          selectedSlideIndex === index
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