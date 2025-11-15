import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface GeneratorsSectionProps {
  videoPrompt: string;
  setVideoPrompt: (value: string) => void;
  videoDuration: number;
  setVideoDuration: (value: number) => void;
  videoStyle: string;
  setVideoStyle: (value: string) => void;
  textPrompt: string;
  setTextPrompt: (value: string) => void;
  presentationTopic: string;
  setPresentationTopic: (value: string) => void;
  presentationSlides: number;
  setPresentationSlides: (value: number) => void;
  presentationStyle: string;
  setPresentationStyle: (value: string) => void;
  photoPrompt: string;
  setPhotoPrompt: (value: string) => void;
  photoStyle: string;
  setPhotoStyle: (value: string) => void;
  photoResolution: string;
  setPhotoResolution: (value: string) => void;
  handleVideoGenerate: () => void;
  handleTextGenerate: () => void;
  handlePresentationGenerate: () => void;
  handlePhotoGenerate: () => void;
}

const GeneratorsSection = ({
  videoPrompt,
  setVideoPrompt,
  videoDuration,
  setVideoDuration,
  videoStyle,
  setVideoStyle,
  textPrompt,
  setTextPrompt,
  presentationTopic,
  setPresentationTopic,
  presentationSlides,
  setPresentationSlides,
  presentationStyle,
  setPresentationStyle,
  photoPrompt,
  setPhotoPrompt,
  photoStyle,
  setPhotoStyle,
  photoResolution,
  setPhotoResolution,
  handleVideoGenerate,
  handleTextGenerate,
  handlePresentationGenerate,
  handlePhotoGenerate,
}: GeneratorsSectionProps) => {
  return (
    <section id="generators" className="min-h-screen py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-cyan-400 text-flicker">
            AI Генераторы
          </h2>
          <p className="text-lg sm:text-xl text-cyan-100/60 px-4">Выберите инструмент и начните создавать</p>
        </div>

        <Tabs defaultValue="video" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-[#1a2332]/60 backdrop-blur-xl border border-cyan-500/20 p-1">
            <TabsTrigger value="video" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 text-cyan-100/60 font-semibold transition-all duration-300">
              <Icon name="Video" className="mr-2" size={18} />
              Видео
            </TabsTrigger>
            <TabsTrigger value="text" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 text-purple-100/60 font-semibold transition-all duration-300">
              <Icon name="FileText" className="mr-2" size={18} />
              Текст
            </TabsTrigger>
            <TabsTrigger value="presentation" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 text-cyan-100/60 font-semibold transition-all duration-300">
              <Icon name="Presentation" className="mr-2" size={18} />
              Презентация
            </TabsTrigger>
            <TabsTrigger value="photo" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300 text-green-100/60 font-semibold transition-all duration-300">
              <Icon name="Image" className="mr-2" size={18} />
              Фото
            </TabsTrigger>
          </TabsList>

          <TabsContent value="video" className="animate-fade-in">
            <Card className="bg-[#1a2332]/60 border border-cyan-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl text-cyan-100">Генератор видео AI</CardTitle>
                <CardDescription className="text-sm md:text-base text-cyan-100/60">Опишите, какое видео вы хотите создать</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                <Textarea 
                  placeholder="Например: космонавт едет на лошади по Марсу"
                  className="min-h-32 resize-none bg-[#0f1729] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                />
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-2 block text-cyan-100">Длительность видео</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setVideoDuration(3)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        videoDuration === 3
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-100'
                          : 'border-cyan-500/30 hover:border-cyan-500/50 text-cyan-100/70'
                      }`}
                    >
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-xs">секунды</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoDuration(5)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        videoDuration === 5
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-100'
                          : 'border-cyan-500/30 hover:border-cyan-500/50 text-cyan-100/70'
                      }`}
                    >
                      <div className="text-2xl font-bold">5</div>
                      <div className="text-xs">секунд</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoDuration(10)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        videoDuration === 10
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-100'
                          : 'border-cyan-500/30 hover:border-cyan-500/50 text-cyan-100/70'
                      }`}
                    >
                      <div className="text-2xl font-bold">10</div>
                      <div className="text-xs">секунд</div>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-2 block text-cyan-100">Стиль видео</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      type="button"
                      onClick={() => setVideoStyle('cinematic')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        videoStyle === 'cinematic'
                          ? 'border-cyan-400 bg-cyan-500/20'
                          : 'border-cyan-500/30 hover:border-cyan-500/50'
                      }`}
                    >
                      <Icon name="Film" className="mx-auto mb-1 text-cyan-300" size={18} />
                      <div className="text-xs font-semibold text-cyan-100">Кино</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoStyle('realistic')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        videoStyle === 'realistic'
                          ? 'border-cyan-400 bg-cyan-500/20'
                          : 'border-cyan-500/30 hover:border-cyan-500/50'
                      }`}
                    >
                      <Icon name="Camera" className="mx-auto mb-1 text-cyan-300" size={18} />
                      <div className="text-xs font-semibold text-cyan-100">Реализм</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoStyle('animated')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        videoStyle === 'animated'
                          ? 'border-cyan-400 bg-cyan-500/20'
                          : 'border-cyan-500/30 hover:border-cyan-500/50'
                      }`}
                    >
                      <Icon name="Wand2" className="mx-auto mb-1 text-cyan-300" size={18} />
                      <div className="text-xs font-semibold text-cyan-100">Анимация</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoStyle('artistic')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        videoStyle === 'artistic'
                          ? 'border-cyan-400 bg-cyan-500/20'
                          : 'border-cyan-500/30 hover:border-cyan-500/50'
                      }`}
                    >
                      <Icon name="Paintbrush" className="mx-auto mb-1 text-cyan-300" size={18} />
                      <div className="text-xs font-semibold text-cyan-100">Арт</div>
                    </button>
                  </div>
                </div>
                
                <Button onClick={handleVideoGenerate} className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#0f1729] border-0 font-bold neon-glow transition-all duration-300">
                  <Icon name="Sparkles" className="mr-2" size={18} />
                  Создать видео
                </Button>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 pt-4">
                  <div className="text-center p-3 md:p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
                    <Icon name="Zap" className="mx-auto mb-2 text-cyan-400" size={20} />
                    <p className="text-xs md:text-sm font-semibold text-cyan-100">Быстро</p>
                  </div>
                  <div className="text-center p-3 md:p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
                    <Icon name="Star" className="mx-auto mb-2 text-cyan-400" size={20} />
                    <p className="text-xs md:text-sm font-semibold text-cyan-100">Качественно</p>
                  </div>
                  <div className="text-center p-3 md:p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
                    <Icon name="Sparkles" className="mx-auto mb-2 text-cyan-400" size={20} />
                    <p className="text-xs md:text-sm font-semibold text-cyan-100">Уникально</p>
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
                    <Input 
                      type="number" 
                      min="1" 
                      max="10" 
                      value={presentationSlides} 
                      onChange={(e) => setPresentationSlides(Number(e.target.value))}
                      className="bg-[#0f1729] border-cyan-500/30 text-cyan-100" 
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium mb-2 block text-cyan-100">Стиль</label>
                    <select 
                      value={presentationStyle}
                      onChange={(e) => setPresentationStyle(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border bg-[#0f1729] border-cyan-500/30 text-cyan-100 text-sm"
                    >
                      <option value="minimalist">Минимализм</option>
                      <option value="business">Бизнес</option>
                      <option value="creative">Креативный</option>
                      <option value="academic">Академический</option>
                      <option value="modern">Современный</option>
                      <option value="elegant">Элегантный</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#0f1729]/50 rounded-lg border border-cyan-500/20">
                  <div 
                    onClick={() => setPresentationStyle('minimalist')}
                    className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${presentationStyle === 'minimalist' ? 'border-cyan-400 bg-cyan-500/10' : 'border-cyan-500/20 hover:border-cyan-500/40'}`}
                  >
                    <Icon name="Square" className="mb-2 text-cyan-300" size={20} />
                    <p className="text-xs font-semibold text-cyan-100">Минимализм</p>
                    <p className="text-[10px] text-cyan-100/60 mt-1">Чистый дизайн</p>
                  </div>
                  <div 
                    onClick={() => setPresentationStyle('business')}
                    className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${presentationStyle === 'business' ? 'border-cyan-400 bg-cyan-500/10' : 'border-cyan-500/20 hover:border-cyan-500/40'}`}
                  >
                    <Icon name="Briefcase" className="mb-2 text-cyan-300" size={20} />
                    <p className="text-xs font-semibold text-cyan-100">Бизнес</p>
                    <p className="text-[10px] text-cyan-100/60 mt-1">Корпоративный</p>
                  </div>
                  <div 
                    onClick={() => setPresentationStyle('creative')}
                    className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${presentationStyle === 'creative' ? 'border-cyan-400 bg-cyan-500/10' : 'border-cyan-500/20 hover:border-cyan-500/40'}`}
                  >
                    <Icon name="Palette" className="mb-2 text-cyan-300" size={20} />
                    <p className="text-xs font-semibold text-cyan-100">Креативный</p>
                    <p className="text-[10px] text-cyan-100/60 mt-1">Яркий, смелый</p>
                  </div>
                  <div 
                    onClick={() => setPresentationStyle('academic')}
                    className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${presentationStyle === 'academic' ? 'border-cyan-400 bg-cyan-500/10' : 'border-cyan-500/20 hover:border-cyan-500/40'}`}
                  >
                    <Icon name="GraduationCap" className="mb-2 text-cyan-300" size={20} />
                    <p className="text-xs font-semibold text-cyan-100">Академический</p>
                    <p className="text-[10px] text-cyan-100/60 mt-1">Научный стиль</p>
                  </div>
                  <div 
                    onClick={() => setPresentationStyle('modern')}
                    className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${presentationStyle === 'modern' ? 'border-cyan-400 bg-cyan-500/10' : 'border-cyan-500/20 hover:border-cyan-500/40'}`}
                  >
                    <Icon name="Zap" className="mb-2 text-cyan-300" size={20} />
                    <p className="text-xs font-semibold text-cyan-100">Современный</p>
                    <p className="text-[10px] text-cyan-100/60 mt-1">Трендовый</p>
                  </div>
                  <div 
                    onClick={() => setPresentationStyle('elegant')}
                    className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${presentationStyle === 'elegant' ? 'border-cyan-400 bg-cyan-500/10' : 'border-cyan-500/20 hover:border-cyan-500/40'}`}
                  >
                    <Icon name="Sparkles" className="mb-2 text-cyan-300" size={20} />
                    <p className="text-xs font-semibold text-cyan-100">Элегантный</p>
                    <p className="text-[10px] text-cyan-100/60 mt-1">Премиум</p>
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

          <TabsContent value="photo" className="animate-fade-in">
            <Card className="bg-[#1a2332]/60 border border-green-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl text-green-100">Генератор фото AI</CardTitle>
                <CardDescription className="text-sm md:text-base text-green-100/60">Создайте уникальное изображение из текста</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                <Textarea 
                  placeholder="Например: Красивый закат над океаном, фотореалистичный стиль, 4K качество"
                  className="min-h-32 resize-none bg-[#0f1729] border-green-500/30 text-green-100 placeholder:text-green-100/30"
                  value={photoPrompt}
                  onChange={(e) => setPhotoPrompt(e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium mb-2 block text-green-100">Стиль</label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border bg-[#0f1729] border-green-500/30 text-green-100 text-sm"
                      value={photoStyle}
                      onChange={(e) => setPhotoStyle(e.target.value)}
                    >
                      <option value="photorealistic">Фотореалистичный</option>
                      <option value="artistic">Художественный</option>
                      <option value="cartoon">Мультяшный</option>
                      <option value="abstract">Абстрактный</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium mb-2 block text-green-100">Разрешение</label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border bg-[#0f1729] border-green-500/30 text-green-100 text-sm"
                      value={photoResolution}
                      onChange={(e) => setPhotoResolution(e.target.value)}
                    >
                      <option value="1024x1024">1024x1024</option>
                      <option value="1920x1080">1920x1080 (Full HD)</option>
                      <option value="2560x1440">2560x1440 (2K)</option>
                    </select>
                  </div>
                </div>
                <Button onClick={handlePhotoGenerate} className="w-full bg-green-500 hover:bg-green-400 text-[#0f1729] border-0 font-bold neon-glow transition-all duration-300">
                  <Icon name="Sparkles" className="mr-2" size={18} />
                  Создать фото
                </Button>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 pt-4">
                  <div className="text-center p-3 md:p-4 bg-green-500/5 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                    <Icon name="Palette" className="mx-auto mb-2 text-green-400" size={20} />
                    <p className="text-xs md:text-sm font-semibold text-green-100">Любой стиль</p>
                  </div>
                  <div className="text-center p-3 md:p-4 bg-green-500/5 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                    <Icon name="Zap" className="mx-auto mb-2 text-green-400" size={20} />
                    <p className="text-xs md:text-sm font-semibold text-green-100">Моментально</p>
                  </div>
                  <div className="text-center p-3 md:p-4 bg-green-500/5 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                    <Icon name="Sparkles" className="mx-auto mb-2 text-green-400" size={20} />
                    <p className="text-xs md:text-sm font-semibold text-green-100">HD качество</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default GeneratorsSection;