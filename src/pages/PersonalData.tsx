import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';

const PersonalData = () => {
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
                Согласие на обработку персональных данных
              </CardTitle>
              <p className="text-center text-cyan-100/60 mt-2">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <div className="space-y-6 text-cyan-100/80">
                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">1. Общие положения</h2>
                  <p className="leading-relaxed">
                    Настоящим я даю свое согласие на обработку моих персональных данных сервису ROUSHEN (далее — «Оператор») в соответствии с Федеральным законом от 27.07.2006 №152-ФЗ «О персональных данных».
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">2. Перечень персональных данных</h2>
                  <p className="leading-relaxed mb-2">Настоящим я предоставляю согласие на обработку следующих персональных данных:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Фамилия, имя, отчество</li>
                    <li>Адрес электронной почты</li>
                    <li>Номер телефона</li>
                    <li>Данные об использовании сервиса</li>
                    <li>IP-адрес и технические характеристики устройства</li>
                    <li>Контент, создаваемый через AI-генераторы</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">3. Цели обработки персональных данных</h2>
                  <p className="leading-relaxed mb-2">Обработка персональных данных осуществляется в следующих целях:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Регистрация и авторизация пользователя в системе</li>
                    <li>Предоставление доступа к функциям Сервиса</li>
                    <li>Идентификация пользователя и связь с ним</li>
                    <li>Обработка запросов и заявок от пользователя</li>
                    <li>Улучшение качества Сервиса и разработка новых функций</li>
                    <li>Проведение статистических и аналитических исследований</li>
                    <li>Информирование о новых продуктах и услугах</li>
                    <li>Техническая поддержка пользователей</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">4. Способы обработки персональных данных</h2>
                  <p className="leading-relaxed mb-2">Оператор осуществляет обработку персональных данных следующими способами:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Сбор, запись, систематизация</li>
                    <li>Накопление, хранение</li>
                    <li>Уточнение (обновление, изменение)</li>
                    <li>Извлечение, использование</li>
                    <li>Передача (предоставление, доступ)</li>
                    <li>Обезличивание, блокирование</li>
                    <li>Удаление, уничтожение</li>
                  </ul>
                  <p className="leading-relaxed mt-3">
                    Обработка персональных данных может осуществляться как автоматизированным, так и неавтоматизированным способом.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">5. Срок обработки персональных данных</h2>
                  <p className="leading-relaxed">
                    Персональные данные обрабатываются в течение срока действия настоящего согласия. Согласие действует с момента его предоставления до момента отзыва. Согласие может быть отозвано в любой момент путем направления письменного уведомления Оператору.
                  </p>
                  <p className="leading-relaxed mt-3">
                    После отзыва согласия или достижения целей обработки персональные данные подлежат уничтожению, если иное не предусмотрено действующим законодательством Российской Федерации.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">6. Передача персональных данных</h2>
                  <p className="leading-relaxed">
                    Настоящим я даю согласие на передачу моих персональных данных третьим лицам в случаях, необходимых для предоставления Сервиса, а именно:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                    <li>Облачным провайдерам для хранения данных</li>
                    <li>Платежным системам для обработки платежей</li>
                    <li>Сервисам аналитики для анализа использования</li>
                    <li>Партнерам, предоставляющим технологии искусственного интеллекта</li>
                  </ul>
                  <p className="leading-relaxed mt-3">
                    Все третьи лица, получающие доступ к персональным данным, обязуются соблюдать конфиденциальность и обеспечивать безопасность данных.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">7. Трансграничная передача данных</h2>
                  <p className="leading-relaxed">
                    Настоящим я даю согласие на трансграничную передачу моих персональных данных на территорию иностранных государств в случаях, когда это необходимо для предоставления Сервиса (например, использование облачных сервисов, расположенных за пределами Российской Федерации).
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">8. Права субъекта персональных данных</h2>
                  <p className="leading-relaxed mb-2">Я проинформирован(а) о следующих правах:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Право на получение информации об обработке персональных данных</li>
                    <li>Право на доступ к персональным данным</li>
                    <li>Право на уточнение, исправление и дополнение персональных данных</li>
                    <li>Право на удаление персональных данных</li>
                    <li>Право на отзыв согласия на обработку персональных данных</li>
                    <li>Право на ограничение обработки персональных данных</li>
                    <li>Право на обжалование действий Оператора</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">9. Меры защиты персональных данных</h2>
                  <p className="leading-relaxed">
                    Оператор применяет необходимые и достаточные организационные и технические меры для защиты персональных данных от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения, а также от иных неправомерных действий.
                  </p>
                  <p className="leading-relaxed mt-3">
                    Применяются современные методы шифрования данных при передаче и хранении, системы контроля доступа, регулярное резервное копирование и другие меры безопасности.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">10. Отзыв согласия</h2>
                  <p className="leading-relaxed">
                    Для отзыва настоящего согласия необходимо направить письменное заявление на адрес электронной почты Оператора: Rpmxxx@mail.ru. Отзыв согласия не влияет на законность обработки персональных данных, осуществленной до момента отзыва.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">11. Контактная информация Оператора</h2>
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

                <section>
                  <h2 className="text-2xl font-bold text-cyan-300 mb-3">12. Заключительные положения</h2>
                  <p className="leading-relaxed">
                    Настоящее согласие вступает в силу с момента его предоставления и действует до момента отзыва. Согласие распространяется на все персональные данные, предоставленные Оператору как до, так и после предоставления настоящего согласия.
                  </p>
                  <p className="leading-relaxed mt-3">
                    Используя Сервис и предоставляя свои персональные данные, я подтверждаю, что ознакомлен(а) с условиями обработки персональных данных и согласен(а) с ними.
                  </p>
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

export default PersonalData;