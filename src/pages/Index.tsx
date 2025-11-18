import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const API_BASE = {
  auth: 'https://functions.poehali.dev/d983c386-5964-4e1e-9851-a74fc94a4552',
  purchases: 'https://functions.poehali.dev/10de9f3e-f972-47c6-b7ec-3adb2a2f8bfd',
  cards: 'https://functions.poehali.dev/a808261e-c994-4e0e-80ef-10687abc7f19',
  withdraw: 'https://functions.poehali.dev/e768f672-7f7c-412d-9465-5fcab8231d25'
};

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

const AVATARS = [
  { id: 'boy', emoji: '👦', name: 'Мальчик' },
  { id: 'girl', emoji: '👧', name: 'Девочка' },
  { id: 'cat', emoji: '🐱', name: 'Котик' },
  { id: 'tiger', emoji: '🐯', name: 'Тигрёнок' },
  { id: 'panda', emoji: '🐼', name: 'Панда' },
  { id: 'koala', emoji: '🐨', name: 'Коала' },
  { id: 'fox', emoji: '🦊', name: 'Лисёнок' },
  { id: 'alien', emoji: '👽', name: 'Инопланетянин' },
];

interface User {
  id: number;
  phone: string;
  balance: number;
  total_spent: number;
  first_purchase_date: string | null;
  is_unlocked: boolean;
  avatar: string;
}

interface CardData {
  id: number;
  card_number: string;
  card_holder: string;
  is_primary: boolean;
  created_at: string;
}

interface Purchase {
  id: number;
  category: string;
  price: number;
  cashback: number;
  emoji: string;
  created_at: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [activeTab, setActiveTab] = useState('shop');
  const [showAuth, setShowAuth] = useState(true);
  const [showAvatarSelect, setShowAvatarSelect] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [phone, setPhone] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('boy');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const { toast } = useToast();

  const daysUntilUnlock = user?.first_purchase_date 
    ? Math.max(0, Math.ceil((new Date(user.first_purchase_date).getTime() + 180 * 24 * 60 * 60 * 1000 - Date.now()) / (24 * 60 * 60 * 1000)))
    : 180;
  const isUnlocked = daysUntilUnlock === 0;

  const handleAuth = async () => {
    if (!phone.trim()) {
      toast({ title: 'Ошибка', description: 'Введите номер телефона', variant: 'destructive' });
      return;
    }

    try {
      const res = await fetch(API_BASE.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      
      if (data.needs_avatar) {
        setShowAvatarSelect(true);
      } else if (data.user) {
        setUser(data.user);
        setShowAuth(false);
        loadUserData(data.user.id);
        toast({ title: 'Вход выполнен', description: `Добро пожаловать!` });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось войти', variant: 'destructive' });
    }
  };

  const handleAvatarSelect = async () => {
    try {
      const res = await fetch(API_BASE.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, avatar: selectedAvatar })
      });
      const data = await res.json();
      
      if (data.user) {
        setUser(data.user);
        setShowAuth(false);
        setShowAvatarSelect(false);
        toast({ title: 'Добро пожаловать!', description: 'Аккаунт успешно создан' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось создать аккаунт', variant: 'destructive' });
    }
  };

  const loadUserData = async (userId: number) => {
    try {
      const [purchasesRes, cardsRes] = await Promise.all([
        fetch(`${API_BASE.purchases}?user_id=${userId}`),
        fetch(`${API_BASE.cards}?user_id=${userId}`)
      ]);
      const purchasesData = await purchasesRes.json();
      const cardsData = await cardsRes.json();
      if (purchasesData.purchases) setPurchases(purchasesData.purchases);
      if (cardsData.cards) setCards(cardsData.cards);
    } catch (error) {
      console.error('Failed to load user data', error);
    }
  };

  const handlePurchase = async (category: typeof CATEGORIES[0]) => {
    if (!user) return;

    try {
      const res = await fetch(API_BASE.purchases, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          category: category.name,
          price: category.price,
          emoji: category.emoji
        })
      });
      const data = await res.json();
      if (data.purchase) {
        setUser({ ...user, balance: data.balance, total_spent: data.total_spent });
        setPurchases([data.purchase, ...purchases]);
        toast({ 
          title: '✅ Покупка совершена!', 
          description: `+${data.purchase.cashback.toFixed(0)} ₽ на счёт (80% кэшбэк)` 
        });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось совершить покупку', variant: 'destructive' });
    }
  };

