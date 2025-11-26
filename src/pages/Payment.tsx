import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Icon from '@/components/ui/icon';

const Payment = () => {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
            />
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