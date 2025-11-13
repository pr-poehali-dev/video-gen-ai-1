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
    <div className="min-h-screen bg-[#0f1729] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-cyan-500/10 rounded-full filter blur-3xl opacity-50 floating"></div>
        <div className="absolute top-40 right-20 w-[700px] h-[700px] bg-purple-500/10 rounded-full filter blur-3xl opacity-40 floating-delayed"></div>
        <div className="absolute -bottom-20 left-1/3 w-[500px] h-[500px] bg-blue-500/10 rounded-full filter blur-3xl opacity-30 floating-slow"></div>
        
        <div className="absolute inset-0" style={{
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
            <Badge className="mb-6 bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 px-6 py-2 text-sm font-semibold neon-glow-purple">
              ✨ Новое поколение AI инструментов
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent text-shadow-neon neon-flicker">ROUSHEN</span>
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
              <Card className="bg-[#1a2332]/80 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/20 hover:shadow-2xl transition-all duration-300 group backdrop-blur-xl">
                <CardHeader>
                  <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-all duration-300 neon-glow">
                    <Icon name="Video" className="text-cyan-400" size={32} />
                  </div>
                  <CardTitle className="text-center font-bold text-cyan-100">Генерация видео</CardTitle>
                  <CardDescription className="text-center text-cyan-100/60">Создавайте профессиональные видео из текста</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-[#1a2332]/80 border border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/20 hover:shadow-2xl transition-all duration-300 group backdrop-blur-xl">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all duration-300 neon-glow-purple">
                    <Icon name="FileText" className="text-purple-400" size={32} />
                  </div>
                  <CardTitle className="text-center font-bold text-purple-100">Текстовый редактор</CardTitle>
                  <CardDescription className="text-center text-purple-100/60">Пишите статьи и доклады с AI-ассистентом</CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-[#1a2332]/80 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/20 hover:shadow-2xl transition-all duration-300 group backdrop-blur-xl">
                <CardHeader>
                  <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-all duration-300 neon-glow">
                    <Icon name="Presentation" className="text-cyan-400" size={32} />
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
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-cyan-400 text-shadow-neon">
                AI Генераторы
              </h2>
              <p className="text-lg sm:text-xl text-cyan-100/60 px-4">Выберите инструмент и начните создавать</p>
            </div>

            <Tabs defaultValue="video" className="max-w-5xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-[#1a2332]/60 border border-cyan-500/20 backdrop-blur-sm p-1 h-auto">
                <TabsTrigger value="video" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 data-[state=active]:border data-[state=active]:border-cyan-500/40 text-cyan-100/50 py-3 text-sm md:text-base font-semibold transition-all duration-300">
                  <Icon name="Video" className="mr-1 md:mr-2" size={18} />
                  <span className="hidden sm:inline">Видео</span>
                  <span className="sm:hidden">Вид</span>
                </TabsTrigger>
                <TabsTrigger value="text" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border data-[state=active]:border-purple-500/40 text-cyan-100/50 py-3 text-sm md:text-base font-semibold transition-all duration-300">
                  <Icon name="FileText" className="mr-1 md:mr-2" size={18} />
                  <span className="hidden sm:inline">Текст</span>
                  <span className="sm:hidden">Тек</span>
                </TabsTrigger>
                <TabsTrigger value="presentation" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 data-[state=active]:border data-[state=active]:border-cyan-500/40 text-cyan-100/50 py-3 text-sm md:text-base font-semibold transition-all duration-300">
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
                      <Button onClick={handleVideoGenerate} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-[#0f1729] border-0 font-bold neon-glow transition-all duration-300">
                        <Icon name="Sparkles" className="mr-2" size={18} />
                        Сгенерировать видео
                      </Button>
                      <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50 sm:w-auto transition-all duration-300">
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