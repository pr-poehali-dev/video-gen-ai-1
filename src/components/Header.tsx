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
            
            <div className="flex items-center gap-4">
              <Button className="hidden md:flex bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white">
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
                  className="text-left text-lg font-medium py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  Главная
                </button>
                <button 
                  onClick={() => scrollToSection('generators')} 
                  className="text-left text-lg font-medium py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  Генераторы
                </button>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="text-left text-lg font-medium py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  О сервисе
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')} 
                  className="text-left text-lg font-medium py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  Тарифы
                </button>
                <button 
                  onClick={() => scrollToSection('contacts')} 
                  className="text-left text-lg font-medium py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  Контакты
                </button>
                
                <div className="pt-4 border-t border-gray-200">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white">
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
