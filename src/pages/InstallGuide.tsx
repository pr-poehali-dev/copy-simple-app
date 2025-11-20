import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const InstallGuide = () => {
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
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📲</div>
            <h1 className="text-3xl font-bold text-3d">Инструкция по установке приложения</h1>
            <p className="text-muted-foreground mt-2">
              Установите приложение на свой смартфон для быстрого доступа
            </p>
          </div>
          
          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">🤖</div>
                <h2 className="text-2xl font-bold">Android (Chrome)</h2>
              </div>
              
              <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
                <ol className="space-y-4">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">1</span>
                    <div>
                      <p className="font-semibold mb-1">Откройте сайт в Chrome</p>
                      <p className="text-sm text-muted-foreground">
                        Перейдите на сайт приложения через браузер Google Chrome на вашем Android-телефоне
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">2</span>
                    <div>
                      <p className="font-semibold mb-1">Нажмите на кнопку установки</p>
                      <p className="text-sm text-muted-foreground">
                        На главной странице сайта нажмите на яркую кнопку <strong>"📲 Скачать приложение на телефон"</strong>
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">3</span>
                    <div>
                      <p className="font-semibold mb-1">Подтвердите установку</p>
                      <p className="text-sm text-muted-foreground">
                        В появившемся окне нажмите <strong>"Установить"</strong> или <strong>"Install"</strong>
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">4</span>
                    <div>
                      <p className="font-semibold mb-1">Готово!</p>
                      <p className="text-sm text-muted-foreground">
                        Иконка приложения появится на главном экране вашего телефона
                      </p>
                    </div>
                  </li>
                </ol>
                
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <p className="text-sm font-semibold mb-2">💡 Альтернативный способ:</p>
                  <p className="text-sm text-muted-foreground">
                    Нажмите меню <strong>⋮</strong> (три точки) в правом верхнем углу браузера → 
                    выберите <strong>"Установить приложение"</strong> или <strong>"Добавить на главный экран"</strong>
                  </p>
                </div>
              </Card>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">🍎</div>
                <h2 className="text-2xl font-bold">iPhone / iPad (Safari)</h2>
              </div>
              
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                <ol className="space-y-4">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">1</span>
                    <div>
                      <p className="font-semibold mb-1">Откройте сайт в Safari</p>
                      <p className="text-sm text-muted-foreground">
                        Важно использовать именно браузер Safari (стандартный браузер на iPhone/iPad)
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">2</span>
                    <div>
                      <p className="font-semibold mb-1">Нажмите кнопку "Поделиться"</p>
                      <p className="text-sm text-muted-foreground">
                        Найдите и нажмите кнопку <strong>📤 "Поделиться"</strong> (квадрат со стрелкой вверх) внизу экрана
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">3</span>
                    <div>
                      <p className="font-semibold mb-1">Выберите "На экран Домой"</p>
                      <p className="text-sm text-muted-foreground">
                        Прокрутите меню вниз и нажмите <strong>"На экран Домой"</strong> или <strong>"Add to Home Screen"</strong>
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">4</span>
                    <div>
                      <p className="font-semibold mb-1">Нажмите "Добавить"</p>
                      <p className="text-sm text-muted-foreground">
                        Подтвердите добавление, нажав кнопку <strong>"Добавить"</strong> в правом верхнем углу
                      </p>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">5</span>
                    <div>
                      <p className="font-semibold mb-1">Готово!</p>
                      <p className="text-sm text-muted-foreground">
                        Иконка приложения появится на главном экране вашего iPhone/iPad
                      </p>
                    </div>
                  </li>
                </ol>
                
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <p className="text-sm font-semibold mb-2">⚠️ Важно:</p>
                  <p className="text-sm text-muted-foreground">
                    На iPhone/iPad установка возможна только через Safari. 
                    В других браузерах (Chrome, Firefox) эта функция недоступна.
                  </p>
                </div>
              </Card>
            </section>

            <section className="pt-6 border-t">
              <h2 className="text-xl font-bold mb-4 text-center">Преимущества установленного приложения</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="font-semibold mb-1">Быстрый доступ</h3>
                  <p className="text-xs text-muted-foreground">
                    Запускайте приложение прямо с главного экрана
                  </p>
                </Card>
                
                <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-pink-50">
                  <div className="text-3xl mb-2">📱</div>
                  <h3 className="font-semibold mb-1">Нативный интерфейс</h3>
                  <p className="text-xs text-muted-foreground">
                    Работает как обычное приложение без адресной строки
                  </p>
                </Card>
                
                <Card className="p-4 text-center bg-gradient-to-br from-pink-50 to-red-50">
                  <div className="text-3xl mb-2">🔔</div>
                  <h3 className="font-semibold mb-1">Уведомления</h3>
                  <p className="text-xs text-muted-foreground">
                    Получайте важные уведомления о кэшбэке
                  </p>
                </Card>
              </div>
            </section>

            <div className="text-center pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Есть вопросы по установке? Напишите в поддержку через чат в приложении
              </p>
              <Button 
                onClick={() => navigate('/')}
                className="button-3d"
                size="lg"
              >
                Вернуться в приложение
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InstallGuide;
