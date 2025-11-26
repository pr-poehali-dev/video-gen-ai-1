export const useIndexGenerators = (
  toast: any,
  setIsGenerating: (generating: boolean) => void,
  setProgress: (progress: number) => void,
  setGeneratedContent: (content: string) => void,
  setGeneratedSlides: (slides: string[]) => void,
  handleIncrementRequest: () => void
) => {
  const handleVideoGenerate = async (
    videoPrompt: string,
    videoDuration: number,
    videoStyle: string,
    setIsVideoModalOpen: (open: boolean) => void,
    checkRequestLimit: () => boolean
  ) => {
    if (!checkRequestLimit()) return;
    
    if (!videoPrompt.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите описание видео',
        variant: 'destructive',
      });
      return;
    }
    
    setIsVideoModalOpen(true);
    setIsGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 2, 90));
    }, 3000);

    try {
      const polzaUrl = 'https://functions.poehali.dev/66e7d738-ea14-49df-9131-1bcee7141463';
      
      const response = await fetch(polzaUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'video',
          prompt: videoPrompt
        })
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Ошибка генерации видео');
      }

      const taskId = result.task_id;
      
      clearInterval(interval);
      
      toast({
        title: '⏳ Генерация запущена',
        description: 'Создаём видео... Обычно это занимает 1-2 минуты',
      });
      
      let attempts = 0;
      const maxAttempts = 60;
      const startTime = Date.now();
      
      while (attempts < maxAttempts) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const progressPercent = Math.min(10 + (elapsed / 120) * 85, 95);
        setProgress(progressPercent);
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const checkResponse = await fetch(polzaUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'check_video',
            task_id: taskId
          })
        });
        
        const checkResult = await checkResponse.json();
        
        if (checkResult.status === 'completed') {
          setProgress(100);
          setIsGenerating(false);
          
          const videoData = `data:video/mp4;base64,${checkResult.video_b64}`;
          setGeneratedContent(videoData);

          handleIncrementRequest();

          toast({
            title: '✅ Готово!',
            description: `Видео сгенерировано за ${elapsed} секунд`,
          });
          return;
        } else if (checkResult.status === 'failed' || checkResult.status === 'error') {
          throw new Error(checkResult.message || 'Генерация видео провалена');
        }
        
        attempts++;
      }
      
      throw new Error('Таймаут генерации видео (>3 минут)');
    } catch (error) {
      clearInterval(interval);
      setIsGenerating(false);
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось сгенерировать видео',
        variant: 'destructive',
      });
    }
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
      const polzaUrl = 'https://functions.poehali.dev/66e7d738-ea14-49df-9131-1bcee7141463';

      const response = await fetch(polzaUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'text',
          prompt: textPrompt,
          system_prompt: 'Ты полезный AI-ассистент. Отвечай кратко и по делу.'
        })
      });

      const result = await response.json();

      clearInterval(interval);
      setProgress(100);

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Ошибка генерации текста');
      }

      setIsGenerating(false);
      setGeneratedContent(result.text);

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

    const slides: string[] = [];

    try {
      const polzaUrl = 'https://functions.poehali.dev/66e7d738-ea14-49df-9131-1bcee7141463';
      
      for (let i = 0; i < presentationSlides; i++) {
        setProgress(Math.floor(((i + 1) / presentationSlides) * 90));
        
        const slidePrompt = `Создай слайд ${i + 1} из ${presentationSlides} для презентации на тему: ${presentationTopic}. Стиль: ${presentationStyle}`;
        
        const startResponse = await fetch(polzaUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'image',
            prompt: slidePrompt,
            size: '1024x1024'
          })
        });

        const startResult = await startResponse.json();

        if (!startResponse.ok || startResult.error) {
          throw new Error(startResult.error || `Ошибка генерации слайда ${i + 1}`);
        }

        const taskId = startResult.task_id;
        
        let imageBase64 = null;
        let attempts = 0;
        const maxAttempts = 60;
        const slideStartTime = Date.now();
        
        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const elapsed = Math.floor((Date.now() - slideStartTime) / 1000);
          const slideProgress = Math.floor(((i + elapsed / 60) / presentationSlides) * 90);
          setProgress(Math.min(slideProgress, 90));
          
          const checkResponse = await fetch(polzaUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'check_image',
              task_id: taskId
            })
          });
          
          const checkResult = await checkResponse.json();
          
          if (checkResult.status === 'completed') {
            imageBase64 = checkResult.image_b64;
            break;
          } else if (checkResult.status === 'failed' || checkResult.status === 'error') {
            throw new Error(checkResult.message || `Генерация слайда ${i + 1} провалена`);
          }
          
          attempts++;
        }
        
        if (!imageBase64) {
          throw new Error(`Таймаут генерации слайда ${i + 1}`);
        }

        slides.push(`data:image/png;base64,${imageBase64}`);
        
        toast({
          title: `✅ Слайд ${i + 1}/${presentationSlides}`,
          description: `Создан за ${Math.floor((Date.now() - slideStartTime) / 1000)} сек`,
        });
      }

      setProgress(100);
      setIsGenerating(false);
      setGeneratedSlides(slides);

      handleIncrementRequest();

      toast({
        title: 'Готово!',
        description: 'Презентация успешно создана',
      });
    } catch (error) {
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
      const polzaUrl = 'https://functions.poehali.dev/66e7d738-ea14-49df-9131-1bcee7141463';
      
      const styleMap: Record<string, string> = {
        photorealistic: 'photorealistic, highly detailed, sharp focus, professional photography',
        artistic: 'artistic style, painterly, creative interpretation',
        anime: 'anime style, manga art, vibrant colors',
        '3d': '3D render, CGI, high quality rendering'
      };

      const enhancedPrompt = `${photoPrompt}, ${styleMap[photoStyle] || ''}`;

      const startResponse = await fetch(polzaUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'image',
          prompt: enhancedPrompt,
          size: photoResolution
        })
      });

      const startResult = await startResponse.json();

      if (!startResponse.ok || startResult.error) {
        throw new Error(startResult.error || 'Ошибка генерации изображения');
      }

      const taskId = startResult.task_id;
      
      clearInterval(interval);
      
      toast({
        title: '🎨 Генерация запущена',
        description: 'Создаём изображение... Обычно это занимает 20-40 секунд',
      });
      
      let imageBase64 = null;
      let attempts = 0;
      const maxAttempts = 60;
      const startTime = Date.now();
      
      while (attempts < maxAttempts) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const progressPercent = Math.min(10 + (elapsed / 60) * 85, 95);
        setProgress(progressPercent);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const checkResponse = await fetch(polzaUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'check_image',
            task_id: taskId
          })
        });
        
        const checkResult = await checkResponse.json();
        
        if (checkResult.status === 'completed') {
          imageBase64 = checkResult.image_b64;
          break;
        } else if (checkResult.status === 'failed' || checkResult.status === 'error') {
          throw new Error(checkResult.message || 'Генерация изображения провалена');
        }
        
        attempts++;
      }
      
      if (!imageBase64) {
        throw new Error('Таймаут генерации изображения');
      }

      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setProgress(100);
      setIsGenerating(false);
      const imageData = `data:image/png;base64,${imageBase64}`;
      setGeneratedContent(imageData);

      handleIncrementRequest();

      toast({
        title: '✅ Готово!',
        description: `Изображение сгенерировано за ${elapsed} секунд`,
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
    handleVideoGenerate,
    handleTextGenerate,
    handlePresentationGenerate,
    handlePhotoGenerate
  };
};