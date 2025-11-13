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
      <nav className="fixed top-0 left-0 right-0 z-50 gradient-blur border-b border-purple-200/30 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg pulse-glow">
                <Icon name="Sparkles" className="text-white" size={28} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-violet-600 bg-clip-text text-transparent gradient-animate">
                ROUSHEN
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-sm font-semibold text-gray-700 hover:text-purple-600 transition-all duration-300 hover:scale-105">
                Главная
              </button>
              <button onClick={() => scrollToSection('generators')} className="text-sm font-semibold text-gray-700 hover:text-pink-600 transition-all duration-300 hover:scale-105">
                Генераторы
              </button>
              <button onClick={() => scrollToSection('about')} className="text-sm font-semibold text-gray-700 hover:text-violet-600 transition-all duration-300 hover:scale-105">
                О сервисе
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-sm font-semibold text-gray-700 hover:text-fuchsia-600 transition-all duration-300 hover:scale-105">
                Тарифы
              </button>
              <button onClick={() => scrollToSection('contacts')} className="text-sm font-semibold text-gray-700 hover:text-purple-600 transition-all duration-300 hover:scale-105">
                Контакты
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <Button className="hidden md:flex bg-gradient-to-r from-purple-600 via-pink-500 to-violet-600 hover:from-purple-700 hover:via-pink-600 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                Начать бесплатно
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
          
          <div className="absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-xl animate-fade-in">
            <div className="container mx-auto px-6 py-6">
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => scrollToSection('home')} 
                  className="text-left text-lg font-semibold py-3 px-4 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all"
                >
                  Главная
                </button>
                <button 
                  onClick={() => scrollToSection('generators')} 
                  className="text-left text-lg font-semibold py-3 px-4 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-all"
                >
                  Генераторы
                </button>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="text-left text-lg font-semibold py-3 px-4 rounded-lg hover:bg-violet-50 hover:text-violet-600 transition-all"
                >
                  О сервисе
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')} 
                  className="text-left text-lg font-semibold py-3 px-4 rounded-lg hover:bg-fuchsia-50 hover:text-fuchsia-600 transition-all"
                >
                  Тарифы
                </button>
                <button 
                  onClick={() => scrollToSection('contacts')} 
                  className="text-left text-lg font-semibold py-3 px-4 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all"
                >
                  Контакты
                </button>
                
                <div className="pt-4 border-t border-purple-200">
                  <Button className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-violet-600 hover:from-purple-700 hover:via-pink-600 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                    Начать бесплатно
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