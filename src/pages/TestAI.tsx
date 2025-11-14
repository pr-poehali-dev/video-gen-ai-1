import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const TestAI = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testAPI = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите запрос',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    setResponse('');

    try {
      const res = await fetch('https://functions.poehali.dev/afb4ee36-6a99-4357-b02b-de653bf882bc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      const data = await res.json();

      if (data.success) {
        setResponse(data.text);
        toast({
          title: 'Успех!',
          description: 'Текст сгенерирован'
        });
      } else {
        setResponse(`Ошибка: ${data.error}\n${data.message || ''}`);
        toast({
          title: 'Ошибка API',
          description: data.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      setResponse(`Ошибка запроса: ${errorMessage}`);
      toast({
        title: 'Ошибка',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Тест Hugging Face API</h1>
        
        <Card className="border-slate-700 mb-6">
          <CardHeader>
            <CardTitle>Запрос к нейросети</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Напиши короткое стихотворение про космос..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
            
            <Button 
              onClick={testAPI}
              disabled={isLoading || !prompt.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                  Генерация...
                </>
              ) : (
                <>
                  <Icon name="Sparkles" className="mr-2" size={20} />
                  Сгенерировать
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {response && (
          <Card className="border-slate-700">
            <CardHeader>
              <CardTitle>Ответ нейросети</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-slate-300 bg-slate-900 p-4 rounded-lg">
                {response}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestAI;
