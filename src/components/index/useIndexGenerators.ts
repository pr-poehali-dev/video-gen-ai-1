export const useIndexGenerators = (
  toast: any,
  setIsGenerating: (generating: boolean) => void,
  setProgress: (progress: number) => void,
  setGeneratedContent: (content: string) => void,
  setGeneratedSlides: (slides: string[]) => void,
  handleIncrementRequest: () => void
) => {
  const simulateGeneration = async (type: 'video' | 'text' | 'presentation', prompt: string, duration?: number, style?: string) => {
    if (!prompt.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните поле запроса',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 5, 90));
    }, 500);

    try {
      const apiUrl = 'https://functions.poehali.dev/500cc697-682b-469a-b439-fa265e84c833';
      
      const styleMap: Record<string, string> = {
        cinematic: 'cinematic camera work, film grain, movie quality, dramatic lighting',
        realistic: 'photorealistic, natural lighting, real world footage, documentary style',
        animated: '3D animation, cartoon style, smooth motion, vibrant colors',
        artistic: 'artistic style, creative visuals, expressive, stylized'
      };

      const body = type === 'video' 
        ? { 
            type: 'video', 
            prompt: style ? `${prompt}, ${styleMap[style] || ''}` : prompt, 
            duration: duration || 5 
          }
        : type === 'presentation'
        ? { type: 'presentation_image', prompt }
        : { type: 'text', prompt };

      console.log('🚀 Отправка запроса:', type);
      console.log('📝 Body:', JSON.stringify(body, null, 2));

      const response = await fetch(`${apiUrl}?action=generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      console.log('📦 Статус ответа:', response.status);
      console.log('📦 Результат:', JSON.stringify(result, null, 2));

      clearInterval(interval);
      setProgress(100);

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Ошибка генерации');
      }

      setIsGenerating(false);

      if (type === 'video') {
        setGeneratedContent(result.url || result.content_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
      } else if (type === 'text') {
        setGeneratedContent(result.content_url || result.text || 'Текст сгенерирован успешно!');
      } else if (type === 'presentation') {
        setGeneratedContent(result.url || result.content_url || '');
      }

      handleIncrementRequest();

      toast({
        title: 'Готово!',
        description: `${type === 'video' ? 'Видео' : type === 'presentation' ? 'Презентация' : 'Текст'} успешно ${result.is_demo ? 'создан (демо)' : 'сгенерирован'}`,
      });
    } catch (error) {
      clearInterval(interval);
      setIsGenerating(false);
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось сгенерировать контент',
        variant: 'destructive',
      });
    }
  };

  const handleVideoGenerate = (
    videoPrompt: string,
    videoDuration: number,
    videoStyle: string,
    setIsVideoModalOpen: (open: boolean) => void,
    checkRequestLimit: () => boolean
  ) => {
    console.log('🎬 handleVideoGenerate вызван', { videoPrompt, videoDuration, videoStyle });
    
    if (!checkRequestLimit()) {
      console.log('❌ Лимит запросов исчерпан');
      return;
    }
    
    if (!videoPrompt.trim()) {
      console.log('❌ Пустой промпт');
      toast({
        title: 'Ошибка',
        description: 'Введите описание видео',
        variant: 'destructive',
      });
      return;
    }
    
    console.log('✅ Открываю модальное окно и запускаю генерацию');
    setIsVideoModalOpen(true);
    simulateGeneration('video', videoPrompt, videoDuration, videoStyle);
  };

  const handleTextGenerate = async (
    textPrompt: string,
    setIsTextModalOpen: (open: boolean) => void,
    checkRequestLimit: () => boolean
  ) => {
    if (!textPrompt.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите запрос для генерации текста',
        variant: 'destructive',
      });
      return;
    }

    if (!checkRequestLimit()) return;

    setIsTextModalOpen(true);
    setIsGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 5, 90));
    }, 500);

    try {
      const apiUrl = 'https://functions.poehali.dev/afb4ee36-6a99-4357-b02b-de653bf882bc';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: textPrompt
            }
          ],
          max_tokens: 1000
        })
      });

      const result = await response.json();

      clearInterval(interval);
      setProgress(100);

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Ошибка генерации текста');
      }

      setIsGenerating(false);
      setGeneratedContent(result.response);

      handleIncrementRequest();

      toast({
        title: 'Готово!',
        description: 'Текст успешно сгенерирован',
      });
    } catch (error) {
      clearInterval(interval);
      setIsGenerating(false);
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось сгенерировать текст',
        variant: 'destructive',
      });
    }
  };

  const handlePresentationGenerate = async (
    presentationTopic: string,
    presentationSlides: number,
    presentationStyle: string,
    setIsPresentationModalOpen: (open: boolean) => void,
    checkRequestLimit: () => boolean
  ) => {
    if (!presentationTopic.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите тему презентации',
        variant: 'destructive',
      });
      return;
    }

    if (!checkRequestLimit()) return;

    setIsPresentationModalOpen(true);
    setIsGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.floor(100 / presentationSlides), 90));
    }, 1000);

    try {
      const apiUrl = 'https://functions.poehali.dev/34147c53-3589-4dc6-9c1b-3170886e1a99';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: presentationTopic,
          slides: presentationSlides,
          style: presentationStyle
        })
      });

      const result = await response.json();

      clearInterval(interval);
      setProgress(100);

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Ошибка генерации презентации');
      }

      setIsGenerating(false);
      setGeneratedSlides(result.slides || []);

      handleIncrementRequest();

      toast({
        title: 'Готово!',
        description: 'Презентация успешно создана',
      });
    } catch (error) {
      clearInterval(interval);
      setIsGenerating(false);
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось создать презентацию',
        variant: 'destructive',
      });
    }
  };

  const handlePhotoGenerate = async (
    photoPrompt: string,
    photoStyle: string,
    photoResolution: string,
    setIsPhotoModalOpen: (open: boolean) => void,
    checkRequestLimit: () => boolean
  ) => {
    if (!photoPrompt.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите описание изображения',
        variant: 'destructive',
      });
      return;
    }

    if (!checkRequestLimit()) return;

    setIsPhotoModalOpen(true);
    setIsGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      const apiUrl = 'https://functions.poehali.dev/500cc697-682b-469a-b439-fa265e84c833';
      
      const styleMap: Record<string, string> = {
        photorealistic: 'photorealistic, highly detailed, sharp focus, professional photography',
        artistic: 'artistic style, painterly, creative interpretation',
        anime: 'anime style, manga art, vibrant colors',
        '3d': '3D render, CGI, high quality rendering'
      };

      const enhancedPrompt = `${photoPrompt}, ${styleMap[photoStyle] || ''}`;

      const response = await fetch(`${apiUrl}?action=generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'image',
          prompt: enhancedPrompt,
          size: photoResolution
        })
      });

      const result = await response.json();

      clearInterval(interval);
      setProgress(100);

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Ошибка генерации изображения');
      }

      setIsGenerating(false);
      setGeneratedContent(result.url || result.content_url || '');

      handleIncrementRequest();

      toast({
        title: 'Готово!',
        description: 'Изображение успешно сгенерировано',
      });
    } catch (error) {
      clearInterval(interval);
      setIsGenerating(false);
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось сгенерировать изображение',
        variant: 'destructive',
      });
    }
  };

  return {
    simulateGeneration,
    handleVideoGenerate,
    handleTextGenerate,
    handlePresentationGenerate,
    handlePhotoGenerate
  };
};
