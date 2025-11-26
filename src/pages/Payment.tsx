import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Icon from '@/components/ui/icon';

const Payment = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlanSelected, setIsPlanSelected] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  useEffect(() => {
    const planName = searchParams.get('plan');
    const planAmount = searchParams.get('amount');
    
    if (planAmount && planName) {
      setAmount(planAmount);
      setDescription(`Подписка на тариф "${planName}"`);
      setIsPlanSelected(true);
      setSelectedPlan(planName);
    }
  }, [searchParams]);

  const getPlanIcon = (plan: string) => {
    switch(plan) {
      case 'Старт': return 'Rocket';
      case 'Про': return 'Star';
      case 'Бизнес': return 'Building2';
      default: return 'Package';
    }
  };

  const getPlanColor = (plan: string) => {
    switch(plan) {
      case 'Старт': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'Про': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'Бизнес': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Ошибка',
        description: 'Введите корректную сумму',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/af7d6978-94af-4605-8dc6-affae659f400', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          amount: parseFloat(amount),
          description: description || 'Оплата на сайте',
          return_url: window.location.origin + '/payment-success',
        }),
      });

      const result = await response.json();
      console.log('Payment response:', result);

      if (response.ok && result.payment_url) {
        console.log('Redirecting to:', result.payment_url);
        window.location.href = result.payment_url;
      } else {
        console.error('Payment error:', result);
        throw new Error(result.error || 'Ошибка создания платежа');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось создать платёж',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Icon name="CreditCard" size={28} />
            Оплата
          </CardTitle>
          <CardDescription>
            Безопасная оплата через ЮКассу
          </CardDescription>
        </CardHeader>
        {isPlanSelected && (
          <div className="px-6 pb-4">
            <div className={`flex items-center gap-3 p-4 rounded-lg border ${getPlanColor(selectedPlan)}`}>
              <div className="flex-shrink-0">
                <Icon name={getPlanIcon(selectedPlan)} size={24} />
              </div>
              <div>
                <div className="font-semibold">Тариф: {selectedPlan}</div>
                <div className="text-sm opacity-80">{amount} ₽/месяц</div>
              </div>
            </div>
          </div>
        )}
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Сумма (₽)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              disabled={isPlanSelected}
              className={isPlanSelected ? 'bg-muted cursor-not-allowed' : ''}
            />
            {isPlanSelected && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Icon name="Lock" size={12} />
                Сумма тарифа изменению не подлежит
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Описание (необязательно)</Label>
            <Input
              id="description"
              placeholder="За что оплата"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="p-3 bg-muted/50 rounded-lg flex items-start gap-2 text-sm">
            <Icon name="Info" size={16} className="mt-0.5 text-muted-foreground" />
            <p className="text-muted-foreground">
              На следующем шаге вы сможете выбрать удобный способ: карта, ЮMoney, СБП или кошелек
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Создание платежа...
              </>
            ) : (
              <>
                <Icon name="Lock" className="mr-2" size={18} />
                Перейти к оплате
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Payment;