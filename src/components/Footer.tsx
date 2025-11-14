import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-cyan-500/10 bg-[#1a2332]/80 backdrop-blur-xl py-12 px-6 mt-20">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
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
        
        <div className="border-t border-cyan-500/10 pt-6">
          <div className="flex flex-col items-center space-y-2">
            <h3 className="text-cyan-100/90 font-semibold text-sm mb-2">Юридическая информация</h3>
            <div className="text-center space-y-1">
              <p className="text-cyan-100/70 text-sm">
                <span className="font-semibold text-cyan-300">ИП ЗВЕРЕВ АЛЕКСЕЙ СЕРГЕЕВИЧ</span>
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 text-xs text-cyan-100/60">
                <p>
                  <span className="font-medium text-cyan-200">ИНН:</span> 616116993432
                </p>
                <p>
                  <span className="font-medium text-cyan-200">ОГРНИП:</span> 311619329100203
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
