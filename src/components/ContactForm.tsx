import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [agreePersonalData, setAgreePersonalData] = useState(false);
  const [agreePrivacyPolicy, setAgreePrivacyPolicy] = useState(false);

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

    if (!agreePersonalData || !agreePrivacyPolicy) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо согласие с обработкой данных и политикой конфиденциальности',
        variant: 'destructive',
      });
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
        setAgreePersonalData(false);
        setAgreePrivacyPolicy(false);
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
    <div className="border-t border-cyan-500/20 pt-8">
      <h3 className="font-bold text-lg mb-4 text-center text-cyan-300 text-shadow-neon">Напишите нам</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            placeholder="Ваше имя" 
            className="bg-[#0f1729] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
          <Input 
            placeholder="Email" 
            type="email" 
            className="bg-[#0f1729] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>
        <Textarea 
          placeholder="Ваше сообщение" 
          className="min-h-32 bg-[#0f1729] border-cyan-500/30 text-cyan-100 placeholder:text-cyan-100/30"
          value={contactMessage}
          onChange={(e) => setContactMessage(e.target.value)}
        />
        
        <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Icon name="Shield" className="text-purple-400" size={20} />
            <label className="text-sm font-semibold text-purple-100">
              Проверка: Сколько будет {captchaQuestion.num1} + {captchaQuestion.num2}?
            </label>
          </div>
          <div className="flex gap-3">
            <Input 
              type="number"
              placeholder="Ваш ответ"
              className="bg-[#0f1729] border-purple-500/30 text-purple-100 placeholder:text-purple-100/30"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
            />
            <Button 
              type="button"
              variant="outline"
              size="icon"
              onClick={generateCaptcha}
              className="flex-shrink-0 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              <Icon name="RefreshCw" size={18} />
            </Button>
          </div>
        </div>
        
        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3">
            <Checkbox 
              id="personal-data"
              checked={agreePersonalData}
              onCheckedChange={(checked) => setAgreePersonalData(checked as boolean)}
              className="mt-1 border-cyan-500/40 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
            />
            <label htmlFor="personal-data" className="text-sm text-cyan-100/70 leading-relaxed cursor-pointer">
              Я согласен с <a href="#" className="text-cyan-400 hover:text-cyan-300 underline transition-colors">обработкой персональных данных</a>
            </label>
          </div>
          
          <div className="flex items-start gap-3">
            <Checkbox 
              id="privacy-policy"
              checked={agreePrivacyPolicy}
              onCheckedChange={(checked) => setAgreePrivacyPolicy(checked as boolean)}
              className="mt-1 border-cyan-500/40 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
            />
            <label htmlFor="privacy-policy" className="text-sm text-cyan-100/70 leading-relaxed cursor-pointer">
              Я согласен с <a href="#" className="text-cyan-400 hover:text-cyan-300 underline transition-colors">политикой конфиденциальности</a>
            </label>
          </div>
        </div>
        
        <Button 
          onClick={handleSendMessage}
          disabled={isSendingMessage || !agreePersonalData || !agreePrivacyPolicy}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#0f1729] disabled:opacity-50 border-0 font-bold neon-glow transition-all duration-300"
        >
          {isSendingMessage ? (
            <>
              <div className="w-4 h-4 border-2 border-[#0f1729] border-t-transparent rounded-full animate-spin mr-2"></div>
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