import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import GeneratorModals from '@/components/GeneratorModals';
import ContactForm from '@/components/ContactForm';

const Index = () => {
  const { toast } = useToast();
  const [videoPrompt, setVideoPrompt] = useState('');
  const [textPrompt, setTextPrompt] = useState('');
  const [presentationTopic, setPresentationTopic] = useState('');
  
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isPresentationModalOpen, setIsPresentationModalOpen] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const simulateGeneration = async (type: 'video' | 'text' | 'presentation', prompt: string) => {
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
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsGenerating(false);
    setProgress(100);

    if (type === 'video') {
      setGeneratedContent('Ваше видео успешно создано! В реальном приложении здесь будет плеер с видео.');
    } else if (type === 'text') {
      setGeneratedContent(`# ${prompt}\n\nЭто демо-версия AI генератора текста. В полной версии здесь будет сгенерированный текст на основе вашего запроса.\n\nИскусственный интеллект анализирует ваш запрос и создает уникальный контент, соответствующий вашим требованиям. Текст будет структурированным, информативным и готовым к использованию.`);
    } else if (type === 'presentation') {
      setGeneratedContent('Ваша презентация готова! В реальном приложении здесь будет превью слайдов и возможность скачивания.');
    }

    toast({
      title: 'Готово!',
      description: 'Контент успешно сгенерирован',
    });
  };

  const handleVideoGenerate = () => {
    setIsVideoModalOpen(true);
    simulateGeneration('video', videoPrompt);
  };

  const handleTextGenerate = () => {
    setIsTextModalOpen(true);
    simulateGeneration('text', textPrompt);
  };

  const handlePresentationGenerate = () => {
    setIsPresentationModalOpen(true);
    simulateGeneration('presentation', presentationTopic);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 floating"></div>
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 floating-delayed"></div>
        <div className="absolute -bottom-20 left-1/3 w-[450px] h-[450px] bg-gradient-to-br from-pink-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 floating-slow"></div>
        
        <svg className="absolute top-0 left-0 w-full h-full opacity-30 wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="url(#gradient1)" fillOpacity="0.1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,133.3C960,128,1056,96,1152,90.7C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        
        <svg className="absolute bottom-0 left-0 w-full h-full opacity-20 wave-slow" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="url(#gradient2)" fillOpacity="0.1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,181.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <defs>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <Header 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        scrollToSection={scrollToSection}
      />

      <main className="relative z-10 pt-24">
        <section id="home" className="min-h-screen flex items-center justify-center px-6">
          <div className="container mx-auto text-center animate-fade-in">
            <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 px-6 py-2 text-sm font-semibold pulse-glow border-0">
              ✨ Новое поколение AI инструментов
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-violet-600 bg-clip-text text-transparent leading-tight gradient-animate">
              ROUSHEN<br />Создавайте с AI
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto px-4 font-medium">
              Генерируйте видео, пишите тексты и создавайте презентации за секунды.<br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">Искусственный интеллект</span> нового поколения для ваших задач.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-500 to-violet-600 hover:from-purple-700 hover:via-pink-600 hover:to-violet-700 text-white text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 shadow-xl hover:shadow-2xl transition-all duration-300 pulse-glow font-semibold"
                onClick={() => scrollToSection('generators')}
              >
                <Icon name="Sparkles" className="mr-2" size={20} />
                Попробовать сейчас
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 font-semibold transition-all duration-300"
                onClick={() => scrollToSection('about')}
              >
                <Icon name="Play" className="mr-2" size={20} />
                Смотреть демо
              </Button>
            </div>

            <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              <Card className="gradient-blur border-white/40 hover:scale-105 hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon name="Video" className="text-white" size={28} />
                  </div>
                  <CardTitle className="text-center font-bold">Генерация видео</CardTitle>
                  <CardDescription className="text-center">Создавайте профессиональные видео из текста</CardDescription>
                </CardHeader>
              </Card>

              <Card className="gradient-blur border-white/40 hover:scale-105 hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon name="FileText" className="text-white" size={28} />
                  </div>
                  <CardTitle className="text-center font-bold">Текстовый редактор</CardTitle>
                  <CardDescription className="text-center">Пишите статьи и доклады с AI-ассистентом</CardDescription>
                </CardHeader>
              </Card>

              <Card className="gradient-blur border-white/40 hover:scale-105 hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon name="Presentation" className="text-white" size={28} />
                  </div>
                  <CardTitle className="text-center font-bold">Презентации</CardTitle>
                  <CardDescription className="text-center">Создавайте впечатляющие слайды за минуты</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section id="generators" className="min-h-screen py-20 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-violet-600 bg-clip-text text-transparent gradient-animate">
                AI Генераторы
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 px-4 font-medium">Выберите инструмент и начните создавать</p>
            </div>

            <Tabs defaultValue="video" className="max-w-5xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/60 backdrop-blur-sm p-1 h-auto">
                <TabsTrigger value="video" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white py-3 text-sm md:text-base font-semibold transition-all duration-300">
                  <Icon name="Video" className="mr-1 md:mr-2" size={18} />
                  <span className="hidden sm:inline">Видео</span>
                  <span className="sm:hidden">Вид</span>
                </TabsTrigger>
                <TabsTrigger value="text" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white py-3 text-sm md:text-base font-semibold transition-all duration-300">
                  <Icon name="FileText" className="mr-1 md:mr-2" size={18} />
                  <span className="hidden sm:inline">Текст</span>
                  <span className="sm:hidden">Тек</span>
                </TabsTrigger>
                <TabsTrigger value="presentation" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-purple-500 data-[state=active]:text-white py-3 text-sm md:text-base font-semibold transition-all duration-300">
                  <Icon name="Presentation" className="mr-1 md:mr-2" size={18} />
                  <span className="hidden sm:inline">Презентация</span>
                  <span className="sm:hidden">През</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="video" className="animate-fade-in">
                <Card className="gradient-blur border-white/40">
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl">Генератор видео</CardTitle>
                    <CardDescription className="text-sm md:text-base">Опишите, какое видео вы хотите создать</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 sm:p-6">
                    <Textarea 
                      placeholder="Например: Создай видео о закате на океане с чайками и спокойной музыкой..."
                      className="min-h-32 resize-none bg-white/80"
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                    />
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button onClick={handleVideoGenerate} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                        <Icon name="Sparkles" className="mr-2" size={18} />
                        Сгенерировать видео
                      </Button>
                      <Button variant="outline" className="border-purple-300 hover:border-purple-400 hover:bg-purple-50 sm:w-auto transition-all duration-300">
                        <Icon name="Settings" size={18} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 pt-4">
                      <div className="text-center p-3 md:p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                        <Icon name="Film" className="mx-auto mb-2 text-purple-600" size={20} />
                        <p className="text-xs md:text-sm font-semibold text-purple-700">Full HD</p>
                      </div>
                      <div className="text-center p-3 md:p-4 bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-lg border border-violet-100">
                        <Icon name="Music" className="mx-auto mb-2 text-violet-600" size={20} />
                        <p className="text-xs md:text-sm font-semibold text-violet-700">Со звуком</p>
                      </div>
                      <div className="text-center p-3 md:p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border border-pink-100">
                        <Icon name="Zap" className="mx-auto mb-2 text-pink-600" size={20} />
                        <p className="text-xs md:text-sm font-semibold text-pink-700">За 30 сек</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="text" className="animate-fade-in">
                <Card className="gradient-blur border-white/40">
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl">Текстовый редактор AI</CardTitle>
                    <CardDescription className="text-sm md:text-base">Создайте статью, доклад или любой текст</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 sm:p-6">
                    <Input 
                      placeholder="Тема текста (например: История искусственного интеллекта)"
                      className="bg-white/80"
                      value={textPrompt}
                      onChange={(e) => setTextPrompt(e.target.value)}
                    />
                    <Textarea 
                      placeholder="Дополнительные детали или требования к тексту..."
                      className="min-h-32 resize-none bg-white/80"
                    />
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button onClick={handleTextGenerate} className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                        <Icon name="Sparkles" className="mr-2" size={18} />
                        Написать текст
                      </Button>
                      <Button variant="outline" className="border-violet-300 hover:border-violet-400 hover:bg-violet-50 sm:w-auto transition-all duration-300">
                        <Icon name="Download" size={18} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 pt-4">
                      <div className="text-center p-3 md:p-4 bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-lg border border-violet-100">
                        <Icon name="FileText" className="mx-auto mb-2 text-violet-600" size={20} />
                        <p className="text-xs md:text-sm font-semibold text-violet-700">До 10 000 слов</p>
                      </div>
                      <div className="text-center p-3 md:p-4 bg-gradient-to-br from-fuchsia-50 to-purple-50 rounded-lg border border-fuchsia-100">
                        <Icon name="Languages" className="mx-auto mb-2 text-fuchsia-600" size={20} />
                        <p className="text-xs md:text-sm font-semibold text-fuchsia-700">50+ языков</p>
                      </div>
                      <div className="text-center p-3 md:p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                        <Icon name="Sparkles" className="mx-auto mb-2 text-purple-600" size={20} />
                        <p className="text-xs md:text-sm font-semibold text-purple-700">AI улучшение</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="presentation" className="animate-fade-in">
                <Card className="gradient-blur border-white/40">
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl">Конструктор презентаций</CardTitle>
                    <CardDescription className="text-sm md:text-base">Создайте профессиональную презентацию за минуты</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 sm:p-6">
                    <Input 
                      placeholder="Тема презентации"
                      className="bg-white/80"
                      value={presentationTopic}
                      onChange={(e) => setPresentationTopic(e.target.value)}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium mb-2 block">Количество слайдов</label>
                        <Input type="number" defaultValue="10" className="bg-white/80" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium mb-2 block">Стиль</label>
                        <select className="w-full h-10 px-3 rounded-md border bg-white/80 text-sm">
                          <option>Минимализм</option>
                          <option>Бизнес</option>
                          <option>Креативный</option>
                          <option>Академический</option>
                        </select>
                      </div>
                    </div>
                    <Textarea 
                      placeholder="Основные пункты презентации..."
                      className="min-h-32 resize-none bg-white/80"
                    />
                    <Button onClick={handlePresentationGenerate} className="w-full bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-700 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                      <Icon name="Sparkles" className="mr-2" size={18} />
                      Создать презентацию
                    </Button>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 pt-4">
                      <div className="text-center p-3 md:p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border border-pink-100">
                        <Icon name="Layout" className="mx-auto mb-2 text-pink-600" size={20} />
                        <p className="text-xs md:text-sm font-semibold text-pink-700">50+ шаблонов</p>
                      </div>
                      <div className="text-center p-3 md:p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                        <Icon name="Palette" className="mx-auto mb-2 text-purple-600" size={20} />
                        <p className="text-xs md:text-sm font-semibold text-purple-700">Свой дизайн</p>
                      </div>
                      <div className="text-center p-3 md:p-4 bg-gradient-to-br from-violet-50 to-pink-50 rounded-lg border border-violet-100">
                        <Icon name="Download" className="mx-auto mb-2 text-violet-600" size={20} />
                        <p className="text-xs md:text-sm font-semibold text-violet-700">PPT/PDF</p>
                      </div>
                      <div className="text-center p-3 md:p-4 bg-gradient-to-br from-fuchsia-50 to-purple-50 rounded-lg border border-fuchsia-100">
                        <Icon name="Users" className="mx-auto mb-2 text-fuchsia-600" size={20} />
                        <p className="text-xs md:text-sm font-semibold text-fuchsia-700">Совместная работа</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section id="about" className="py-20 px-6">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-violet-600 bg-clip-text text-transparent gradient-animate">
                О сервисе
              </h2>
              <p className="text-xl text-gray-700 mb-12 font-medium">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">ROUSHEN</span> — это платформа нового поколения для создания контента с использованием искусственного интеллекта. 
                Мы объединили лучшие AI-модели для генерации видео, текстов и презентаций в одном удобном интерфейсе.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mt-16">
                <Card className="gradient-blur border-white/40 text-left hover:scale-105 hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon name="Zap" className="text-white" size={32} />
                    </div>
                    <CardTitle className="font-bold">Быстро и просто</CardTitle>
                    <CardDescription>
                      Создавайте профессиональный контент за считанные минуты без специальных навыков
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="gradient-blur border-white/40 text-left hover:scale-105 hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon name="Shield" className="text-white" size={32} />
                    </div>
                    <CardTitle className="font-bold">Безопасность данных</CardTitle>
                    <CardDescription>
                      Ваши данные защищены современными методами шифрования и не передаются третьим лицам
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="gradient-blur border-white/40 text-left hover:scale-105 hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon name="Cpu" className="text-white" size={32} />
                    </div>
                    <CardTitle className="font-bold">Передовые AI-модели</CardTitle>
                    <CardDescription>
                      Используем последние достижения в области искусственного интеллекта и машинного обучения
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="gradient-blur border-white/40 text-left hover:scale-105 hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-violet-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon name="Headphones" className="text-white" size={32} />
                    </div>
                    <CardTitle className="font-bold">Поддержка 24/7</CardTitle>
                    <CardDescription>
                      Наша команда всегда готова помочь вам с любыми вопросами и проблемами
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-violet-600 bg-clip-text text-transparent gradient-animate">
                Тарифы
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 px-4 font-medium">Выберите план, который подходит именно вам</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              <Card className="gradient-blur border-white/40 hover:scale-105 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Старт</CardTitle>
                  <CardDescription>Для личного использования</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">Бесплатно</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-600 mr-2" size={20} />
                      <span>5 видео в месяц</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-600 mr-2" size={20} />
                      <span>10 текстов в месяц</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-600 mr-2" size={20} />
                      <span>3 презентации</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-600 mr-2" size={20} />
                      <span>HD качество</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                    Начать бесплатно
                  </Button>
                </CardContent>
              </Card>

              <Card className="gradient-blur border-purple-300 border-2 hover:scale-105 hover:shadow-2xl transition-all duration-300 relative pulse-glow">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 via-pink-500 to-violet-600 text-white font-bold px-6 py-1 shadow-lg">
                  Популярный
                </Badge>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Про</CardTitle>
                  <CardDescription>Для профессионалов</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">990₽</span>
                    <span className="text-gray-600">/месяц</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-600 mr-2" size={20} />
                      <span>50 видео в месяц</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-600 mr-2" size={20} />
                      <span>Безлимит текстов</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-600 mr-2" size={20} />
                      <span>30 презентаций</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-600 mr-2" size={20} />
                      <span>Full HD качество</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-600 mr-2" size={20} />
                      <span>Приоритетная поддержка</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 via-pink-500 to-violet-600 hover:from-purple-700 hover:via-pink-600 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                    Выбрать план
                  </Button>
                </CardContent>
              </Card>

              <Card className="gradient-blur border-white/40 hover:scale-105 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Бизнес</CardTitle>
                  <CardDescription>Для команд и компаний</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">2990₽</span>
                    <span className="text-gray-600">/месяц</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-600 mr-2" size={20} />
                      <span>Безлимит видео</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-600 mr-2" size={20} />
                      <span>Безлимит текстов</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-600 mr-2" size={20} />
                      <span>Безлимит презентаций</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-600 mr-2" size={20} />
                      <span>4K качество</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-600 mr-2" size={20} />
                      <span>Персональный менеджер</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                    Связаться с нами
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="contacts" className="py-20 px-6">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-violet-600 bg-clip-text text-transparent gradient-animate">
                  Контакты
                </h2>
                <p className="text-lg sm:text-xl text-gray-700 px-4 font-medium">Свяжитесь с нами любым удобным способом</p>
              </div>

              <Card className="gradient-blur border-white/40">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Icon name="Mail" className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <a href="mailto:Rpmxxx@mail.ru" className="text-gray-600 hover:text-purple-600 transition-colors block font-medium">Rpmxxx@mail.ru</a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Icon name="Phone" className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Телефон</h3>
                        <a href="tel:+79282264638" className="text-gray-600 hover:text-purple-600 transition-colors block font-medium">+7 928 226-46-38</a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Icon name="MapPin" className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Адрес</h3>
                        <p className="text-gray-600">г. Ростов-на-Дону,</p>
                        <p className="text-gray-600">пер. Технологический, 8И</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-violet-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Icon name="Clock" className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Режим работы</h3>
                        <p className="text-gray-600">Пн-Пт: 9:00 - 18:00</p>
                        <p className="text-gray-600">Поддержка: 24/7</p>
                      </div>
                    </div>
                  </div>

                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-purple-200/30 gradient-blur py-12 px-6 mt-20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg pulse-glow">
                <Icon name="Sparkles" className="text-white" size={28} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-violet-600 bg-clip-text text-transparent gradient-animate">
                ROUSHEN
              </span>
            </div>
            <div className="text-gray-700 text-sm font-medium">
              © 2024 ROUSHEN. Все права защищены.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-all duration-300 hover:scale-110">
                <Icon name="Twitter" size={22} />
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-600 transition-all duration-300 hover:scale-110">
                <Icon name="Github" size={22} />
              </a>
              <a href="#" className="text-gray-600 hover:text-violet-600 transition-all duration-300 hover:scale-110">
                <Icon name="Linkedin" size={22} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <GeneratorModals 
        isVideoModalOpen={isVideoModalOpen}
        setIsVideoModalOpen={setIsVideoModalOpen}
        isTextModalOpen={isTextModalOpen}
        setIsTextModalOpen={setIsTextModalOpen}
        isPresentationModalOpen={isPresentationModalOpen}
        setIsPresentationModalOpen={setIsPresentationModalOpen}
        isGenerating={isGenerating}
        progress={progress}
        generatedContent={generatedContent}
      />
    </div>
  );
};

export default Index;