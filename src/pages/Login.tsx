import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(ru|com)$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: 'Неверный формат email',
        description: 'Введите корректный email (например: example@mail.ru или example@gmail.com)',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Слишком короткий пароль',
        description: 'Пароль должен содержать минимум 6 символов',
        variant: 'destructive',
      });
      return;
    }

    const storedUser = localStorage.getItem('user_data');
    if (!storedUser) {
      toast({
        title: 'Пользователь не найден',
        description: 'Аккаунт с таким email не зарегистрирован. Создайте новый аккаунт.',
        variant: 'destructive',
      });
      return;
    }

    const savedUserData = JSON.parse(storedUser);
    
    if (savedUserData.email !== email) {
      toast({
        title: 'Неверный email',
        description: 'Проверьте правильность введённого email',
        variant: 'destructive',
      });
      return;
    }

    if (savedUserData.password && savedUserData.password !== password) {
      toast({
        title: 'Неверный пароль',
        description: 'Проверьте правильность введённого пароля',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const userData = {
        email,
        name: savedUserData.name || email.split('@')[0],
        plan: 'Старт',
        joinDate: savedUserData.registeredAt || new Date().toISOString(),
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user_registered', 'true');
      
      toast({
        title: 'Успешный вход!',
        description: 'Добро пожаловать в ROUSHEN',
      });
      
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f1729] relative overflow-hidden flex items-center justify-center px-6">
      <div className="scan-line"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-cyan-500/10 rounded-full filter blur-3xl opacity-50 parallax-element glow-pulse-cyan"></div>
        <div className="absolute top-40 right-20 w-[700px] h-[700px] bg-purple-500/10 rounded-full filter blur-3xl opacity-40 parallax-slow glow-pulse-purple"></div>
        <div className="absolute -bottom-20 left-1/3 w-[500px] h-[500px] bg-blue-500/10 rounded-full filter blur-3xl opacity-30 parallax-fast"></div>
        
        <div className="absolute inset-0 grid-pulse" style={{
          backgroundImage: `
            linear-gradient(rgba(100, 255, 218, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 255, 218, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <Card className="w-full max-w-md bg-[#1a2332]/90 border border-cyan-500/30 backdrop-blur-xl relative z-10 animate-scale-in">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 neon-glow animate-icon-pop">
            <Icon name="Sparkles" className="text-cyan-400" size={32} />
          </div>
          <CardTitle className="text-3xl font-black text-cyan-400 text-flicker">
            Вход
          </CardTitle>
          <CardDescription className="text-cyan-100/60">
            Войдите в свой аккаунт ROUSHEN
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-cyan-100">Email</Label>
              <div className="relative">
                <Icon name="Mail" className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={20} />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-[#0f1729]/50 border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/40 focus:border-cyan-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-cyan-100">Пароль</Label>
              <div className="relative">
                <Icon name="Lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={20} />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-[#0f1729]/50 border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/40 focus:border-cyan-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Создать аккаунт
              </button>
              <a 
                href="#" 
                className="text-cyan-100/70 hover:text-cyan-400 transition-colors"
              >
                Забыли пароль?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-500 text-[#0f1729] font-bold py-6 neon-glow transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                  Вход...
                </>
              ) : (
                <>
                  <Icon name="LogIn" className="mr-2" size={20} />
                  Войти
                </>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyan-500/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1a2332] text-cyan-100/60">или войти через</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10 hover:border-cyan-500/50"
            >
              <Icon name="Github" className="mr-2" size={20} />
              GitHub
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10 hover:border-cyan-500/50"
            >
              <Icon name="Chrome" className="mr-2" size={20} />
              Google
            </Button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-cyan-100/70 hover:text-cyan-400 transition-colors inline-flex items-center"
            >
              <Icon name="ArrowLeft" className="mr-1" size={16} />
              Вернуться на главную
            </button>
          </div>
        </CardContent>
      </Card>
      
      <Footer />
    </div>
  );
};

export default Login;