  const handleAddCard = async () => {
    if (!user || cardNumber.length !== 4 || !cardHolder.trim()) {
      toast({ title: 'Ошибка', description: 'Заполните все поля корректно', variant: 'destructive' });
      return;
    }

    try {
      const res = await fetch(API_BASE.cards, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          card_number: cardNumber,
          card_holder: cardHolder.toUpperCase()
        })
      });
      const data = await res.json();
      if (data.card) {
        setCards([data.card, ...cards]);
        setShowAddCard(false);
        setCardNumber('');
        setCardHolder('');
        toast({ title: 'Карта добавлена', description: 'Теперь можно совершать покупки' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось добавить карту', variant: 'destructive' });
    }
  };

  const getAvatarEmoji = (avatarId: string) => {
    return AVATARS.find(a => a.id === avatarId)?.emoji || '👦';
  };

  if (showAvatarSelect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 animate-scale-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Выберите аватар</h2>
            <p className="text-muted-foreground">Он будет отображаться в вашем профиле</p>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-8">
            {AVATARS.map((avatar) => (
              <Card
                key={avatar.id}
                className={`p-6 cursor-pointer hover:shadow-xl transition-all duration-300 ${
                  selectedAvatar === avatar.id ? 'ring-4 ring-primary shadow-xl scale-105' : ''
                }`}
                onClick={() => setSelectedAvatar(avatar.id)}
              >
                <div className="text-center">
                  <div className="text-5xl mb-2">{avatar.emoji}</div>
                  <p className="text-sm font-medium">{avatar.name}</p>
                </div>
              </Card>
            ))}
          </div>

          <Button 
            className="w-full h-12 text-lg bg-gradient-to-r from-primary to-secondary"
            onClick={handleAvatarSelect}
          >
            Продолжить
          </Button>
        </Card>
      </div>
    );
  }

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 animate-scale-in">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl mx-auto mb-4 flex items-center justify-center text-4xl">
              💰
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
              Копи Просто
            </h1>
            <p className="text-muted-foreground">Покупай виртуально, копи реально</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Номер телефона</label>
              <Input
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-lg"
              />
            </div>
            <Button 
              className="w-full h-12 text-lg bg-gradient-to-r from-primary to-secondary"
              onClick={handleAuth}
            >
              Войти / Зарегистрироваться
            </Button>
          </div>

          <div className="mt-8 p-4 bg-muted rounded-xl space-y-2 text-sm">
            <p className="font-semibold">🎁 Как это работает:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Покупай виртуальные товары</li>
              <li>• Получай 80% кэшбэк на счёт</li>
              <li>• Через 6 месяцев выводи деньги</li>
            </ul>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto p-4 pb-24">
        <header className="mb-8 pt-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Копи Просто
              </h1>
              <p className="text-muted-foreground mt-1">{user?.phone}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => setShowAuth(true)}
            >
              <Icon name="LogOut" size={24} />
            </Button>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-blue-100 to-red-100 rounded-2xl border-2 border-blue-200">
            <p className="text-center text-lg font-semibold text-primary">
              ✨ Завтра всегда больше чем сегодня — Копи Просто
            </p>
          </div>

          <Card className="p-6 bg-gradient-to-br from-primary to-secondary text-white shadow-lg animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm mb-1">Ваш баланс</p>
                <h2 className="text-4xl font-bold">{user?.balance.toFixed(2)} ₽</h2>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                +80% кэшбэк
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
                <p className="font-semibold text-lg">{user?.total_spent.toFixed(0)} ₽</p>
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
            variant={activeTab === 'cards' ? 'default' : 'outline'}
            onClick={() => setActiveTab('cards')}
            className="rounded-full"
          >
            <Icon name="CreditCard" size={16} className="mr-2" />
            Карты
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
                  <p className="text-xs text-green-600 font-semibold">+{(category.price * 0.80).toFixed(0)} ₽ на счёт</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="space-y-4 animate-fade-in">
            {isUnlocked && user && user.balance > 0 && (
              <Card className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <h3 className="text-xl font-bold mb-2">💰 Вывод средств доступен!</h3>
                <p className="mb-4 text-white/90">Доступно к выводу: {user.balance.toFixed(2)} ₽</p>
                <Button 
                  variant="secondary" 
                  className="w-full bg-white text-green-700 hover:bg-white/90"
                  onClick={async () => {
                    if (!user || cards.length === 0) {
                      toast({ title: 'Ошибка', description: 'Добавьте карту для вывода', variant: 'destructive' });
                      return;
                    }
                    try {
                      const res = await fetch(API_BASE.withdraw, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          user_id: user.id,
                          amount: user.balance,
                          card_id: cards[0].id
                        })
                      });
                      const data = await res.json();
                      if (data.payment_url) {
                        window.open(data.payment_url, '_blank');
                        toast({ title: 'Вывод оформлен!', description: 'Откройте новое окно для оплаты' });
                      }
                    } catch (error) {
                      toast({ title: 'Ошибка', description: 'Не удалось оформить вывод', variant: 'destructive' });
                    }
                  }}
                >
                  Вывести на карту
                </Button>
              </Card>
            )}

            <Button onClick={() => setShowAddCard(true)} className="w-full h-14 text-lg">
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить карту
            </Button>

            {cards.length === 0 ? (
              <Card className="p-12 text-center">
                <Icon name="CreditCard" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Добавьте карту для покупок</p>
              </Card>
            ) : (
              cards.map((card) => (
                <Card key={card.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="CreditCard" size={24} className="text-primary" />
                        <span className="font-mono text-lg">•••• {card.card_number}</span>
                        {card.is_primary && <Badge>Основная</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{card.card_holder}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'avatar' && (
          <div className="animate-fade-in">
            <Card className="p-8">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-6">Ваш аватар</h3>
                <div className="relative w-64 h-64 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-red-100 rounded-full flex items-center justify-center overflow-hidden">
                  <div className="text-6xl mb-4">{getAvatarEmoji(user?.avatar || 'boy')}</div>
                  <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-2 p-4">
                    {purchases.slice(-6).map((purchase, idx) => (
                      <span key={idx} className="text-3xl animate-scale-in">
                        {purchase.emoji}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {purchases.length === 0 ? 'Совершите покупки, чтобы украсить аватар' : `Собрано предметов: ${purchases.length}`}
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
              purchases.map((purchase, idx) => (
                <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{purchase.emoji}</div>
                      <div>
                        <h4 className="font-semibold">{purchase.category}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(purchase.created_at).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{purchase.price} ₽</p>
                      <p className="text-sm text-green-600 font-semibold">+{purchase.cashback.toFixed(0)} ₽</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить карту</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Последние 4 цифры карты</label>
              <Input
                type="text"
                maxLength={4}
                placeholder="1234"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Имя владельца (как на карте)</label>
              <Input
                type="text"
                placeholder="IVAN IVANOV"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
              />
            </div>
            <Button onClick={handleAddCard} className="w-full">
              Добавить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;