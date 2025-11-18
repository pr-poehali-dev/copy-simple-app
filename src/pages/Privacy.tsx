import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const Privacy = () => {
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
          <h1 className="text-3xl font-bold mb-6 text-3d">Политика конфиденциальности</h1>
          
          <div className="space-y-6 text-sm">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Общие положения</h2>
              <p className="text-muted-foreground">
                Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных 
                пользователей сервиса "Копи Просто" (далее - Сервис). Используя Сервис, вы соглашаетесь с условиями 
                данной Политики.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Собираемые данные</h2>
              <p className="text-muted-foreground mb-2">Мы собираем следующие категории персональных данных:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Номер телефона для авторизации и связи</li>
                <li>Данные банковских карт (последние 4 цифры и имя держателя)</li>
                <li>Информация о покупках и транзакциях</li>
                <li>Технические данные (IP-адрес, тип устройства, браузер)</li>
                <li>Cookie-файлы для улучшения работы сервиса</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Цели обработки данных</h2>
              <p className="text-muted-foreground mb-2">Ваши персональные данные используются для:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Предоставления доступа к Сервису и его функциям</li>
                <li>Обработки платежей и начисления кэшбэка</li>
                <li>Связи с вами по вопросам использования Сервиса</li>
                <li>Улучшения качества и безопасности Сервиса</li>
                <li>Выполнения требований законодательства</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Защита данных</h2>
              <p className="text-muted-foreground">
                Мы применяем современные технические и организационные меры для защиты ваших персональных данных 
                от несанкционированного доступа, изменения, раскрытия или уничтожения. Данные передаются по 
                защищенным каналам с использованием шифрования.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Передача данных третьим лицам</h2>
              <p className="text-muted-foreground">
                Мы не продаем и не передаем ваши персональные данные третьим лицам, за исключением случаев, 
                необходимых для обработки платежей (платежные системы), или по требованию законодательства.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Файлы cookie</h2>
              <p className="text-muted-foreground">
                Мы используем cookie-файлы для сохранения ваших настроек, анализа использования Сервиса и 
                улучшения пользовательского опыта. Вы можете отключить cookie в настройках браузера, но это 
                может ограничить функциональность Сервиса.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Ваши права</h2>
              <p className="text-muted-foreground mb-2">Вы имеете право:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Получать информацию о ваших персональных данных</li>
                <li>Требовать исправления неточных данных</li>
                <li>Требовать удаления ваших данных</li>
                <li>Отозвать согласие на обработку данных</li>
                <li>Ограничить обработку данных</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Хранение данных</h2>
              <p className="text-muted-foreground">
                Мы храним ваши персональные данные в течение срока, необходимого для достижения целей обработки, 
                или в соответствии с требованиями законодательства.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Изменения в Политике</h2>
              <p className="text-muted-foreground">
                Мы оставляем за собой право вносить изменения в настоящую Политику конфиденциальности. 
                Актуальная версия всегда доступна в Сервисе. Существенные изменения вступают в силу после 
                уведомления пользователей.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Контакты</h2>
              <p className="text-muted-foreground">
                По вопросам обработки персональных данных вы можете обратиться к нам через форму обратной связи 
                в приложении или по электронной почте.
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

export default Privacy;
