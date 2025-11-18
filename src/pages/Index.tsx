import { useState, useEffect } from 'react';
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
  { id: 1, name: 'Одежда', emoji: '👕', minPrice: 500, maxPrice: 15000 },
  { id: 2, name: 'Еда', emoji: '🍔', minPrice: 200, maxPrice: 3000 },
  { id: 3, name: 'Транспорт', emoji: '🚗', minPrice: 100, maxPrice: 5000 },
  { id: 4, name: 'Развлечения', emoji: '🎬', minPrice: 300, maxPrice: 8000 },
  { id: 5, name: 'Здоровье', emoji: '💊', minPrice: 500, maxPrice: 10000 },
  { id: 6, name: 'Образование', emoji: '📚', minPrice: 1000, maxPrice: 50000 },
  { id: 7, name: 'Дом', emoji: '🏠', minPrice: 1000, maxPrice: 100000 },
  { id: 8, name: 'Путешествия', emoji: '✈️', minPrice: 5000, maxPrice: 100000 },
  { id: 9, name: 'Электроника', emoji: '📱', minPrice: 3000, maxPrice: 100000 },
  { id: 10, name: 'Подарки', emoji: '🎁', minPrice: 500, maxPrice: 20000 },
  { id: 11, name: 'Напитки', emoji: '🥤', minPrice: 50, maxPrice: 1000 },
  { id: 12, name: 'Другое', emoji: '❓', minPrice: 50, maxPrice: 100000 },
];

const AVATARS = [
  { id: 'boy_blonde', emoji: '👱‍♂️', name: 'Блондин', gender: 'male' },
  { id: 'boy_brunette', emoji: '👨🏻', name: 'Брюнет', gender: 'male' },
  { id: 'boy_ginger', emoji: '👨🏻‍🦰', name: 'Рыжий', gender: 'male' },
  { id: 'boy_dark', emoji: '👨🏽', name: 'Темноволосый', gender: 'male' },
  { id: 'girl_blonde', emoji: '👱‍♀️', name: 'Блондинка', gender: 'female' },
  { id: 'girl_brunette', emoji: '👩🏻', name: 'Брюнетка', gender: 'female' },
  { id: 'girl_ginger', emoji: '👩🏻‍🦰', name: 'Рыжая', gender: 'female' },
  { id: 'girl_dark', emoji: '👩🏽', name: 'Темноволосая', gender: 'female' },
  { id: 'cat', emoji: '🐱', name: 'Котик', gender: 'neutral' },
  { id: 'tiger', emoji: '🐯', name: 'Тигрёнок', gender: 'neutral' },
  { id: 'panda', emoji: '🐼', name: 'Панда', gender: 'neutral' },
  { id: 'koala', emoji: '🐨', name: 'Коала', gender: 'neutral' },
  { id: 'fox', emoji: '🦊', name: 'Лисёнок', gender: 'neutral' },
  { id: 'alien', emoji: '👽', name: 'Инопланетянин', gender: 'neutral' },
  { id: 'bear', emoji: '🐻', name: 'Мишка', gender: 'neutral' },
  { id: 'rabbit', emoji: '🐰', name: 'Зайчик', gender: 'neutral' },
];

const LANGUAGES = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'hy', name: 'Հայերեն', flag: '🇦🇲' },
  { code: 'uz', name: 'Oʻzbekcha', flag: '🇺🇿' },
  { code: 'ky', name: 'Кыргызча', flag: '🇰🇬' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
];

