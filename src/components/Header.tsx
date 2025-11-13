import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  scrollToSection: (sectionId: string) => void;
}

const Header = ({ isMobileMenuOpen, setIsMobileMenuOpen, scrollToSection }: HeaderProps) => {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1729]/95 border-b border-cyan-500/10 backdrop-blur-xl border-glow-animate">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-lg flex items-center justify-center glow-pulse-cyan">
                <Icon name="Sparkles" className="text-cyan-400" size={28} />
              </div>
              <span className="text-2xl font-black text-cyan-400 text-flicker tracking-tight">
                ROUSHEN
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-sm font-medium text-cyan-100/70 hover:text-cyan-400 transition-all duration-300">
                Главная
              </button>
              <button onClick={() => scrollToSection('generators')} className="text-sm font-medium text-cyan-100/70 hover:text-cyan-400 transition-all duration-300">
                Генераторы
              </button>
              <button onClick={() => scrollToSection('about')} className="text-sm font-medium text-cyan-100/70 hover:text-cyan-400 transition-all duration-300">
                О сервисе
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium text-cyan-100/70 hover:text-cyan-400 transition-all duration-300">
                Тарифы
              </button>
              <button onClick={() => scrollToSection('contacts')} className="text-sm font-medium text-cyan-100/70 hover:text-cyan-400 transition-all duration-300">
                Контакты
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <Button className="hidden md:flex bg-purple-600 hover:bg-purple-500 text-white border-0 font-bold glow-pulse-purple transition-all duration-300 hover:scale-105">
                Начать проект
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          <div className="absolute top-20 left-0 right-0 bg-[#1a2332]/98 backdrop-blur-xl border-b border-cyan-500/20 shadow-2xl animate-fade-in">
            <div className="container mx-auto px-6 py-6">
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => scrollToSection('home')} 
                  className="text-left text-lg font-medium py-3 px-4 rounded-lg text-cyan-100/70 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all"
                >
                  Главная
                </button>
                <button 
                  onClick={() => scrollToSection('generators')} 
                  className="text-left text-lg font-medium py-3 px-4 rounded-lg text-cyan-100/70 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all"
                >
                  Генераторы
                </button>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="text-left text-lg font-medium py-3 px-4 rounded-lg text-cyan-100/70 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all"
                >
                  О сервисе
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')} 
                  className="text-left text-lg font-medium py-3 px-4 rounded-lg text-cyan-100/70 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all"
                >
                  Тарифы
                </button>
                <button 
                  onClick={() => scrollToSection('contacts')} 
                  className="text-left text-lg font-medium py-3 px-4 rounded-lg text-cyan-100/70 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all"
                >
                  Контакты
                </button>
                
                <div className="pt-4 border-t border-cyan-500/20">
                  <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white border-0 font-bold neon-glow-purple transition-all duration-300">
                    Начать проект
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;