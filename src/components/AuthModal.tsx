import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { getDeviceFingerprint, resetRequestCount } from '@/utils/deviceFingerprint';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const deviceId = getDeviceFingerprint();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(ru|com)$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: 'Неверный формат email',
        description: 'Введите корректный email (например: example@mail.ru или example@gmail.com)',
        variant: 'destructive',
      });
      return;
    }

    if (!isLogin && name.trim().length < 2) {
      toast({
        title: 'Неверное имя',
        description: 'Имя должно содержать минимум 2 символа',
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

    if (isLogin) {
      const storedUser = localStorage.getItem('user_data');
      if (!storedUser) {
        toast({
          title: 'Пользователь не найден',
          description: 'Аккаунт с таким email не зарегистрирован',
          variant: 'destructive',
        });
        return;
      }

      const userData = JSON.parse(storedUser);
      if (userData.email !== email) {
        toast({
          title: 'Неверный email',
          description: 'Проверьте правильность введённого email',
          variant: 'destructive',
        });
        return;
      }

      if (userData.password && userData.password !== password) {
        toast({
          title: 'Неверный пароль',
          description: 'Проверьте правильность введённого пароля',
          variant: 'destructive',
        });
        return;
      }
    }
    
    const userData = {
      email,
      name: isLogin ? email.split('@')[0] : name,
      password,
      provider: 'email',
      deviceId,
      registeredAt: new Date().toISOString()
    };

    localStorage.setItem('user_registered', 'true');
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('auth_token', Math.random().toString(36).substring(2));
    resetRequestCount(deviceId);
    
    toast({
      title: isLogin ? 'Вход выполнен!' : 'Регистрация успешна!',
      description: isLogin ? 'Добро пожаловать обратно!' : 'Ваш аккаунт создан',
    });
    
    onSuccess();
    onClose();
  };

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    const userData = {
      email: `user@${provider}.com`,
      name: `${provider} User`,
      provider,
      deviceId,
      registeredAt: new Date().toISOString()
    };

    localStorage.setItem('user_registered', 'true');
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('auth_token', Math.random().toString(36).substring(2));
    resetRequestCount(deviceId);
    
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
            {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
          </DialogTitle>
          <DialogDescription className="text-base">
            {isLogin 
              ? 'Войдите, чтобы продолжить использовать сервис'
              : 'Вы использовали 2 бесплатных запроса. Зарегистрируйтесь, чтобы продолжить!'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-violet-200 focus:border-violet-400"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-violet-200 focus:border-violet-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="border-violet-200 focus:border-violet-400"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white shadow-lg font-semibold"
          >
            <Icon name="Sparkles" className="mr-2" size={18} />
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">или продолжить с</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin('google')}
              className="w-full border-gray-300 hover:bg-gray-50"
            >
              <svg className="mr-2" width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3Z"/>
              </svg>
              Google
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin('github')}
              className="w-full border-gray-300 hover:bg-gray-50"
            >
              <Icon name="Github" className="mr-2" size={18} />
              GitHub
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600">
            {isLogin ? (
              <>
                Нет аккаунта?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-violet-600 hover:text-violet-700 font-semibold"
                >
                  Зарегистрируйтесь
                </button>
              </>
            ) : (
              <>
                Уже есть аккаунт?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-violet-600 hover:text-violet-700 font-semibold"
                >
                  Войдите
                </button>
              </>
            )}
          </div>
        </form>

        <div className="space-y-3 mt-6">
          <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
            <div className="flex items-start gap-2">
              <Icon name="Info" className="text-violet-600 mt-0.5" size={18} />
              <p className="text-xs text-gray-700">
                После {isLogin ? 'входа' : 'регистрации'} вы автоматически останетесь в системе и получите неограниченный доступ ко всем функциям
              </p>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Icon name="Monitor" className="text-gray-600" size={16} />
              <p className="text-xs text-gray-600">
                ID устройства: <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">{deviceId.slice(0, 16)}...</code>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;