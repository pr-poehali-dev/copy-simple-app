import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

const CATEGORIES = [
  { id: 1, name: 'Кофе', icon: 'Coffee', price: 350, emoji: '☕' },
  { id: 2, name: 'Одежда', icon: 'ShirtIcon', price: 5000, emoji: '👕' },
  { id: 3, name: 'Аксессуары', icon: 'Watch', price: 3000, emoji: '⌚' },
  { id: 4, name: 'Телефон', icon: 'Smartphone', price: 50000, emoji: '📱' },
  { id: 5, name: 'Наушники', icon: 'Headphones', price: 8000, emoji: '🎧' },
  { id: 6, name: 'Обувь', icon: 'FootprintsIcon', price: 7000, emoji: '👟' },
  { id: 7, name: 'Книги', icon: 'Book', price: 800, emoji: '📚' },
  { id: 8, name: 'Еда', icon: 'UtensilsCrossed', price: 1500, emoji: '🍔' },
  { id: 9, name: 'Косметика', icon: 'Sparkles', price: 2500, emoji: '💄' },
  { id: 10, name: 'Спорт', icon: 'Dumbbell', price: 4000, emoji: '🏋️' },
];

const Index = () => {
  const [balance, setBalance] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('shop');
  const [avatarItems, setAvatarItems] = useState<string[]>([]);
  
  const firstPurchaseDate = purchases.length > 0 ? new Date(purchases[0].date) : null;
  const unlockDate = firstPurchaseDate ? new Date(firstPurchaseDate.getTime() + 180 * 24 * 60 * 60 * 1000) : null;
  const daysUntilUnlock = unlockDate ? Math.max(0, Math.ceil((unlockDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))) : 180;
  const isUnlocked = daysUntilUnlock === 0;

  const handlePurchase = (category: typeof CATEGORIES[0]) => {
    const cashback = category.price * 0.15;
    setBalance(prev => prev + cashback);
    setTotalSpent(prev => prev + category.price);
    setPurchases(prev => [...prev, {
      ...category,
      date: new Date().toISOString(),
      cashback
    }]);
    setAvatarItems(prev => [...prev, category.emoji]);
  };

  const handleWithdraw = () => {
    if (isUnlocked && balance > 0) {
      alert(`Вы вывели ${balance.toFixed(2)} ₽ на карту!`);
      setBalance(0);
      setPurchases([]);
      setAvatarItems([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 pb-24">
        <header className="mb-8 pt-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Копи Просто
              </h1>
              <p className="text-muted-foreground mt-1">Покупай и копи 15% с каждой покупки</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon name="Bell" size={24} />
            </Button>
          </div>

          <Card className="p-6 bg-gradient-to-br from-primary to-secondary text-white shadow-lg animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm mb-1">Ваш баланс</p>
                <h2 className="text-4xl font-bold">{balance.toFixed(2)} ₽</h2>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                +15% кэшбэк
              </Badge>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm text-white/90">
                <span>До вывода средств</span>
                <span className="font-semibold">{isUnlocked ? 'Доступно!' : `${daysUntilUnlock} дней`}</span>
              </div>
              <Progress value={isUnlocked ? 100 : ((180 - daysUntilUnlock) / 180) * 100} className="h-2 bg-white/20" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/70">Всего потрачено</p>
                <p className="font-semibold text-lg">{totalSpent.toFixed(0)} ₽</p>
              </div>
              <div>
                <p className="text-white/70">Покупок</p>
                <p className="font-semibold text-lg">{purchases.length}</p>
              </div>
            </div>
          </Card>
        </header>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={activeTab === 'shop' ? 'default' : 'outline'}
            onClick={() => setActiveTab('shop')}
            className="rounded-full"
          >
            <Icon name="ShoppingBag" size={16} className="mr-2" />
            Магазин
          </Button>
          <Button
            variant={activeTab === 'avatar' ? 'default' : 'outline'}
            onClick={() => setActiveTab('avatar')}
            className="rounded-full"
          >
            <Icon name="User" size={16} className="mr-2" />
            Аватар
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'outline'}
            onClick={() => setActiveTab('history')}
            className="rounded-full"
          >
            <Icon name="History" size={16} className="mr-2" />
            История
          </Button>
        </div>

        {activeTab === 'shop' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-fade-in">
            {CATEGORIES.map((category) => (
              <Card
                key={category.id}
                className="p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105"
                onClick={() => handlePurchase(category)}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center text-4xl group-hover:animate-pulse-glow transition-all">
                    {category.emoji}
                  </div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-1">{category.price} ₽</p>
                  <p className="text-xs text-muted-foreground">+{(category.price * 0.15).toFixed(0)} ₽ кэшбэк</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'avatar' && (
          <div className="animate-fade-in">
            <Card className="p-8">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-6">Ваш аватар</h3>
                <div className="relative w-64 h-64 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center overflow-hidden">
                  <div className="text-6xl mb-4">🧑</div>
                  <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-2 p-4">
                    {avatarItems.slice(-6).map((emoji, idx) => (
                      <span key={idx} className="text-3xl animate-scale-in">
                        {emoji}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {avatarItems.length === 0 ? 'Совершите покупки, чтобы украсить аватар' : `Собрано предметов: ${avatarItems.length}`}
                </p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3 animate-fade-in">
            {purchases.length === 0 ? (
              <Card className="p-12 text-center">
                <Icon name="ShoppingCart" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">История покупок пуста</p>
              </Card>
            ) : (
              purchases.slice().reverse().map((purchase, idx) => (
                <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{purchase.emoji}</div>
                      <div>
                        <h4 className="font-semibold">{purchase.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(purchase.date).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{purchase.price} ₽</p>
                      <p className="text-sm text-green-600">+{purchase.cashback.toFixed(0)} ₽</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex gap-3">
          <Button
            className="flex-1 h-14 text-lg rounded-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            disabled={!isUnlocked || balance === 0}
            onClick={handleWithdraw}
          >
            <Icon name="Wallet" size={20} className="mr-2" />
            {isUnlocked ? `Вывести ${balance.toFixed(0)} ₽` : `Заблокировано на ${daysUntilUnlock} дней`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
