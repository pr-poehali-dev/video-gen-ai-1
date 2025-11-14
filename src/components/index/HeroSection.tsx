import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  typingText: {
    displayedText: string;
    isComplete: boolean;
  };
  scrollToSection: (sectionId: string) => void;
}

const HeroSection = ({ typingText, scrollToSection }: HeroSectionProps) => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6">
      <div className="container mx-auto text-center animate-fade-in">
        <Badge className="mb-6 bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 px-6 py-2 text-sm font-semibold glow-pulse-purple">
          ✨ Новое поколение AI инструментов
        </Badge>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-8 leading-tight">
          <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent text-flicker neon-flicker">ROUSHEN</span>
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2 bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent text-shadow-purple">
            {typingText.displayedText}
            {!typingText.isComplete && <span className="border-r-2 border-purple-400 animate-pulse ml-1"></span>}
          </span>
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
  );
};

export default HeroSection;
