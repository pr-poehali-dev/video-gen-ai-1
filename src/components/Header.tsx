import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import UserProfile from '@/components/UserProfile';

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  scrollToSection: (sectionId: string) => void;
}

const Header = ({ isMobileMenuOpen, setIsMobileMenuOpen, scrollToSection }: HeaderProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const isRegistered = localStorage.getItem('user_registered') === 'true';
      const userData = localStorage.getItem('user_data');
      
      if (isRegistered && userData) {
        setIsAuthenticated(true);
        try {
          const user = JSON.parse(userData);
          setUserName(user.name || 'Пользователь');
        } catch (e) {
          setUserName('Пользователь');
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    const interval = setInterval(checkAuth, 1000);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);
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
              <a 
                href="https://t.me/roushenai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-100/70 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
                aria-label="Telegram канал"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  className="transition-transform duration-300"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </a>
            </div>
            
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="hidden md:block">
                  <UserProfile />
                </div>
              ) : (
                <>
                  <Button 
                    onClick={() => navigate('/login')}
                    variant="outline"
                    className="hidden md:flex border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
                  >
                    <Icon name="LogIn" className="mr-2" size={18} />
                    Войти
                  </Button>
                  <Button 
                    onClick={() => navigate('/register')}
                    className="hidden md:flex bg-purple-600 hover:bg-purple-500 text-white border-0 font-bold glow-pulse-purple transition-all duration-300 hover:scale-105"
                  >
                    Начать проект
                  </Button>
                </>
              )}
              
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
                <a 
                  href="https://t.me/roushenai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-left text-lg font-medium py-3 px-4 rounded-lg text-cyan-100/70 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all flex items-center gap-3"
                >
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                  Telegram канал
                </a>
                
                <div className="pt-4 border-t border-cyan-500/20 space-y-2">
                  {isAuthenticated ? (
                    <div className="flex justify-center">
                      <UserProfile />
                    </div>
                  ) : (
                    <>
                      <Button 
                        onClick={() => navigate('/login')}
                        variant="outline"
                        className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                      >
                        <Icon name="LogIn" className="mr-2" size={18} />
                        Войти
                      </Button>
                      <Button 
                        onClick={() => navigate('/register')}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white border-0 font-bold neon-glow-purple transition-all duration-300"
                      >
                        Начать проект
                      </Button>
                    </>
                  )}
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