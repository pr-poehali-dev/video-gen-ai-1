import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(ru|com)$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
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

    if (name.trim().length < 2) {
      toast({
        title: 'Неверное имя',
        description: 'Имя должно содержать минимум 2 символа',
        variant: 'destructive',
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Пароли не совпадают',
        variant: 'destructive'
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Ошибка',
        description: 'Пароль должен содержать минимум 6 символов',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const userData = {
        email,
        name,
        password,
        provider: 'email',
        plan: 'Старт',
        registeredAt: new Date().toISOString(),
        joinDate: new Date().toISOString(),
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('user_data', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user_registered', 'true');
      
      toast({
        title: 'Успешная регистрация!',
        description: `Добро пожаловать, ${name}!`,
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
          <div className="w-16 h-16 bg-purple-500/10 border-2 border-purple-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 neon-glow-purple animate-icon-pop">
            <Icon name="UserPlus" className="text-purple-400" size={32} />
          </div>
          <CardTitle className="text-3xl font-black text-purple-400 text-shadow-purple">
            Регистрация
          </CardTitle>
          <CardDescription className="text-cyan-100/60">
            Создайте аккаунт в ROUSHEN
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-cyan-100">Имя</Label>
              <div className="relative">
                <Icon name="User" className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={20} />
                <Input
                  id="name"
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-[#0f1729]/50 border-purple-500/30 text-cyan-100 placeholder:text-cyan-100/40 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-cyan-100">Email</Label>
              <div className="relative">
                <Icon name="Mail" className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={20} />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-[#0f1729]/50 border-purple-500/30 text-cyan-100 placeholder:text-cyan-100/40 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-cyan-100">Пароль</Label>
              <div className="relative">
                <Icon name="Lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={20} />
                <Input
                  id="password"
                  type="password"
                  placeholder="Минимум 6 символов"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-[#0f1729]/50 border-purple-500/30 text-cyan-100 placeholder:text-cyan-100/40 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-cyan-100">Подтвердите пароль</Label>
              <div className="relative">
                <Icon name="KeyRound" className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={20} />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Повторите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-[#0f1729]/50 border-purple-500/30 text-cyan-100 placeholder:text-cyan-100/40 focus:border-purple-500"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-6 glow-pulse-purple transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                  Регистрация...
                </>
              ) : (
                <>
                  <Icon name="UserPlus" className="mr-2" size={20} />
                  Зарегистрироваться
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-cyan-100/60">
              Уже есть аккаунт?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
              >
                Войти
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
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

export default Register;