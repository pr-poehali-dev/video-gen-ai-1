import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

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

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1729]/95 border-b border-cyan-500/10 backdrop-blur-xl border-glow-animate">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-lg flex items-center justify-center glow-pulse-cyan">
                <Icon name="Sparkles" className="text-cyan-400" size={28} />
              </div>
              <span className="text-2xl font-black text-cyan-400 text-flicker tracking-tight">
                ROUSHEN
              </span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
            >
              <Icon name="ArrowLeft" className="mr-2" size={18} />
              На главную
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-[#1a2332]/80 border border-cyan-500/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl font-black text-cyan-400 text-center text-flicker">
                Политика конфиденциальности
              </CardTitle>
              <p className="text-center text-cyan-100/60 mt-2">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <div className="space-y-6 text-cyan-100/80">
                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">1. Общие положения</h2>
                  <p className="leading-relaxed">
                    Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сервиса ROUSHEN (далее — «Сервис»). Используя Сервис, вы соглашаетесь с условиями настоящей Политики конфиденциальности.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">2. Собираемая информация</h2>
                  <p className="leading-relaxed mb-2">Мы собираем следующие типы информации:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Имя и контактный адрес электронной почты</li>
                    <li>Информацию об использовании Сервиса (логи, статистика)</li>
                    <li>Технические данные (IP-адрес, тип браузера, операционная система)</li>
                    <li>Данные, предоставляемые вами при создании контента через AI-генераторы</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">3. Цели обработки данных</h2>
                  <p className="leading-relaxed mb-2">Собранная информация используется для:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Предоставления доступа к функциям Сервиса</li>
                    <li>Улучшения качества работы Сервиса</li>
                    <li>Связи с пользователями по вопросам поддержки</li>
                    <li>Анализа использования Сервиса и подготовки статистики</li>
                    <li>Выполнения обязательств перед пользователями</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">4. Защита данных</h2>
                  <p className="leading-relaxed">
                    Мы применяем современные технические и организационные меры для защиты ваших персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения. Все данные передаются по защищенным каналам связи с использованием SSL/TLS шифрования.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">5. Передача данных третьим лицам</h2>
                  <p className="leading-relaxed">
                    Мы не продаем и не передаем ваши персональные данные третьим лицам, за исключением случаев:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                    <li>Когда это необходимо для предоставления Сервиса (например, облачные провайдеры)</li>
                    <li>По требованию законодательства или государственных органов</li>
                    <li>С вашего явного согласия</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">6. Файлы cookie</h2>
                  <p className="leading-relaxed">
                    Сервис использует файлы cookie для улучшения пользовательского опыта, аналитики и персонализации контента. Вы можете отключить использование cookie в настройках вашего браузера, однако это может ограничить функциональность Сервиса.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">7. Права пользователей</h2>
                  <p className="leading-relaxed mb-2">Вы имеете право:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Получать информацию о хранящихся данных</li>
                    <li>Требовать исправления неточных данных</li>
                    <li>Требовать удаления ваших персональных данных</li>
                    <li>Отозвать согласие на обработку данных</li>
                    <li>Ограничить обработку ваших данных</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">8. Хранение данных</h2>
                  <p className="leading-relaxed">
                    Ваши персональные данные хранятся в течение срока, необходимого для достижения целей их обработки, или в течение срока, установленного законодательством. После прекращения использования Сервиса данные могут быть удалены по вашему запросу.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">9. Изменения в Политике</h2>
                  <p className="leading-relaxed">
                    Мы оставляем за собой право вносить изменения в настоящую Политику конфиденциальности. О существенных изменениях мы будем уведомлять пользователей по электронной почте или через уведомления в Сервисе.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">10. Контактная информация</h2>
                  <p className="leading-relaxed mb-4">
                    По вопросам, связанным с обработкой персональных данных, вы можете связаться с нами:
                  </p>
                  <div className="bg-[#0f1729]/50 border border-cyan-500/20 rounded-lg p-6 space-y-2">
                    <p className="font-semibold text-cyan-300 text-lg">ИП ЗВЕРЕВ АЛЕКСЕЙ СЕРГЕЕВИЧ</p>
                    <p className="text-cyan-100/80">ИНН: <span className="font-mono text-cyan-200">616116993432</span></p>
                    <p className="text-cyan-100/80">ОГРНИП: <span className="font-mono text-cyan-200">311619329100203</span></p>
                    <div className="pt-3 mt-3 border-t border-cyan-500/10">
                      <p className="text-cyan-400">Email: Rpmxxx@mail.ru</p>
                      <p className="text-cyan-400">Телефон: +7 928 226-46-38</p>
                      <p className="text-cyan-400">Адрес: г. Ростов-на-Дону, пер. Технологический, 8И</p>
                    </div>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;