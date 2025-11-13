import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  user: {
    id: number;
    email: string;
    name: string;
    created_at: string;
  };
  subscription: {
    plan: string;
    status: string;
    end_date: string;
    auto_renew: boolean;
  } | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/53733180-4915-4c21-a626-7d1329e4117e?action=profile', {
        headers: {
          'X-User-Token': token
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        navigate('/login');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить профиль',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const handlePayment = async (paymentMethod: string) => {
    setIsProcessing(true);
    const token = localStorage.getItem('userToken');

    try {
      const response = await fetch('https://functions.poehali.dev/27df6ed9-65dc-4de2-a8cd-fe95d756af17?action=create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Token': token || ''
        },
        body: JSON.stringify({
          plan: selectedPlan,
          payment_method: paymentMethod,
          auto_renew: true,
          return_url: window.location.origin + '/dashboard'
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.confirmation_url) {
          window.location.href = data.confirmation_url;
        } else {
          toast({
            title: 'Успешно!',
            description: 'Подписка активирована'
          });
          setIsPaymentModalOpen(false);
          loadProfile();
        }
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось создать платеж',
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
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    const token = localStorage.getItem('userToken');

    try {
      const response = await fetch('https://functions.poehali.dev/27df6ed9-65dc-4de2-a8cd-fe95d756af17?action=cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Token': token || ''
        }
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Автопродление отменено'
        });
        loadProfile();
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось отменить подписку',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1729] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1729] relative overflow-hidden">
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

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1729]/95 border-b border-cyan-500/10 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-12 h-12 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-lg flex items-center justify-center glow-pulse-cyan">
                <Icon name="Sparkles" className="text-cyan-400" size={28} />
              </div>
              <span className="text-2xl font-black text-cyan-400 text-flicker tracking-tight">
                ROUSHEN
              </span>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
            >
              <Icon name="LogOut" className="mr-2" size={18} />
              Выйти
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-black text-cyan-400 text-flicker mb-8">Личный кабинет</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-[#1a2332]/80 border border-cyan-500/20 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-cyan-100">Профиль</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-cyan-100/50">Имя</p>
                  <p className="text-cyan-100">{profile?.user.name || 'Не указано'}</p>
                </div>
                <div>
                  <p className="text-sm text-cyan-100/50">Email</p>
                  <p className="text-cyan-100">{profile?.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-cyan-100/50">Регистрация</p>
                  <p className="text-cyan-100">
                    {profile?.user.created_at ? new Date(profile.user.created_at).toLocaleDateString('ru-RU') : '-'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-[#1a2332]/80 border border-cyan-500/20 backdrop-blur-xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-cyan-100">Подписка</CardTitle>
                  {profile?.subscription && (
                    <Badge className={profile.subscription.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}>
                      {profile.subscription.status === 'active' ? 'Активна' : 'Неактивна'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {profile?.subscription ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-cyan-100/50">Тариф</p>
                        <p className="text-xl font-bold text-cyan-300">
                          {profile.subscription.plan === 'start' && 'Старт'}
                          {profile.subscription.plan === 'pro' && 'Про'}
                          {profile.subscription.plan === 'business' && 'Бизнес'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-cyan-100/50">Действует до</p>
                        <p className="text-cyan-100">
                          {new Date(profile.subscription.end_date).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-cyan-100/50">Автопродление</p>
                      <p className="text-cyan-100">{profile.subscription.auto_renew ? 'Включено' : 'Выключено'}</p>
                    </div>
                    {profile.subscription.auto_renew && (
                      <Button
                        variant="outline"
                        onClick={handleCancelSubscription}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        Отменить автопродление
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-cyan-100/60 mb-4">У вас пока нет активной подписки</p>
                    <Button
                      onClick={() => handleSelectPlan('pro')}
                      className="bg-cyan-500 hover:bg-cyan-400 text-[#0f1729]"
                    >
                      Выбрать тариф
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#1a2332]/80 border border-cyan-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-cyan-100">Доступные тарифы</CardTitle>
              <CardDescription className="text-cyan-100/60">
                Выберите подходящий план подписки
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#0f1729]/50 border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-cyan-100">Старт</CardTitle>
                    <div className="text-3xl font-bold text-cyan-300">Бесплатно</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center text-sm text-cyan-100/80">
                        <Icon name="Check" className="text-cyan-400 mr-2" size={16} />
                        5 видео в месяц
                      </li>
                      <li className="flex items-center text-sm text-cyan-100/80">
                        <Icon name="Check" className="text-cyan-400 mr-2" size={16} />
                        10 текстов в месяц
                      </li>
                      <li className="flex items-center text-sm text-cyan-100/80">
                        <Icon name="Check" className="text-cyan-400 mr-2" size={16} />
                        3 презентации
                      </li>
                    </ul>
                    <Button
                      onClick={() => handleSelectPlan('start')}
                      variant="outline"
                      className="w-full border-cyan-500/30 text-cyan-400"
                      disabled={profile?.subscription?.plan === 'start'}
                    >
                      {profile?.subscription?.plan === 'start' ? 'Текущий тариф' : 'Выбрать'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-[#0f1729]/50 border-2 border-purple-500/40 relative">
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600">Популярный</Badge>
                  <CardHeader>
                    <CardTitle className="text-purple-100">Про</CardTitle>
                    <div className="text-3xl font-bold text-purple-300">990₽<span className="text-sm text-purple-100/50">/мес</span></div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center text-sm text-purple-100/80">
                        <Icon name="Check" className="text-purple-400 mr-2" size={16} />
                        50 видео в месяц
                      </li>
                      <li className="flex items-center text-sm text-purple-100/80">
                        <Icon name="Check" className="text-purple-400 mr-2" size={16} />
                        Безлимит текстов
                      </li>
                      <li className="flex items-center text-sm text-purple-100/80">
                        <Icon name="Check" className="text-purple-400 mr-2" size={16} />
                        30 презентаций
                      </li>
                      <li className="flex items-center text-sm text-purple-100/80">
                        <Icon name="Check" className="text-purple-400 mr-2" size={16} />
                        Full HD качество
                      </li>
                    </ul>
                    <Button
                      onClick={() => handleSelectPlan('pro')}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white"
                      disabled={profile?.subscription?.plan === 'pro'}
                    >
                      {profile?.subscription?.plan === 'pro' ? 'Текущий тариф' : 'Выбрать'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-[#0f1729]/50 border border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-cyan-100">Бизнес</CardTitle>
                    <div className="text-3xl font-bold text-cyan-300">2990₽<span className="text-sm text-cyan-100/50">/мес</span></div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center text-sm text-cyan-100/80">
                        <Icon name="Check" className="text-cyan-400 mr-2" size={16} />
                        Безлимит всего
                      </li>
                      <li className="flex items-center text-sm text-cyan-100/80">
                        <Icon name="Check" className="text-cyan-400 mr-2" size={16} />
                        4K качество
                      </li>
                      <li className="flex items-center text-sm text-cyan-100/80">
                        <Icon name="Check" className="text-cyan-400 mr-2" size={16} />
                        Персональный менеджер
                      </li>
                      <li className="flex items-center text-sm text-cyan-100/80">
                        <Icon name="Check" className="text-cyan-400 mr-2" size={16} />
                        Приоритетная поддержка
                      </li>
                    </ul>
                    <Button
                      onClick={() => handleSelectPlan('business')}
                      variant="outline"
                      className="w-full border-cyan-500/30 text-cyan-400"
                      disabled={profile?.subscription?.plan === 'business'}
                    >
                      {profile?.subscription?.plan === 'business' ? 'Текущий тариф' : 'Выбрать'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="bg-[#1a2332] border border-cyan-500/20">
          <DialogHeader>
            <DialogTitle className="text-cyan-400 text-2xl">Выберите способ оплаты</DialogTitle>
            <DialogDescription className="text-cyan-100/60">
              Оплата обрабатывается через ЮКassa. Чек будет отправлен на вашу почту.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 mt-4">
            <Button
              onClick={() => handlePayment('sbp')}
              disabled={isProcessing}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white justify-start h-auto py-4"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4">
                  <Icon name="Smartphone" size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold">Система быстрых платежей</div>
                  <div className="text-sm opacity-70">Мгновенный перевод через банк</div>
                </div>
              </div>
            </Button>

            <Button
              onClick={() => handlePayment('bank_card')}
              disabled={isProcessing}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white justify-start h-auto py-4"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4">
                  <Icon name="CreditCard" size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold">Банковская карта</div>
                  <div className="text-sm opacity-70">Visa, Mastercard, МИР</div>
                </div>
              </div>
            </Button>

            {isProcessing && (
              <div className="text-center text-cyan-100/60 py-2">
                <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-2"></div>
                Перенаправление на оплату...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
