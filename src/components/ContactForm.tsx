import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const ContactForm = () => {
  const { toast } = useToast();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ num1, num2, answer: num1 + num2 });
    setCaptchaAnswer('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSendMessage = async () => {
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    if (!captchaAnswer.trim() || parseInt(captchaAnswer) !== captchaQuestion.answer) {
      toast({
        title: 'Ошибка',
        description: 'Неверный ответ на вопрос. Попробуйте еще раз.',
        variant: 'destructive',
      });
      generateCaptcha();
      return;
    }

    setIsSendingMessage(true);

    try {
      const captchaHash = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(captchaAnswer)
      );
      const hashArray = Array.from(new Uint8Array(captchaHash));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const response = await fetch('https://functions.poehali.dev/0e7f29bd-c996-440c-9658-c17677f2981a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
          captcha: hashHex,
          captchaAnswer: captchaAnswer,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.',
        });
        setContactName('');
        setContactEmail('');
        setContactMessage('');
        generateCaptcha();
      } else {
        if (response.status === 429) {
          toast({
            title: 'Слишком много запросов',
            description: 'Пожалуйста, подождите немного перед следующей попыткой.',
            variant: 'destructive',
          });
        } else {
          throw new Error(data.error || 'Failed to send message');
        }
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить сообщение. Попробуйте позже.',
        variant: 'destructive',
      });
      generateCaptcha();
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-8">
      <h3 className="font-bold text-lg mb-4 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Напишите нам</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            placeholder="Ваше имя" 
            className="bg-white/80"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
          <Input 
            placeholder="Email" 
            type="email" 
            className="bg-white/80"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>
        <Textarea 
          placeholder="Ваше сообщение" 
          className="min-h-32 bg-white/80"
          value={contactMessage}
          onChange={(e) => setContactMessage(e.target.value)}
        />
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Icon name="Shield" className="text-purple-600" size={20} />
            <label className="text-sm font-semibold text-gray-700">
              Проверка: Сколько будет {captchaQuestion.num1} + {captchaQuestion.num2}?
            </label>
          </div>
          <div className="flex gap-3">
            <Input 
              type="number"
              placeholder="Ваш ответ"
              className="bg-white"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
            />
            <Button 
              type="button"
              variant="outline"
              size="icon"
              onClick={generateCaptcha}
              className="flex-shrink-0"
            >
              <Icon name="RefreshCw" size={18} />
            </Button>
          </div>
        </div>
        
        <Button 
          onClick={handleSendMessage}
          disabled={isSendingMessage}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-violet-600 hover:from-purple-700 hover:via-pink-600 hover:to-violet-700 text-white disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
        >
          {isSendingMessage ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Отправка...
            </>
          ) : (
            <>
              <Icon name="Send" className="mr-2" size={18} />
              Отправить сообщение
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ContactForm;