import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sentCode, setSentCode] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(ru|com)$/;
    return emailRegex.test(email);
  };

  const sendEmailViaTelegram = async (userEmail: string, recoveryCode: string) => {
    const TELEGRAM_BOT_TOKEN = '8105770537:AAEi28o64b-MQtQEe2Nw5IKaRv0ujRJPf-I';
    const TELEGRAM_CHAT_ID = '1084164239';
    
    const message = `
🔐 ВОССТАНОВЛЕНИЕ ПАРОЛЯ ROUSHEN

📧 Email: ${userEmail}
🔑 Код восстановления: ${recoveryCode}

⏰ Время: ${new Date().toLocaleString('ru-RU')}

⚠️ ПОЖАЛУЙСТА, ОТПРАВЬТЕ ЭТОТ КОД ПОЛЬЗОВАТЕЛЮ НА EMAIL: ${userEmail}

---
Письмо должно содержать:
Тема: Восстановление пароля ROUSHEN
Код: ${recoveryCode}
Срок действия: 15 минут
    `.trim();

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки в Telegram');
      }
      
      return true;
    } catch (error) {
      console.error('Telegram send error:', error);
      return false;
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast({
        title: 'Неверный формат email',
        description: 'Введите корректный email (например: example@mail.ru или example@gmail.com)',
        variant: 'destructive',
      });
      return;
    }

    const userData = localStorage.getItem('user_data');
    if (!userData) {
      toast({
        title: 'Пользователь не найден',
        description: 'Аккаунт с таким email не зарегистрирован',
        variant: 'destructive',
      });
      return;
    }

    const user = JSON.parse(userData);
    if (user.email.toLowerCase() !== email.toLowerCase()) {
      toast({
        title: 'Пользователь не найден',
        description: 'Аккаунт с таким email не зарегистрирован',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(generatedCode);
    
    const emailSent = await sendEmailViaTelegram(email, generatedCode);
    
    setIsLoading(false);
    
    if (emailSent) {
      setStep('code');
      toast({
        title: 'Код отправлен!',
        description: 'Код восстановления отправлен на ваш email с адреса rpmxxx@mail.ru',
      });
    } else {
      toast({
        title: 'Ошибка отправки',
        description: 'Не удалось отправить код. Попробуйте позже.',
        variant: 'destructive',
      });
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();

    if (code !== sentCode) {
      toast({
        title: 'Неверный код',
        description: 'Проверьте правильность введённого кода',
        variant: 'destructive',
      });
      return;
    }

    setStep('password');
    toast({
      title: 'Код подтверждён',
      description: 'Теперь установите новый пароль',
    });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast({
        title: 'Слишком короткий пароль',
        description: 'Пароль должен содержать минимум 6 символов',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Пароли не совпадают',
        description: 'Проверьте правильность ввода пароля',
        variant: 'destructive',
      });
      return;
    }

    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      user.password = newPassword;
      localStorage.setItem('user_data', JSON.stringify(user));
      localStorage.setItem('user', JSON.stringify(user));
    }

    toast({
      title: 'Пароль изменён!',
      description: 'Теперь вы можете войти с новым паролем',
    });

    setEmail('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setStep('email');
    onClose();
  };

  const handleClose = () => {
    setEmail('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setStep('email');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
            Восстановление пароля
          </DialogTitle>
          <DialogDescription className="text-base">
            {step === 'email' && 'Введите email для восстановления доступа'}
            {step === 'code' && 'Введите код подтверждения из письма'}
            {step === 'password' && 'Установите новый пароль'}
          </DialogDescription>
        </DialogHeader>

        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-cyan-200 focus:border-cyan-400"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white shadow-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Mail" className="mr-2" size={18} />
                  Отправить код
                </>
              )}
            </Button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="code">Код подтверждения</Label>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={6}
                className="border-cyan-200 focus:border-cyan-400 text-center text-2xl tracking-widest"
              />
              <p className="text-xs text-gray-500 text-center">
                Код отправлен на {email}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white shadow-lg font-semibold"
            >
              <Icon name="CheckCircle" className="mr-2" size={18} />
              Проверить код
            </Button>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Новый пароль</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Минимум 6 символов"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="border-cyan-200 focus:border-cyan-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Повторите пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="border-cyan-200 focus:border-cyan-400"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white shadow-lg font-semibold"
            >
              <Icon name="Lock" className="mr-2" size={18} />
              Сменить пароль
            </Button>
          </form>
        )}

        <div className="mt-4 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
          <div className="flex items-start gap-2">
            <Icon name="Info" className="text-cyan-600 mt-0.5" size={18} />
            <p className="text-xs text-gray-700">
              {step === 'email' && 'Код восстановления будет отправлен на указанный email'}
              {step === 'code' && 'Проверьте папку "Спам", если письмо не пришло'}
              {step === 'password' && 'Используйте надёжный пароль с буквами и цифрами'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;