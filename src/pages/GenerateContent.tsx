import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import ContentTypeTabs from '@/components/generate/ContentTypeTabs';
import GenerationForm from '@/components/generate/GenerationForm';
import PresentationViewer from '@/components/generate/PresentationViewer';
import ContentResult from '@/components/generate/ContentResult';

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
  const [pollingPredictionId, setPollingPredictionId] = useState<string | null>(null);

  const checkVideoStatus = async (predictionId: string) => {
    const token = localStorage.getItem('auth_token') || 'demo';
    
    try {
      const response = await fetch(`https://functions.poehali.dev/500cc697-682b-469a-b439-fa265e84c833?action=check_status&prediction_id=${predictionId}`, {
        method: 'GET',
        headers: {
          'X-User-Token': token
        }
      });

      const data = await response.json();
      
      if (data.status === 'completed') {
        setGeneratedContent(data.video_url);
        setIsGenerating(false);
        setPollingPredictionId(null);
        toast({
          title: '✅ Видео готово!',
          description: 'Генерация завершена успешно',
        });
      } else if (data.status === 'failed') {
        setIsGenerating(false);
        setPollingPredictionId(null);
        toast({
          title: 'Ошибка генерации',
          description: data.error || 'Не удалось создать видео',
          variant: 'destructive'
        });
      } else if (data.status === 'processing') {
        setTimeout(() => checkVideoStatus(predictionId), 5000);
      }
    } catch (error) {
      console.error('Ошибка проверки статуса:', error);
      setTimeout(() => checkVideoStatus(predictionId), 5000);
    }
  };

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
        // Если это видео и есть generation_id, но нет URL - запускаем polling
        if (activeTab === 'video' && data.generation_id && !data.content_url) {
          setPollingPredictionId(data.generation_id);
          toast({
            title: '🎬 Генерация запущена',
            description: 'Создаем видео... Это займет 1-3 минуты',
          });
          checkVideoStatus(data.generation_id);
        } else {
          setGeneratedContent(data.content_url);
          setIsDemo(data.is_demo || false);
          setIsGenerating(false);
          toast({
            title: data.is_demo ? '✨ Демо-версия' : 'Готово!',
            description: data.message || `${activeTab === 'video' ? 'Видео' : activeTab === 'text' ? 'Текст' : 'Изображение'} успешно создано`,
          });
        }
      } else {
        throw new Error(data.error || 'Ошибка генерации');
      }
    } catch (error) {
      toast({
        title: 'Ошибка генерации',
        description: error instanceof Error ? error.message : 'Попробуйте позже',
        variant: 'destructive'
      });
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

  const handleDownloadAll = () => {
    presentationImages.forEach((img, i) => {
      if (img.url && !img.isLoading) {
        setTimeout(() => downloadImage(img.url, i), i * 200);
      }
    });
  };

  const handleCopyOrDownload = () => {
    if (activeTab === 'text' && generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      toast({ title: 'Скопировано!', description: 'Текст скопирован в буфер обмена' });
    } else if (generatedContent) {
      window.open(generatedContent, '_blank');
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

        <ContentTypeTabs activeTab={activeTab} onTabChange={setActiveTab} />

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
            <GenerationForm
              activeTab={activeTab}
              prompt={prompt}
              onPromptChange={setPrompt}
              slideCount={slideCount}
              onSlideCountChange={setSlideCount}
              imageStyle={imageStyle}
              onImageStyleChange={setImageStyle}
              isGenerating={isGenerating}
              onGenerate={generateContent}
            />

            <PresentationViewer
              images={presentationImages}
              selectedIndex={selectedSlideIndex}
              onSelectIndex={setSelectedSlideIndex}
              onDownloadImage={downloadImage}
              onDownloadAll={handleDownloadAll}
            />

            <ContentResult
              activeTab={activeTab}
              content={generatedContent}
              onCopyOrDownload={handleCopyOrDownload}
              isGenerating={isGenerating}
            />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default GenerateContent;