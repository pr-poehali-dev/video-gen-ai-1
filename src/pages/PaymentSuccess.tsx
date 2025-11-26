import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Icon from '@/components/ui/icon';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    
    if (!paymentId) {
      setStatus('error');
      return;
    }

    const checkPayment = async () => {
      try {
        const response = await fetch(
          'https://functions.poehali.dev/af7d6978-94af-4605-8dc6-affae659f400',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'check',
              payment_id: paymentId
            })
          }
        );
        
        const result = await response.json();

        if (response.ok) {
          setPaymentData(result);
          if (result.status === 'succeeded' && result.paid) {
            setStatus('success');
          } else if (result.status === 'canceled') {
            setStatus('error');
          } else {
            setTimeout(checkPayment, 2000);
          }
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    checkPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          {status === 'loading' && (
            <>
              <div className="flex justify-center mb-4">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
              </div>
              <CardTitle className="text-center">Проверяем платёж...</CardTitle>
              <CardDescription className="text-center">
                Подождите несколько секунд
              </CardDescription>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Icon name="Check" size={32} className="text-green-600" />
                </div>
              </div>
              <CardTitle className="text-center text-green-600">Оплата успешна!</CardTitle>
              <CardDescription className="text-center">
                Спасибо за вашу оплату
              </CardDescription>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                  <Icon name="X" size={32} className="text-red-600" />
                </div>
              </div>
              <CardTitle className="text-center text-red-600">Ошибка оплаты</CardTitle>
              <CardDescription className="text-center">
                Платёж не был завершён
              </CardDescription>
            </>
          )}
        </CardHeader>
        
        {paymentData && status === 'success' && (
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Сумма:</span>
              <span className="font-medium">{paymentData.amount?.value} ₽</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ID платежа:</span>
              <span className="font-mono text-xs">{paymentData.payment_id}</span>
            </div>
          </CardContent>
        )}
        
        <CardFooter className="flex gap-2">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex-1"
          >
            На главную
          </Button>
          {status === 'error' && (
            <Button
              onClick={() => navigate('/payment')}
              className="flex-1"
            >
              Попробовать снова
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess;