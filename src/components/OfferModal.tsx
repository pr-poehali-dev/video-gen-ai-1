import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  planName: string;
}

const OfferModal = ({ isOpen, onClose, onAccept, planName }: OfferModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] bg-[#1a2332]/95 border border-cyan-500/30 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
            <Icon name="FileText" size={28} />
            Договор оферты
          </DialogTitle>
          <DialogDescription className="text-cyan-100/70">
            Тариф: <span className="font-semibold text-purple-400">{planName}</span>
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] w-full rounded-lg border border-cyan-500/20 bg-[#0f1729]/50 p-6">
          <div className="space-y-4 text-cyan-100/80 text-sm leading-relaxed">
            <h3 className="text-lg font-bold text-cyan-400">1. Общие положения</h3>
            <p>
              1.1. Настоящая публичная оферта (далее — «Оферта») является предложением ROUSHEN (далее — «Исполнитель»), 
              адресованным любому физическому или юридическому лицу (далее — «Заказчик»), заключить договор на 
              оказание услуг по разработке AI-решений на изложенных ниже условиях.
            </p>
            <p>
              1.2. В соответствии с пунктом 2 статьи 437 Гражданского кодекса Российской Федерации (ГК РФ) в случае 
              принятия изложенных ниже условий и оплаты услуг лицо, производящее акцепт этой Оферты, становится 
              Заказчиком (далее — «Заказчик»).
            </p>
            
            <h3 className="text-lg font-bold text-cyan-400 mt-6">2. Предмет договора</h3>
            <p>
              2.1. Исполнитель обязуется оказать Заказчику услуги по разработке и внедрению AI-решений в соответствии 
              с выбранным тарифным планом, а Заказчик обязуется принять и оплатить эти услуги.
            </p>
            <p>
              2.2. Конкретный перечень услуг определяется выбранным тарифным планом и техническим заданием.
            </p>
            
            <h3 className="text-lg font-bold text-cyan-400 mt-6">3. Стоимость услуг и порядок оплаты</h3>
            <p>
              3.1. Стоимость услуг определяется действующим на момент заказа прайс-листом Исполнителя.
            </p>
            <p>
              3.2. Оплата производится в безналичной форме путем перечисления денежных средств на расчетный счет Исполнителя.
            </p>
            <p>
              3.3. Датой оплаты считается дата поступления денежных средств на расчетный счет Исполнителя.
            </p>
            
            <h3 className="text-lg font-bold text-cyan-400 mt-6">4. Права и обязанности сторон</h3>
            <p>
              4.1. Исполнитель обязуется:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-2">
              <li>Оказать услуги надлежащего качества в согласованные сроки</li>
              <li>Предоставить консультационную поддержку в рамках выбранного тарифа</li>
              <li>Обеспечить конфиденциальность информации Заказчика</li>
            </ul>
            <p className="mt-4">
              4.2. Заказчик обязуется:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-2">
              <li>Своевременно оплатить услуги в соответствии с выбранным тарифом</li>
              <li>Предоставить необходимую информацию для выполнения работ</li>
              <li>Соблюдать условия использования предоставленных решений</li>
            </ul>
            
            <h3 className="text-lg font-bold text-cyan-400 mt-6">5. Ответственность сторон</h3>
            <p>
              5.1. За неисполнение или ненадлежащее исполнение обязательств по настоящему договору стороны несут 
              ответственность в соответствии с действующим законодательством РФ.
            </p>
            <p>
              5.2. Исполнитель не несет ответственности за убытки, возникшие в результате неправильного использования 
              Заказчиком предоставленных решений.
            </p>
            
            <h3 className="text-lg font-bold text-cyan-400 mt-6">6. Конфиденциальность</h3>
            <p>
              6.1. Стороны обязуются не разглашать конфиденциальную информацию, полученную в ходе выполнения договора.
            </p>
            <p>
              6.2. Обязательство о конфиденциальности действует в течение всего срока действия договора и 3 (трех) лет 
              после его прекращения.
            </p>
            
            <h3 className="text-lg font-bold text-cyan-400 mt-6">7. Порядок разрешения споров</h3>
            <p>
              7.1. Все споры и разногласия решаются путем переговоров.
            </p>
            <p>
              7.2. В случае невозможности урегулирования споров путем переговоров, споры подлежат разрешению в 
              соответствии с действующим законодательством РФ.
            </p>
            
            <h3 className="text-lg font-bold text-cyan-400 mt-6">8. Заключительные положения</h3>
            <p>
              8.1. Настоящий договор вступает в силу с момента акцепта Оферты Заказчиком и действует до полного 
              исполнения сторонами своих обязательств.
            </p>
            <p>
              8.2. Исполнитель вправе вносить изменения в условия Оферты. Новая редакция Оферты вступает в силу 
              с момента ее размещения на сайте.
            </p>
            
            <div className="mt-8 pt-6 border-t border-cyan-500/20">
              <p className="font-semibold text-cyan-400 mb-3">Реквизиты Исполнителя:</p>
              <div className="space-y-1.5 bg-[#0f1729]/30 p-4 rounded-lg border border-cyan-500/10">
                <p className="font-semibold text-cyan-300">ИП ЗВЕРЕВ АЛЕКСЕЙ СЕРГЕЕВИЧ</p>
                <p className="text-cyan-100/80">ИНН: <span className="font-mono text-cyan-200">616116993432</span></p>
                <p className="text-cyan-100/80">ОГРНИП: <span className="font-mono text-cyan-200">311619329100203</span></p>
                <p className="text-cyan-100/80 mt-3">Email: Rpmxxx@mail.ru</p>
                <p className="text-cyan-100/80">Телефон: +7 928 226-46-38</p>
                <p className="text-cyan-100/80">Адрес: г. Ростов-на-Дону, пер. Технологический, 8И</p>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <div className="flex gap-4 mt-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            <Icon name="X" className="mr-2" size={18} />
            Отменить
          </Button>
          <Button
            onClick={onAccept}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white"
          >
            <Icon name="Check" className="mr-2" size={18} />
            Принимаю условия
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferModal;