import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/53733180-4915-4c21-a626-7d1329e4117e?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        toast({
          title: 'Успешно!',
          description: `Добро пожаловать, ${data.user.name || 'пользователь'}!`
        });
        
        navigate('/dashboard');
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Неверный email или пароль',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1729] relative overflow-hidden flex items-center justify-center px-6">
      <div className="scan-line"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-cyan-500/10 rounded-full filter blur-3xl opacity-50 floating"></div>
        <div className="absolute top-40 right-20 w-[700px] h-[700px] bg-purple-500/10 rounded-full filter blur-3xl opacity-40 floating-delayed"></div>
        
        <div className="absolute inset-0 grid-pulse" style={{
          backgroundImage: `
            linear-gradient(rgba(100, 255, 218, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 255, 218, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <Card className="w-full max-w-md bg-[#1a2332]/80 border border-cyan-500/20 backdrop-blur-xl relative z-10">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-lg flex items-center justify-center mx-auto mb-4 glow-pulse-cyan">
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
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-cyan-100">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0f1729] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-cyan-100">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ваш пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0f1729] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#0f1729] border-0 font-bold neon-glow transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0f1729] border-t-transparent rounded-full animate-spin mr-2"></div>
                  Вход...
                </>
              ) : (
                <>
                  <Icon name="LogIn" className="mr-2" size={18} />
                  Войти
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-cyan-100/60">
              Нет аккаунта?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
              >
                Зарегистрироваться
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-cyan-100/50 hover:text-cyan-400 transition-colors"
            >
              ← На главную
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
