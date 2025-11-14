import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user_registered', 'true');
    localStorage.removeItem('request_count');
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

        <div className="mt-4 p-4 bg-violet-50 rounded-lg border border-violet-200">
          <div className="flex items-start gap-2">
            <Icon name="Info" className="text-violet-600 mt-0.5" size={18} />
            <p className="text-xs text-gray-700">
              После регистрации вы получите неограниченный доступ ко всем функциям генерации контента
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
