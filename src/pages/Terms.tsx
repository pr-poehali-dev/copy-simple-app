import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <Button 
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-4"
        >
          <Icon name="ArrowLeft" className="mr-2" />
          Назад
        </Button>

        <Card className="p-8 card-3d">
          <h1 className="text-3xl font-bold mb-6 text-3d">Пользовательское соглашение</h1>
          
          <div className="space-y-6 text-sm">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Общие условия</h2>
              <p className="text-muted-foreground">
                Настоящее Пользовательское соглашение (далее - Соглашение) регулирует отношения между 
                владельцами сервиса "Копи Просто" (далее - Сервис) и пользователями Сервиса. 
                Регистрируясь и используя Сервис, вы принимаете условия данного Соглашения в полном объеме.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Описание Сервиса</h2>
              <p className="text-muted-foreground">
                "Копи Просто" - это платформа для виртуальных покупок с системой кэшбэка. Пользователи 
                совершают виртуальные покупки в различных категориях, за которые начисляется кэшбэк в 
                размере 80% от суммы покупки на виртуальный баланс.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Регистрация и аккаунт</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Для использования Сервиса необходима регистрация по номеру телефона</li>
                <li>Вы обязуетесь предоставлять достоверную информацию</li>
                <li>Вы несете ответственность за сохранность доступа к вашему аккаунту</li>
                <li>Запрещено создавать несколько аккаунтов одним лицом</li>
                <li>Вы обязуетесь не передавать доступ к аккаунту третьим лицам</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Правила использования</h2>
              <p className="text-muted-foreground mb-2">При использовании Сервиса запрещается:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Использовать Сервис в незаконных целях</li>
                <li>Нарушать права третьих лиц</li>
                <li>Пытаться получить несанкционированный доступ к системе</li>
                <li>Использовать автоматизированные средства для взаимодействия с Сервисом</li>
                <li>Распространять вредоносное программное обеспечение</li>
                <li>Обходить технические ограничения Сервиса</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Финансовые условия</h2>
              <p className="text-muted-foreground mb-2">Условия работы с финансами:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>За каждую виртуальную покупку начисляется кэшбэк 80% на виртуальный баланс</li>
                <li>При зачислении платежа взимается комиссия компании в размере 20% от суммы транзакции</li>
                <li>На счет пользователя поступает сумма, уменьшенная на 20% (комиссия компании)</li>
                <li>Вывод средств становится доступен через 180 дней после первой покупки</li>
                <li>Окно для вывода средств открывается на 3 дня после достижения 180 дней</li>
                <li>Для совершения покупок необходимо привязать банковскую карту</li>
                <li>Мы не храним полные номера банковских карт, только последние 4 цифры для идентификации</li>
                <li>Все финансовые операции проводятся через защищенные платежные системы</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Ответственность</h2>
              <p className="text-muted-foreground mb-2">
                Сервис предоставляется "как есть". Мы прилагаем усилия для стабильной работы, но не гарантируем:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Бесперебойную работу Сервиса</li>
                <li>Отсутствие ошибок и сбоев</li>
                <li>Достижение конкретных результатов от использования</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Мы не несем ответственности за убытки, возникшие в результате использования или 
                невозможности использования Сервиса.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Интеллектуальная собственность</h2>
              <p className="text-muted-foreground">
                Все права на Сервис, включая дизайн, логотипы, тексты, графику, программный код и другие 
                элементы, принадлежат владельцам Сервиса. Запрещается копирование, воспроизведение или 
                использование материалов Сервиса без письменного разрешения.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Изменение и прекращение работы</h2>
              <p className="text-muted-foreground">
                Мы оставляем за собой право в любое время изменять, приостанавливать или прекращать работу 
                Сервиса (полностью или частично) с уведомлением или без него. Мы не несем ответственности 
                перед пользователями за такие изменения.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Изменения в Соглашении</h2>
              <p className="text-muted-foreground">
                Мы вправе изменять условия настоящего Соглашения в одностороннем порядке. Новая редакция 
                вступает в силу с момента размещения в Сервисе. Продолжение использования Сервиса после 
                внесения изменений означает принятие новых условий.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Разрешение споров</h2>
              <p className="text-muted-foreground">
                Все споры решаются путем переговоров. При невозможности достижения согласия споры 
                разрешаются в соответствии с законодательством Российской Федерации.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Контакты</h2>
              <p className="text-muted-foreground">
                По всем вопросам, связанным с настоящим Соглашением, вы можете обратиться к нам через 
                форму обратной связи в приложении.
              </p>
            </section>

            <div className="pt-6 border-t">
              <p className="text-xs text-muted-foreground">
                Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                © 2024 Копи Просто. Все права защищены.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Terms;