interface User {
  id: number;
  phone: string;
  balance: number;
  total_spent: number;
  first_purchase_date: string | null;
  is_unlocked: boolean;
  avatar: string;
  language: string;
  inventory: any[];
  withdrawal_window_start: string | null;
  withdrawal_window_end: string | null;
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
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showCustomAmount, setShowCustomAmount] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[0] | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('boy_blonde');
  const [selectedLanguage, setSelectedLanguage] = useState('ru');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [avatarAction, setAvatarAction] = useState('idle');
  const { toast } = useToast();

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
    setShowAvatarSelect(false);
    setShowLanguageSelect(true);
  };

  const handleLanguageSelect = async () => {
    try {
      const res = await fetch(API_BASE.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, avatar: selectedAvatar, language: selectedLanguage })
      });
      const data = await res.json();
      
      if (data.user) {
        setUser(data.user);
        setShowAuth(false);
        setShowLanguageSelect(false);
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

  const handleCategoryClick = (category: typeof CATEGORIES[0]) => {
    if (category.id === 12) {
      setSelectedCategory(category);
      setShowCustomAmount(true);
    } else {
      const randomPrice = Math.floor(Math.random() * (category.maxPrice - category.minPrice + 1)) + category.minPrice;
      handlePurchase(category, randomPrice);
    }
  };

  const handleCustomPurchase = () => {
    const amount = parseFloat(customAmount);
    if (!selectedCategory || isNaN(amount) || amount < 50 || amount > 100000) {
      toast({ title: 'Ошибка', description: 'Введите сумму от 50 до 100000 ₽', variant: 'destructive' });
      return;
    }
    handlePurchase(selectedCategory, amount);
    setShowCustomAmount(false);
    setCustomAmount('');
  };

  const handlePurchase = async (category: typeof CATEGORIES[0], price: number) => {
    if (!user) return;

    if (cards.length === 0) {
      toast({ title: 'Добавьте карту', description: 'Сначала привяжите банковскую карту', variant: 'destructive' });
      setActiveTab('cards');
      return;
    }

    try {
      const res = await fetch(API_BASE.purchases, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          category: category.name,
          price: price,
          emoji: category.emoji
        })
      });
      const data = await res.json();
      if (data.purchase) {
        setUser({ ...user, balance: data.balance, total_spent: data.total_spent });
        setPurchases([data.purchase, ...purchases]);
        
        setAvatarAction(category.emoji);
        setTimeout(() => setAvatarAction('idle'), 2000);
        
        toast({ 
          title: '✅ Покупка совершена!', 
          description: `+${data.purchase.cashback.toFixed(0)} ₽ кэшбэк (80%)` 
        });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось совершить покупку', variant: 'destructive' });
    }
  };

  const handleAddCard = async () => {
    if (!user || cardNumber.length !== 4 || !cardHolder.trim()) {
      toast({ title: 'Ошибка', description: 'Введите последние 4 цифры карты и имя держателя', variant: 'destructive' });
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
    return AVATARS.find(a => a.id === avatarId)?.emoji || '👱‍♂️';
  };

  const daysUntilUnlock = user?.first_purchase_date 
    ? Math.max(0, Math.ceil((new Date(user.first_purchase_date).getTime() + 180 * 24 * 60 * 60 * 1000 - Date.now()) / (24 * 60 * 60 * 1000)))
    : 180;
  
  const withdrawalWindowDaysLeft = user?.withdrawal_window_end
    ? Math.max(0, Math.ceil((new Date(user.withdrawal_window_end).getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0;
  
  const isWithdrawalAvailable = user?.is_unlocked && user?.withdrawal_window_end && withdrawalWindowDaysLeft > 0;

  if (showAuth && !showAvatarSelect && !showLanguageSelect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 card-3d bounce-in">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💰</div>
            <h1 className="text-4xl font-bold mb-2 text-3d bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
              Копи Просто
            </h1>
            <p className="text-muted-foreground">Покупай виртуально, копи реально!</p>
          </div>
          
          <div className="space-y-4">
            <Input 
              placeholder="+7 (___) ___-__-__"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-14 text-lg soft-shadow"
            />
            <Button 
              onClick={handleAuth}
              className="w-full h-14 text-lg button-3d"
            >
              Войти
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (showAvatarSelect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl p-8 card-3d slide-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-3d">Выберите аватар</h2>
            <p className="text-muted-foreground">Он будет жить в вашей комнате</p>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-8">
            {AVATARS.map((avatar) => (
              <Card
                key={avatar.id}
                className={`p-4 cursor-pointer card-3d transition-all duration-300 ${
                  selectedAvatar === avatar.id ? 'ring-4 ring-primary glow-blue scale-105' : ''
                }`}
                onClick={() => setSelectedAvatar(avatar.id)}
              >
                <div className="text-center">
                  <div className="text-5xl mb-2">{avatar.emoji}</div>
                  <p className="text-xs font-medium">{avatar.name}</p>
                </div>
              </Card>
            ))}
          </div>

          <Button 
            onClick={handleAvatarSelect}
            className="w-full h-12 text-lg button-3d"
          >
            Продолжить
          </Button>
        </Card>
      </div>
    );
  }

  if (showLanguageSelect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl p-8 card-3d slide-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-3d">Выберите язык</h2>
            <p className="text-muted-foreground">Choose your language</p>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-8 max-h-96 overflow-y-auto">
            {LANGUAGES.map((lang) => (
              <Card
                key={lang.code}
                className={`p-4 cursor-pointer card-3d transition-all duration-300 ${
                  selectedLanguage === lang.code ? 'ring-4 ring-primary glow-blue scale-105' : ''
                }`}
                onClick={() => setSelectedLanguage(lang.code)}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{lang.flag}</div>
                  <p className="text-xs font-medium">{lang.name}</p>
                </div>
              </Card>
            ))}
          </div>

          <Button 
            onClick={handleLanguageSelect}
            className="w-full h-12 text-lg button-3d"
          >
            Начать
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      <div className="container mx-auto p-4 pb-32">
        <Card className="mb-6 p-6 card-3d">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{getAvatarEmoji(user?.avatar || 'boy_blonde')}</div>
              <div>
                <h2 className="text-2xl font-bold text-3d">
                  {user?.balance.toFixed(0)} ₽
                </h2>
                <p className="text-sm text-muted-foreground">Накоплено</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="text-lg px-4 py-2 soft-shadow">
                {user?.total_spent.toFixed(0)} ₽ потрачено
              </Badge>
            </div>
          </div>
          
          {!isWithdrawalAvailable && user?.first_purchase_date && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>До вывода средств</span>
                <span className="font-bold">{daysUntilUnlock} дней</span>
              </div>
              <Progress value={(180 - daysUntilUnlock) / 180 * 100} className="h-3" />
            </div>
          )}
          
          {isWithdrawalAvailable && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white card-3d">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg">Окно вывода открыто!</p>
                  <p className="text-sm">Осталось {withdrawalWindowDaysLeft} {withdrawalWindowDaysLeft === 1 ? 'день' : 'дня'}</p>
                </div>
                <Button className="bg-white text-primary hover:bg-gray-100 button-3d">
                  Вывести
                </Button>
              </div>
            </div>
          )}
        </Card>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['shop', 'history', 'cards'].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              variant={activeTab === tab ? 'default' : 'outline'}
              className={`button-3d ${activeTab === tab ? 'glow-blue' : ''}`}
            >
              {tab === 'shop' && '🛍️ Покупки'}
              {tab === 'history' && '📜 История'}
              {tab === 'cards' && '💳 Карты'}
            </Button>
          ))}
        </div>

        {activeTab === 'shop' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((category) => (
              <Card
                key={category.id}
                className="p-6 cursor-pointer card-3d text-center"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="text-5xl mb-3">{category.emoji}</div>
                <p className="font-bold mb-1">{category.name}</p>
                <p className="text-xs text-muted-foreground">
                  {category.minPrice}-{category.maxPrice} ₽
                </p>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="p-4 card-3d slide-up">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{purchase.emoji}</div>
                    <div>
                      <p className="font-bold">{purchase.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(purchase.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{purchase.price.toFixed(0)} ₽</p>
                    <p className="text-sm text-green-600">+{purchase.cashback.toFixed(0)} ₽</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="space-y-3">
            {cards.map((card) => (
              <Card key={card.id} className="p-4 card-3d">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="CreditCard" size={32} className="text-primary" />
                    <div>
                      <p className="font-bold">**** {card.card_number}</p>
                      <p className="text-sm text-muted-foreground">{card.card_holder}</p>
                    </div>
                  </div>
                  {card.is_primary && (
                    <Badge className="soft-shadow">Основная</Badge>
                  )}
                </div>
              </Card>
            ))}
            
            <Button 
              onClick={() => setShowAddCard(true)}
              className="w-full h-12 button-3d"
            >
              <Icon name="Plus" className="mr-2" />
              Добавить карту
            </Button>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-64 avatar-room p-6">
        <div className="flex items-center justify-center h-full">
          <div className={`text-9xl transition-transform duration-500 ${
            avatarAction !== 'idle' ? 'scale-110 bounce-in' : ''
          }`}>
            {getAvatarEmoji(user?.avatar || 'boy_blonde')}
          </div>
          {avatarAction !== 'idle' && (
            <div className="absolute text-6xl animate-bounce">
              {avatarAction}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent className="card-3d">
          <DialogHeader>
            <DialogTitle>Добавить карту</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              placeholder="Последние 4 цифры"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.slice(0, 4))}
              maxLength={4}
              className="soft-shadow"
            />
            <Input 
              placeholder="Имя держателя"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="soft-shadow"
            />
            <Button onClick={handleAddCard} className="w-full button-3d">
              Добавить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCustomAmount} onOpenChange={setShowCustomAmount}>
        <DialogContent className="card-3d">
          <DialogHeader>
            <DialogTitle>Укажите сумму покупки</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              type="number"
              placeholder="От 50 до 100000 ₽"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              min={50}
              max={100000}
              className="soft-shadow"
            />
            <Button onClick={handleCustomPurchase} className="w-full button-3d">
              Совершить покупку
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
