import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [videoPrompt, setVideoPrompt] = useState('');
  const [textPrompt, setTextPrompt] = useState('');
  const [presentationTopic, setPresentationTopic] = useState('');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 floating"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 floating-delayed"></div>
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 floating-slow"></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 gradient-blur border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <Icon name="Sparkles" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                AI Studio
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-sm font-medium hover:text-blue-600 transition-colors">
                Главная
              </button>
              <button onClick={() => scrollToSection('generators')} className="text-sm font-medium hover:text-blue-600 transition-colors">
                Генераторы
              </button>
              <button onClick={() => scrollToSection('about')} className="text-sm font-medium hover:text-blue-600 transition-colors">
                О сервисе
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium hover:text-blue-600 transition-colors">
                Тарифы
              </button>
              <button onClick={() => scrollToSection('contacts')} className="text-sm font-medium hover:text-blue-600 transition-colors">
                Контакты
              </button>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white">
              Начать бесплатно
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-24">
        <section id="home" className="min-h-screen flex items-center justify-center px-6">
          <div className="container mx-auto text-center animate-fade-in">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 text-sm">
              🚀 Новое поколение AI инструментов
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent leading-tight">
              Создавайте контент<br />с помощью AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Генерируйте видео, пишите тексты и создавайте презентации за секунды.<br />
              Искусственный интеллект нового поколения для ваших задач.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white text-lg px-8 py-6"
                onClick={() => scrollToSection('generators')}
              >
                <Icon name="Sparkles" className="mr-2" size={20} />
                Попробовать сейчас
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 text-lg px-8 py-6"
                onClick={() => scrollToSection('about')}
              >
                <Icon name="Play" className="mr-2" size={20} />
                Смотреть демо
              </Button>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="gradient-blur border-white/40 hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Icon name="Video" className="text-white" size={24} />
                  </div>
                  <CardTitle className="text-center">Генерация видео</CardTitle>
                  <CardDescription className="text-center">Создавайте профессиональные видео из текста</CardDescription>
                </CardHeader>
              </Card>

              <Card className="gradient-blur border-white/40 hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Icon name="FileText" className="text-white" size={24} />
                  </div>
                  <CardTitle className="text-center">Текстовый редактор</CardTitle>
                  <CardDescription className="text-center">Пишите статьи и доклады с AI-ассистентом</CardDescription>
                </CardHeader>
              </Card>

              <Card className="gradient-blur border-white/40 hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Icon name="Presentation" className="text-white" size={24} />
                  </div>
                  <CardTitle className="text-center">Презентации</CardTitle>
                  <CardDescription className="text-center">Создавайте впечатляющие слайды за минуты</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section id="generators" className="min-h-screen py-20 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                AI Генераторы
              </h2>
              <p className="text-xl text-gray-600">Выберите инструмент и начните создавать</p>
            </div>

            <Tabs defaultValue="video" className="max-w-5xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/60 backdrop-blur-sm p-1">
                <TabsTrigger value="video" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-400 data-[state=active]:text-white">
                  <Icon name="Video" className="mr-2" size={18} />
                  Видео
                </TabsTrigger>
                <TabsTrigger value="text" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-400 data-[state=active]:text-white">
                  <Icon name="FileText" className="mr-2" size={18} />
                  Текст
                </TabsTrigger>
                <TabsTrigger value="presentation" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-400 data-[state=active]:text-white">
                  <Icon name="Presentation" className="mr-2" size={18} />
                  Презентация
                </TabsTrigger>
              </TabsList>

              <TabsContent value="video" className="animate-fade-in">
                <Card className="gradient-blur border-white/40">
                  <CardHeader>
                    <CardTitle className="text-2xl">Генератор видео</CardTitle>
                    <CardDescription>Опишите, какое видео вы хотите создать</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea 
                      placeholder="Например: Создай видео о закате на океане с чайками и спокойной музыкой..."
                      className="min-h-32 resize-none bg-white/80"
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                    />
                    <div className="flex gap-4">
                      <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white">
                        <Icon name="Sparkles" className="mr-2" size={18} />
                        Сгенерировать видео
                      </Button>
                      <Button variant="outline" className="border-blue-300">
                        <Icon name="Settings" size={18} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                      <div className="text-center p-4 bg-white/60 rounded-lg">
                        <Icon name="Clock" className="mx-auto mb-2 text-blue-600" size={24} />
                        <p className="text-sm font-medium">До 2 минут</p>
                      </div>
                      <div className="text-center p-4 bg-white/60 rounded-lg">
                        <Icon name="Film" className="mx-auto mb-2 text-blue-600" size={24} />
                        <p className="text-sm font-medium">Full HD</p>
                      </div>
                      <div className="text-center p-4 bg-white/60 rounded-lg">
                        <Icon name="Music" className="mx-auto mb-2 text-blue-600" size={24} />
                        <p className="text-sm font-medium">Со звуком</p>
                      </div>
                      <div className="text-center p-4 bg-white/60 rounded-lg">
                        <Icon name="Zap" className="mx-auto mb-2 text-blue-600" size={24} />
                        <p className="text-sm font-medium">За 30 сек</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="text" className="animate-fade-in">
                <Card className="gradient-blur border-white/40">
                  <CardHeader>
                    <CardTitle className="text-2xl">Текстовый редактор AI</CardTitle>
                    <CardDescription>Создайте статью, доклад или любой текст</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                    <div className="flex gap-4">
                      <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white">
                        <Icon name="Sparkles" className="mr-2" size={18} />
                        Написать текст
                      </Button>
                      <Button variant="outline" className="border-blue-300">
                        <Icon name="Download" size={18} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                      <div className="text-center p-4 bg-white/60 rounded-lg">
                        <Icon name="FileText" className="mx-auto mb-2 text-blue-600" size={24} />
                        <p className="text-sm font-medium">До 10 000 слов</p>
                      </div>
                      <div className="text-center p-4 bg-white/60 rounded-lg">
                        <Icon name="Languages" className="mx-auto mb-2 text-blue-600" size={24} />
                        <p className="text-sm font-medium">50+ языков</p>
                      </div>
                      <div className="text-center p-4 bg-white/60 rounded-lg">
                        <Icon name="CheckCircle" className="mx-auto mb-2 text-blue-600" size={24} />
                        <p className="text-sm font-medium">SEO оптимизация</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="presentation" className="animate-fade-in">
                <Card className="gradient-blur border-white/40">
                  <CardHeader>
                    <CardTitle className="text-2xl">Конструктор презентаций</CardTitle>
                    <CardDescription>Создайте профессиональную презентацию за минуты</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input 
                      placeholder="Тема презентации"
                      className="bg-white/80"
                      value={presentationTopic}
                      onChange={(e) => setPresentationTopic(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Количество слайдов</label>
                        <Input type="number" defaultValue="10" className="bg-white/80" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Стиль</label>
                        <select className="w-full h-10 px-3 rounded-md border bg-white/80">
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
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white">
                      <Icon name="Sparkles" className="mr-2" size={18} />
                      Создать презентацию
                    </Button>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                      <div className="text-center p-4 bg-white/60 rounded-lg">
                        <Icon name="Layout" className="mx-auto mb-2 text-blue-600" size={24} />
                        <p className="text-sm font-medium">50+ шаблонов</p>
                      </div>
                      <div className="text-center p-4 bg-white/60 rounded-lg">
                        <Icon name="Palette" className="mx-auto mb-2 text-blue-600" size={24} />
                        <p className="text-sm font-medium">Свой дизайн</p>
                      </div>
                      <div className="text-center p-4 bg-white/60 rounded-lg">
                        <Icon name="Download" className="mx-auto mb-2 text-blue-600" size={24} />
                        <p className="text-sm font-medium">PPT/PDF</p>
                      </div>
                      <div className="text-center p-4 bg-white/60 rounded-lg">
                        <Icon name="Users" className="mx-auto mb-2 text-blue-600" size={24} />
                        <p className="text-sm font-medium">Совместная работа</p>
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
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                О сервисе
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                AI Studio — это платформа нового поколения для создания контента с использованием искусственного интеллекта. 
                Мы объединили лучшие AI-модели для генерации видео, текстов и презентаций в одном удобном интерфейсе.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                <Card className="gradient-blur border-white/40 text-left">
                  <CardHeader>
                    <Icon name="Zap" className="text-blue-600 mb-4" size={32} />
                    <CardTitle>Быстро и просто</CardTitle>
                    <CardDescription>
                      Создавайте профессиональный контент за считанные минуты без специальных навыков
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="gradient-blur border-white/40 text-left">
                  <CardHeader>
                    <Icon name="Shield" className="text-blue-600 mb-4" size={32} />
                    <CardTitle>Безопасность данных</CardTitle>
                    <CardDescription>
                      Ваши данные защищены современными методами шифрования и не передаются третьим лицам
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="gradient-blur border-white/40 text-left">
                  <CardHeader>
                    <Icon name="Cpu" className="text-blue-600 mb-4" size={32} />
                    <CardTitle>Передовые AI-модели</CardTitle>
                    <CardDescription>
                      Используем последние достижения в области искусственного интеллекта и машинного обучения
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="gradient-blur border-white/40 text-left">
                  <CardHeader>
                    <Icon name="Headphones" className="text-blue-600 mb-4" size={32} />
                    <CardTitle>Поддержка 24/7</CardTitle>
                    <CardDescription>
                      Наша команда всегда готова помочь вам разобраться с любыми вопросами
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
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Тарифы
              </h2>
              <p className="text-xl text-gray-600">Выберите план, который подходит именно вам</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="gradient-blur border-white/40 hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl">Старт</CardTitle>
                  <CardDescription>Для личного использования</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">Бесплатно</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Icon name="Check" className="text-blue-600 mr-2" size={20} />
                      <span>5 видео в месяц</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-blue-600 mr-2" size={20} />
                      <span>10 текстов в месяц</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-blue-600 mr-2" size={20} />
                      <span>3 презентации</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-blue-600 mr-2" size={20} />
                      <span>HD качество</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white">
                    Начать бесплатно
                  </Button>
                </CardContent>
              </Card>

              <Card className="gradient-blur border-blue-300 border-2 hover:scale-105 transition-transform duration-300 relative">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                  Популярный
                </Badge>
                <CardHeader>
                  <CardTitle className="text-2xl">Про</CardTitle>
                  <CardDescription>Для профессионалов</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">990₽</span>
                    <span className="text-gray-600">/месяц</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Icon name="Check" className="text-blue-600 mr-2" size={20} />
                      <span>50 видео в месяц</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-blue-600 mr-2" size={20} />
                      <span>Безлимит текстов</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-blue-600 mr-2" size={20} />
                      <span>30 презентаций</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-blue-600 mr-2" size={20} />
                      <span>Full HD качество</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-blue-600 mr-2" size={20} />
                      <span>Приоритетная поддержка</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white">
                    Выбрать план
                  </Button>
                </CardContent>
              </Card>

              <Card className="gradient-blur border-white/40 hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl">Бизнес</CardTitle>
                  <CardDescription>Для команд и компаний</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">4990₽</span>
                    <span className="text-gray-600">/месяц</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Icon name="Check" className="text-blue-600 mr-2" size={20} />
                      <span>Безлимит видео</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-blue-600 mr-2" size={20} />
                      <span>Безлимит текстов</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-blue-600 mr-2" size={20} />
                      <span>Безлимит презентаций</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-blue-600 mr-2" size={20} />
                      <span>4K качество</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-blue-600 mr-2" size={20} />
                      <span>API доступ</span>
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" className="text-blue-600 mr-2" size={20} />
                      <span>Персональный менеджер</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white">
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
                <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Контакты
                </h2>
                <p className="text-xl text-gray-600">Свяжитесь с нами любым удобным способом</p>
              </div>

              <Card className="gradient-blur border-white/40">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon name="Mail" className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-gray-600">support@aistudio.com</p>
                        <p className="text-gray-600">info@aistudio.com</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon name="Phone" className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Телефон</h3>
                        <p className="text-gray-600">+7 (495) 123-45-67</p>
                        <p className="text-gray-600">+7 (800) 555-35-35</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon name="MapPin" className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Адрес</h3>
                        <p className="text-gray-600">Москва, ул. Примерная, д. 123</p>
                        <p className="text-gray-600">Бизнес-центр "Технопарк"</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon name="Clock" className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Режим работы</h3>
                        <p className="text-gray-600">Пн-Пт: 9:00 - 18:00</p>
                        <p className="text-gray-600">Поддержка: 24/7</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="font-semibold mb-4 text-center">Напишите нам</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Ваше имя" className="bg-white/80" />
                        <Input placeholder="Email" type="email" className="bg-white/80" />
                      </div>
                      <Textarea placeholder="Ваше сообщение" className="min-h-32 bg-white/80" />
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white">
                        <Icon name="Send" className="mr-2" size={18} />
                        Отправить сообщение
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/20 gradient-blur py-12 px-6 mt-20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <Icon name="Sparkles" className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                AI Studio
              </span>
            </div>
            <div className="text-gray-600 text-sm">
              © 2024 AI Studio. Все права защищены.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Icon name="Twitter" size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Icon name="Github" size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Icon name="Linkedin" size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;