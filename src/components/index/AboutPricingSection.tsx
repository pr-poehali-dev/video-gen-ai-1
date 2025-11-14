import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface AboutPricingSectionProps {
  aboutSection: {
    ref: (node?: Element | null) => void;
    isVisible: boolean;
  };
  pricingSection: {
    ref: (node?: Element | null) => void;
    isVisible: boolean;
  };
  handlePlanClick: (planName: string) => void;
}

const AboutPricingSection = ({ aboutSection, pricingSection, handlePlanClick }: AboutPricingSectionProps) => {
  return (
    <>
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
                  <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-all duration-500 neon-glow group-hover:glow-pulse-cyan">
                    <Icon name="Brain" className="text-cyan-400 transition-transform duration-500 group-hover:scale-110" size={32} />
                  </div>
                  <CardTitle className="text-cyan-100 mb-3 font-bold">Умные технологии</CardTitle>
                  <CardDescription className="text-cyan-100/60 text-base">
                    Используем передовые нейросети для создания контента профессионального уровня
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className={`bg-[#1a2332]/80 border border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/20 hover:shadow-2xl transition-all duration-700 group backdrop-blur-xl text-left hover:scale-105 ${aboutSection.isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all duration-500 neon-glow-purple group-hover:glow-pulse-purple">
                    <Icon name="Zap" className="text-purple-400 transition-transform duration-500 group-hover:scale-110" size={32} />
                  </div>
                  <CardTitle className="text-purple-100 mb-3 font-bold">Быстрый результат</CardTitle>
                  <CardDescription className="text-purple-100/60 text-base">
                    От идеи до готового контента за минуты, а не часы
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className={`bg-[#1a2332]/80 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/20 hover:shadow-2xl transition-all duration-700 group backdrop-blur-xl text-left hover:scale-105 ${aboutSection.isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
                <CardHeader>
                  <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-all duration-500 neon-glow group-hover:glow-pulse-cyan">
                    <Icon name="Lock" className="text-cyan-400 transition-transform duration-500 group-hover:scale-110" size={32} />
                  </div>
                  <CardTitle className="text-cyan-100 mb-3 font-bold">Безопасность</CardTitle>
                  <CardDescription className="text-cyan-100/60 text-base">
                    Ваши данные надежно защищены и никогда не используются для обучения моделей
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className={`bg-[#1a2332]/80 border border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/20 hover:shadow-2xl transition-all duration-700 group backdrop-blur-xl text-left hover:scale-105 ${aboutSection.isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all duration-500 neon-glow-purple group-hover:glow-pulse-purple">
                    <Icon name="HeartHandshake" className="text-purple-400 transition-transform duration-500 group-hover:scale-110" size={32} />
                  </div>
                  <CardTitle className="text-purple-100 mb-3 font-bold">Поддержка 24/7</CardTitle>
                  <CardDescription className="text-purple-100/60 text-base">
                    Наша команда всегда готова помочь вам в любое время
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
            <p className="text-lg sm:text-xl text-cyan-100/60 px-4">Выберите план, который подходит именно вам</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <Card className={`bg-[#1a2332]/80 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/20 hover:shadow-2xl transition-all duration-700 backdrop-blur-xl hover:scale-105 ${pricingSection.isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
              <CardHeader>
                <CardTitle className="text-2xl text-cyan-100 font-bold">Старт</CardTitle>
                <CardDescription className="text-cyan-100/60">Для начинающих</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-black text-cyan-400">₽999</span>
                  <span className="text-cyan-100/60 ml-2">/месяц</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-cyan-100/80">
                    <Icon name="Check" className="mr-2 text-cyan-400" size={18} />
                    10 видео в месяц
                  </li>
                  <li className="flex items-center text-cyan-100/80">
                    <Icon name="Check" className="mr-2 text-cyan-400" size={18} />
                    50 текстов
                  </li>
                  <li className="flex items-center text-cyan-100/80">
                    <Icon name="Check" className="mr-2 text-cyan-400" size={18} />
                    20 презентаций
                  </li>
                  <li className="flex items-center text-cyan-100/80">
                    <Icon name="Check" className="mr-2 text-cyan-400" size={18} />
                    HD качество
                  </li>
                </ul>
                <Button onClick={() => handlePlanClick('Старт')} className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#0f1729] font-bold neon-glow transition-all duration-300">
                  Выбрать план
                </Button>
              </CardContent>
            </Card>

            <Card className={`bg-[#1a2332]/80 border-2 border-purple-500/40 hover:border-purple-500/60 hover:shadow-purple-500/30 hover:shadow-2xl transition-all duration-700 backdrop-blur-xl hover:scale-110 ${pricingSection.isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 font-bold border-0 glow-pulse-purple">
                  Популярно
                </Badge>
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-2xl text-purple-100 font-bold">Про</CardTitle>
                <CardDescription className="text-purple-100/60">Для профессионалов</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-black text-purple-400">₽2499</span>
                  <span className="text-purple-100/60 ml-2">/месяц</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-purple-100/80">
                    <Icon name="Check" className="mr-2 text-purple-400" size={18} />
                    50 видео в месяц
                  </li>
                  <li className="flex items-center text-purple-100/80">
                    <Icon name="Check" className="mr-2 text-purple-400" size={18} />
                    Безлимит текстов
                  </li>
                  <li className="flex items-center text-purple-100/80">
                    <Icon name="Check" className="mr-2 text-purple-400" size={18} />
                    100 презентаций
                  </li>
                  <li className="flex items-center text-purple-100/80">
                    <Icon name="Check" className="mr-2 text-purple-400" size={18} />
                    4K качество
                  </li>
                  <li className="flex items-center text-purple-100/80">
                    <Icon name="Check" className="mr-2 text-purple-400" size={18} />
                    Приоритетная поддержка
                  </li>
                </ul>
                <Button onClick={() => handlePlanClick('Про')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold neon-glow-purple transition-all duration-300">
                  Выбрать план
                </Button>
              </CardContent>
            </Card>

            <Card className={`bg-[#1a2332]/80 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/20 hover:shadow-2xl transition-all duration-700 backdrop-blur-xl hover:scale-105 ${pricingSection.isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
              <CardHeader>
                <CardTitle className="text-2xl text-cyan-100 font-bold">Бизнес</CardTitle>
                <CardDescription className="text-cyan-100/60">Для команд</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-black text-cyan-400">₽4999</span>
                  <span className="text-cyan-100/60 ml-2">/месяц</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-cyan-100/80">
                    <Icon name="Check" className="mr-2 text-cyan-400" size={18} />
                    Безлимит видео
                  </li>
                  <li className="flex items-center text-cyan-100/80">
                    <Icon name="Check" className="mr-2 text-cyan-400" size={18} />
                    Безлимит текстов
                  </li>
                  <li className="flex items-center text-cyan-100/80">
                    <Icon name="Check" className="mr-2 text-cyan-400" size={18} />
                    Безлимит презентаций
                  </li>
                  <li className="flex items-center text-cyan-100/80">
                    <Icon name="Check" className="mr-2 text-cyan-400" size={18} />
                    4K+ качество
                  </li>
                  <li className="flex items-center text-cyan-100/80">
                    <Icon name="Check" className="mr-2 text-cyan-400" size={18} />
                    API доступ
                  </li>
                  <li className="flex items-center text-cyan-100/80">
                    <Icon name="Check" className="mr-2 text-cyan-400" size={18} />
                    Персональный менеджер
                  </li>
                </ul>
                <Button onClick={() => handlePlanClick('Бизнес')} className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#0f1729] font-bold neon-glow transition-all duration-300">
                  Выбрать план
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPricingSection;
