import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import Header from '@/components/Header';
import GeneratorModals from '@/components/GeneratorModals';
import ContactForm from '@/components/ContactForm';

const Index = () => {
  const { toast } = useToast();
  const aboutSection = useScrollAnimation(0.2);
  const pricingSection = useScrollAnimation(0.2);
  const contactSection = useScrollAnimation(0.2);
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
    <div className="min-h-screen bg-[#0f1729] relative overflow-hidden">
      <div className="scan-line"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-cyan-500/10 rounded-full filter blur-3xl opacity-50 floating glow-pulse-cyan"></div>
        <div className="absolute top-40 right-20 w-[700px] h-[700px] bg-purple-500/10 rounded-full filter blur-3xl opacity-40 floating-delayed glow-pulse-purple"></div>
        <div className="absolute -bottom-20 left-1/3 w-[500px] h-[500px] bg-blue-500/10 rounded-full filter blur-3xl opacity-30 floating-slow"></div>
        
        <div className="absolute inset-0 grid-pulse" style={{
          backgroundImage: `
            linear-gradient(rgba(100, 255, 218, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 255, 218, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <Header 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        scrollToSection={scrollToSection}
      />

      <main className="relative z-10 pt-24">
        <section id="home" className="min-h-screen flex items-center justify-center px-6">
          <div className="container mx-auto text-center animate-fade-in">
            <Badge className="mb-6 bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 px-6 py-2 text-sm font-semibold glow-pulse-purple">
              ✨ Новое поколение AI инструментов
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent text-flicker neon-flicker">ROUSHEN</span>
              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2 bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent text-shadow-purple">AI-решения<br className="sm:hidden" /> с молодым драйвом<br />и высоким качеством</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-cyan-100/70 mb-12 max-w-3xl mx-auto px-4 font-light leading-relaxed">
              Мы объединяем технологическую экспертизу с креативным подходом.<br className="hidden sm:block" />
              От первой строки кода до масштабируемой системы — создаем цифровые продукты,<br className="hidden md:block" /> которые работают точно, быстро и красиво.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-7 neon-glow-purple font-bold transition-all duration-300 border-0"
                onClick={() => scrollToSection('generators')}
              >
                Начать проект
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-7 font-semibold transition-all duration-300 neon-glow"
                onClick={() => scrollToSection('about')}
              >
                Смотреть работы
              </Button>
            </div>

            <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              <Card className="bg-[#1a2332]/80 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/20 hover:shadow-2xl transition-all duration-700 group backdrop-blur-xl hover:scale-105 animate-smooth-fade">
                <CardHeader>
                  <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-all duration-500 neon-glow group-hover:glow-pulse-cyan animate-icon-pop">
                    <Icon name="Video" className="text-cyan-400 transition-transform duration-500 group-hover:scale-110" size={32} />
                  </div>
                  <CardTitle className="text-center font-bold text-cyan-100">Генерация видео</CardTitle>
                  <CardDescription className="text-center text-cyan-100/60">Создавайте профессиональные видео из текста</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-[#1a2332]/80 border border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/20 hover:shadow-2xl transition-all duration-700 group backdrop-blur-xl hover:scale-105 animate-smooth-fade" style={{animationDelay: '0.15s'}}>
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all duration-500 neon-glow-purple group-hover:glow-pulse-purple animate-icon-pop" style={{animationDelay: '0.15s'}}>
                    <Icon name="FileText" className="text-purple-400 transition-transform duration-500 group-hover:scale-110" size={32} />
                  </div>
                  <CardTitle className="text-center font-bold text-purple-100">Текстовый редактор</CardTitle>
                  <CardDescription className="text-center text-purple-100/60">Пишите статьи и доклады с AI-ассистентом</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-[#1a2332]/80 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/20 hover:shadow-2xl transition-all duration-700 group backdrop-blur-xl hover:scale-105 animate-smooth-fade" style={{animationDelay: '0.3s'}}>
                <CardHeader>
                  <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-all duration-500 neon-glow group-hover:glow-pulse-cyan animate-icon-pop" style={{animationDelay: '0.3s'}}>
                    <Icon name="Presentation" className="text-cyan-400 transition-transform duration-500 group-hover:scale-110" size={32} />
                  </div>
                  <CardTitle className="text-center font-bold text-cyan-100">Презентации</CardTitle>
                  <CardDescription className="text-center text-cyan-100/60">Создавайте впечатляющие слайды за минуты</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section id="generators" className="min-h-screen py-20 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-cyan-400 text-flicker">
                AI Генераторы
              </h2>
              <p className="text-lg sm:text-xl text-cyan-100/60 px-4">Выберите инструмент и начните создавать</p>
            </div>

            <Tabs defaultValue="video" className="max-w-5xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-[#1a2332]/60 border border-cyan-500/20 backdrop-blur-sm p-1 h-auto border-glow-animate">
                <TabsTrigger value="video" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 data-[state=active]:border data-[state=active]:border-cyan-500/40 data-[state=active]:glow-pulse-cyan text-cyan-100/50 py-3 text-sm md:text-base font-semibold transition-all duration-300">
                  <Icon name="Video" className="mr-1 md:mr-2" size={18} />
                  <span className="hidden sm:inline">Видео</span>
                  <span className="sm:hidden">Вид</span>
                </TabsTrigger>
                <TabsTrigger value="text" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border data-[state=active]:border-purple-500/40 data-[state=active]:glow-pulse-purple text-cyan-100/50 py-3 text-sm md:text-base font-semibold transition-all duration-300">
                  <Icon name="FileText" className="mr-1 md:mr-2" size={18} />
                  <span className="hidden sm:inline">Текст</span>
                  <span className="sm:hidden">Тек</span>
                </TabsTrigger>
                <TabsTrigger value="presentation" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 data-[state=active]:border data-[state=active]:border-cyan-500/40 data-[state=active]:glow-pulse-cyan text-cyan-100/50 py-3 text-sm md:text-base font-semibold transition-all duration-300">
                  <Icon name="Presentation" className="mr-1 md:mr-2" size={18} />
                  <span className="hidden sm:inline">Презентация</span>
                  <span className="sm:hidden">През</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="video" className="animate-fade-in">
                <Card className="bg-[#1a2332]/60 border border-cyan-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl text-cyan-100">Генератор видео</CardTitle>
                    <CardDescription className="text-sm md:text-base text-cyan-100/60">Опишите, какое видео вы хотите создать</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 sm:p-6">
                    <Textarea 
                      placeholder="Например: Создай видео о закате на океане с чайками и спокойной музыкой..."
                      className="min-h-32 resize-none bg-[#0f1729] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                    />
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button onClick={handleVideoGenerate} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-[#0f1729] border-0 font-bold glow-pulse-cyan transition-all duration-300 hover:scale-105">
                        <Icon name="Sparkles" className="mr-2" size={18} />
                        Сгенерировать видео
                      </Button>
                      <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50 sm:w-auto transition-all duration-300">
                        <Icon name="Settings" size={18} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-4">
                      <div className="text-center p-3 md:p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 hover:scale-105 animate-smooth-fade">
                        <Icon name="Film" className="mx-auto mb-2 text-cyan-400 animate-icon-pop" size={20} />
                        <p className="text-xs md:text-sm font-semibold text-cyan-100">Full HD</p>
                      </div>
                      <div className="text-center p-3 md:p-4 bg-purple-500/5 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:scale-105 animate-smooth-fade" style={{animationDelay: '0.1s'}}>
                        <Icon name="Music" className="mx-auto mb-2 text-purple-400 animate-icon-pop" style={{animationDelay: '0.1s'}} size={20} />
                        <p className="text-xs md:text-sm font-semibold text-purple-100">Со звуком</p>
                      </div>
                      <div className="text-center p-3 md:p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 hover:scale-105 animate-smooth-fade" style={{animationDelay: '0.2s'}}>
                        <Icon name="Zap" className="mx-auto mb-2 text-cyan-400 animate-icon-pop" style={{animationDelay: '0.2s'}} size={20} />
                        <p className="text-xs md:text-sm font-semibold text-cyan-100">За 30 сек</p>
                      </div>
                      <div className="text-center p-3 md:p-4 bg-purple-500/5 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:scale-105 animate-smooth-fade" style={{animationDelay: '0.3s'}}>
                        <Icon name="Sparkles" className="mx-auto mb-2 text-purple-400 animate-icon-pop" style={{animationDelay: '0.3s'}} size={20} />
                        <p className="text-xs md:text-sm font-semibold text-purple-100">AI эффекты</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="text" className="animate-fade-in">
                <Card className="bg-[#1a2332]/60 border border-purple-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl text-purple-100">Текстовый редактор AI</CardTitle>
                    <CardDescription className="text-sm md:text-base text-purple-100/60">Создайте статью, доклад или любой текст</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 sm:p-6">
                    <Input 
                      placeholder="Тема текста (например: История искусственного интеллекта)"
                      className="bg-[#0f1729] border-purple-500/30 text-purple-100 placeholder:text-purple-100/30"
                      value={textPrompt}
                      onChange={(e) => setTextPrompt(e.target.value)}
                    />
                    <Textarea 
                      placeholder="Дополнительные детали или требования к тексту..."
                      className="min-h-32 resize-none bg-[#0f1729] border-purple-500/30 text-purple-100 placeholder:text-purple-100/30"
                    />
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button onClick={handleTextGenerate} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white border-0 font-bold neon-glow-purple transition-all duration-300">
                        <Icon name="Sparkles" className="mr-2" size={18} />
                        Написать текст
                      </Button>
                      <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/50 sm:w-auto transition-all duration-300">
                        <Icon name="Download" size={18} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 pt-4">
                      <div className="text-center p-3 md:p-4 bg-purple-500/5 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                        <Icon name="FileText" className="mx-auto mb-2 text-purple-400" size={20} />
                        <p className="text-xs md:text-sm font-semibold text-purple-100">До 10 000 слов</p>
                      </div>
                      <div className="text-center p-3 md:p-4 bg-purple-500/5 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                        <Icon name="Languages" className="mx-auto mb-2 text-purple-400" size={20} />
                        <p className="text-xs md:text-sm font-semibold text-purple-100">50+ языков</p>
                      </div>
                      <div className="text-center p-3 md:p-4 bg-purple-500/5 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                        <Icon name="Sparkles" className="mx-auto mb-2 text-purple-400" size={20} />
                        <p className="text-xs md:text-sm font-semibold text-purple-100">AI улучшение</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="presentation" className="animate-fade-in">
                <Card className="bg-[#1a2332]/60 border border-cyan-500/20 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-xl md:text-2xl text-cyan-100">Конструктор презентаций</CardTitle>
                    <CardDescription className="text-sm md:text-base text-cyan-100/60">Создайте профессиональную презентацию за минуты</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 sm:p-6">
                    <Input 
                      placeholder="Тема презентации"
                      className="bg-[#0f1729] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
                      value={presentationTopic}
                      onChange={(e) => setPresentationTopic(e.target.value)}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium mb-2 block text-cyan-100">Количество слайдов</label>
                        <Input type="number" defaultValue="10" className="bg-[#0f1729] border-cyan-500/30 text-cyan-100" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium mb-2 block text-cyan-100">Стиль</label>
                        <select className="w-full h-10 px-3 rounded-md border bg-[#0f1729] border-cyan-500/30 text-cyan-100 text-sm">
                          <option>Минимализм</option>
                          <option>Бизнес</option>
                          <option>Креативный</option>
                          <option>Академический</option>
                        </select>
                      </div>
                    </div>
                    <Textarea 
                      placeholder="Основные пункты презентации..."
                      className="min-h-32 resize-none bg-[#0f1729] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
                    />
                    <Button onClick={handlePresentationGenerate} className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#0f1729] border-0 font-bold neon-glow transition-all duration-300">
                      <Icon name="Sparkles" className="mr-2" size={18} />
                      Создать презентацию
                    </Button>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 pt-4">
                      <div className="text-center p-3 md:p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 hover:scale-105 animate-smooth-fade">
                        <Icon name="Layout" className="mx-auto mb-2 text-cyan-400 animate-icon-pop" size={20} />
                        <p className="text-xs md:text-sm font-semibold text-cyan-100">50+ шаблонов</p>
                      </div>
                      <div className="text-center p-3 md:p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 hover:scale-105 animate-smooth-fade" style={{animationDelay: '0.1s'}}>
                        <Icon name="Palette" className="mx-auto mb-2 text-cyan-400 animate-icon-pop" style={{animationDelay: '0.1s'}} size={20} />
                        <p className="text-xs md:text-sm font-semibold text-cyan-100">Свой дизайн</p>
                      </div>
                      <div className="text-center p-3 md:p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 hover:scale-105 animate-smooth-fade" style={{animationDelay: '0.2s'}}>
                        <Icon name="Download" className="mx-auto mb-2 text-cyan-400 animate-icon-pop" style={{animationDelay: '0.2s'}} size={20} />
                        <p className="text-xs md:text-sm font-semibold text-cyan-100">PPT/PDF</p>
                      </div>
                      <div className="text-center p-3 md:p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 hover:scale-105 animate-smooth-fade" style={{animationDelay: '0.3s'}}>
                        <Icon name="Users" className="mx-auto mb-2 text-cyan-400 animate-icon-pop" style={{animationDelay: '0.3s'}} size={20} />
                        <p className="text-xs md:text-sm font-semibold text-cyan-100">Совместная работа</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section id="about" className="py-20 px-6" ref={aboutSection.ref}>
          <div className="container mx-auto">
            <div className={`max-w-4xl mx-auto text-center ${aboutSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 text-cyan-400 text-flicker">
                О сервисе
              </h2>
              <p className="text-xl text-cyan-100/70 mb-12 font-light">
                <span className="text-cyan-300 font-bold text-flicker">ROUSHEN</span> — это платформа нового поколения для создания контента с использованием искусственного интеллекта. 
                Мы объединили лучшие AI-модели для генерации видео, текстов и презентаций в одном удобном интерфейсе.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mt-16">
                <Card className={`bg-[#1a2332]/80 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/20 hover:shadow-2xl transition-all duration-700 group backdrop-blur-xl text-left hover:scale-105 ${aboutSection.isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
                  <CardHeader>
                    <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-all duration-500 neon-glow group-hover:glow-pulse-cyan animate-icon-pop">
                      <Icon name="Zap" className="text-cyan-400 transition-transform duration-500 group-hover:scale-110" size={32} />
                    </div>
                    <CardTitle className="font-bold text-cyan-100">Быстро и просто</CardTitle>
                    <CardDescription className="text-cyan-100/60">
                      Создавайте профессиональный контент за считанные минуты без специальных навыков
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className={`bg-[#1a2332]/80 border border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/20 hover:shadow-2xl transition-all duration-700 group backdrop-blur-xl text-left hover:scale-105 ${aboutSection.isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
                  <CardHeader>
                    <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all duration-500 neon-glow-purple group-hover:glow-pulse-purple animate-icon-pop" style={{animationDelay: '0.1s'}}>
                      <Icon name="Shield" className="text-purple-400 transition-transform duration-500 group-hover:scale-110" size={32} />
                    </div>
                    <CardTitle className="font-bold text-purple-100">Безопасность данных</CardTitle>
                    <CardDescription className="text-purple-100/60">
                      Ваши данные защищены современными методами шифрования и не передаются третьим лицам
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className={`bg-[#1a2332]/80 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/20 hover:shadow-2xl transition-all duration-700 group backdrop-blur-xl text-left hover:scale-105 ${aboutSection.isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
                  <CardHeader>
                    <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-all duration-500 neon-glow group-hover:glow-pulse-cyan animate-icon-pop" style={{animationDelay: '0.2s'}}>
                      <Icon name="Cpu" className="text-cyan-400 transition-transform duration-500 group-hover:scale-110" size={32} />
                    </div>
                    <CardTitle className="font-bold text-cyan-100">Передовые AI-модели</CardTitle>
                    <CardDescription className="text-cyan-100/60">
                      Используем последние достижения в области искусственного интеллекта и машинного обучения
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className={`bg-[#1a2332]/80 border border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/20 hover:shadow-2xl transition-all duration-700 group backdrop-blur-xl text-left hover:scale-105 ${aboutSection.isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
                  <CardHeader>
                    <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all duration-500 neon-glow-purple group-hover:glow-pulse-purple animate-icon-pop" style={{animationDelay: '0.3s'}}>
                      <Icon name="Headphones" className="text-purple-400 transition-transform duration-500 group-hover:scale-110" size={32} />
                    </div>
                    <CardTitle className="font-bold text-purple-100">Поддержка 24/7</CardTitle>
                    <CardDescription className="text-purple-100/60">
                      Наша команда всегда готова помочь вам с любыми вопросами и проблемами
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 px-6" ref={pricingSection.ref}>
          <div className="container mx-auto">
            <div className={`text-center mb-16 ${pricingSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-cyan-400 text-flicker">
                Тарифы
              </h2>
              <p className="text-lg sm:text-xl text-cyan-100/70 px-4 font-light">Выберите план, который подходит именно вам</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              <Card className={`bg-[#1a2332]/80 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/20 hover:shadow-2xl transition-all duration-700 backdrop-blur-xl hover:scale-105 ${pricingSection.isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-cyan-100">Старт</CardTitle>
                  <CardDescription className="text-cyan-100/60">Для личного использования</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-cyan-300">Бесплатно</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Icon name="Check" className="text-cyan-400 mr-2" size={20} />
                      <span className="text-cyan-100/80">5 видео в месяц</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-cyan-400 mr-2" size={20} />
                      <span className="text-cyan-100/80">10 текстов в месяц</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-cyan-400 mr-2" size={20} />
                      <span className="text-cyan-100/80">3 презентации</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-cyan-400 mr-2" size={20} />
                      <span className="text-cyan-100/80">HD качество</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-[#0f1729] border-0 font-bold neon-glow transition-all duration-300">
                    Начать бесплатно
                  </Button>
                </CardContent>
              </Card>

              <Card className={`bg-[#1a2332]/80 border-2 border-purple-500/40 hover:shadow-purple-500/30 hover:shadow-2xl transition-all duration-700 relative pulse-glow backdrop-blur-xl hover:scale-110 ${pricingSection.isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{animationDelay: '0.15s'}}>
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white font-bold px-6 py-1 glow-pulse-purple">
                  Популярный
                </Badge>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-purple-100">Про</CardTitle>
                  <CardDescription className="text-purple-100/60">Для профессионалов</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-purple-300">990₽</span>
                    <span className="text-purple-100/50">/месяц</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-400 mr-2" size={20} />
                      <span className="text-purple-100/80">50 видео в месяц</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-400 mr-2" size={20} />
                      <span className="text-purple-100/80">Безлимит текстов</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-400 mr-2" size={20} />
                      <span className="text-purple-100/80">30 презентаций</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-400 mr-2" size={20} />
                      <span className="text-purple-100/80">Full HD качество</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-purple-400 mr-2" size={20} />
                      <span className="text-purple-100/80">Приоритетная поддержка</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-500 text-white border-0 font-bold glow-pulse-purple transition-all duration-300 hover:scale-105">
                    Выбрать план
                  </Button>
                </CardContent>
              </Card>

              <Card className={`bg-[#1a2332]/80 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/20 hover:shadow-2xl transition-all duration-700 backdrop-blur-xl hover:scale-105 ${pricingSection.isVisible ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-cyan-100">Бизнес</CardTitle>
                  <CardDescription className="text-cyan-100/60">Для команд и компаний</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-cyan-300">2990₽</span>
                    <span className="text-cyan-100/50">/месяц</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Icon name="Check" className="text-cyan-400 mr-2" size={20} />
                      <span className="text-cyan-100/80">Безлимит видео</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-cyan-400 mr-2" size={20} />
                      <span className="text-cyan-100/80">Безлимит текстов</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-cyan-400 mr-2" size={20} />
                      <span className="text-cyan-100/80">Безлимит презентаций</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-cyan-400 mr-2" size={20} />
                      <span className="text-cyan-100/80">4K качество</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-cyan-400 mr-2" size={20} />
                      <span className="text-cyan-100/80">Персональный менеджер</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-[#0f1729] border-0 font-bold glow-pulse-cyan transition-all duration-300 hover:scale-105">
                    Связаться с нами
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="contacts" className="py-20 px-6" ref={contactSection.ref}>
          <div className="container mx-auto">
            <div className={`max-w-3xl mx-auto ${contactSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-cyan-400 text-flicker">
                  Контакты
                </h2>
                <p className="text-lg sm:text-xl text-cyan-100/70 px-4 font-light">Свяжитесь с нами любым удобным способом</p>
              </div>

              <Card className={`bg-[#1a2332]/80 border border-cyan-500/20 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-700 ${contactSection.isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-8">
                    <div className={`flex items-start space-x-4 ${contactSection.isVisible ? 'animate-slide-in-left' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
                      <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center flex-shrink-0 neon-glow hover:glow-pulse-cyan transition-all duration-500 animate-icon-pop" style={{animationDelay: '0.3s'}}>
                        <Icon name="Mail" className="text-cyan-400 transition-transform duration-500 hover:scale-110" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-cyan-100">Email</h3>
                        <a href="mailto:Rpmxxx@mail.ru" className="text-cyan-100/70 hover:text-cyan-400 transition-colors block font-medium">Rpmxxx@mail.ru</a>
                      </div>
                    </div>

                    <div className={`flex items-start space-x-4 ${contactSection.isVisible ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
                      <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center flex-shrink-0 neon-glow-purple animate-icon-pop" style={{animationDelay: '0.4s'}}>
                        <Icon name="Phone" className="text-purple-400 transition-transform duration-500 hover:scale-110" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-purple-100">Телефон</h3>
                        <a href="tel:+79282264638" className="text-purple-100/70 hover:text-purple-400 transition-colors block font-medium">+7 928 226-46-38</a>
                      </div>
                    </div>

                    <div className={`flex items-start space-x-4 ${contactSection.isVisible ? 'animate-slide-in-left' : 'opacity-0'}`} style={{animationDelay: '0.5s'}}>
                      <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center flex-shrink-0 neon-glow animate-icon-pop" style={{animationDelay: '0.5s'}}>
                        <Icon name="MapPin" className="text-cyan-400 transition-transform duration-500 hover:scale-110" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-cyan-100">Адрес</h3>
                        <p className="text-cyan-100/70">г. Ростов-на-Дону,</p>
                        <p className="text-cyan-100/70">пер. Технологический, 8И</p>
                      </div>
                    </div>

                    <div className={`flex items-start space-x-4 ${contactSection.isVisible ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
                      <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center flex-shrink-0 neon-glow-purple animate-icon-pop" style={{animationDelay: '0.6s'}}>
                        <Icon name="Clock" className="text-purple-400 transition-transform duration-500 hover:scale-110" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-purple-100">Режим работы</h3>
                        <p className="text-purple-100/70">Пн-Пт: 9:00 - 18:00</p>
                        <p className="text-purple-100/70">Поддержка: 24/7</p>
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

      <footer className="relative z-10 border-t border-cyan-500/10 bg-[#1a2332]/80 backdrop-blur-xl py-12 px-6 mt-20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-12 h-12 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-2xl flex items-center justify-center neon-glow">
                <Icon name="Sparkles" className="text-cyan-400" size={28} />
              </div>
              <span className="text-2xl font-black text-cyan-400 text-shadow-neon tracking-tight">
                ROUSHEN
              </span>
            </div>
            <div className="text-cyan-100/70 text-sm font-medium">
              © 2024 ROUSHEN. Все права защищены.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-cyan-100/70 hover:text-cyan-400 transition-all duration-300 hover:scale-110">
                <Icon name="Twitter" size={22} />
              </a>
              <a href="#" className="text-cyan-100/70 hover:text-purple-400 transition-all duration-300 hover:scale-110">
                <Icon name="Github" size={22} />
              </a>
              <a href="#" className="text-cyan-100/70 hover:text-cyan-400 transition-all duration-300 hover:scale-110">
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