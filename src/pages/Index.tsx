import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import AuthScreen from '@/components/AuthScreen';
import MainDashboard from '@/components/MainDashboard';
import TabContent from '@/components/TabContent';
import AppDialogs from '@/components/AppDialogs';
import SplashScreen from '@/components/SplashScreen';
import WheelOfFortune from '@/components/WheelOfFortune';
import InstallButton from '@/components/InstallButton';
import SupportChat from '@/components/SupportChat';
import MotivationSection from '@/components/MotivationSection';
import PinSetup from '@/components/PinSetup';
import PinLogin from '@/components/PinLogin';

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
  { id: 'boy_blonde', emoji: '🧍‍♂️', name: 'Блондин', gender: 'male' },
  { id: 'boy_brunette', emoji: '🕴️', name: 'Брюнет', gender: 'male' },
  { id: 'boy_ginger', emoji: '🧑‍🦰', name: 'Рыжий', gender: 'male' },
  { id: 'boy_dark', emoji: '🧑🏽', name: 'Темноволосый', gender: 'male' },
  { id: 'girl_blonde', emoji: '🧍‍♀️', name: 'Блондинка', gender: 'female' },
  { id: 'girl_brunette', emoji: '💃', name: 'Брюнетка', gender: 'female' },
  { id: 'girl_ginger', emoji: '🧑‍🦰', name: 'Рыжая', gender: 'female' },
  { id: 'girl_dark', emoji: '🧑🏽‍🦱', name: 'Темноволосая', gender: 'female' },
  { id: 'cat', emoji: '🐱', name: 'Котик', gender: 'neutral' },
  { id: 'tiger', emoji: '🐯', name: 'Тигрёнок', gender: 'neutral' },
  { id: 'panda', emoji: '🐼', name: 'Панда', gender: 'neutral' },
  { id: 'koala', emoji: '🐨', name: 'Коала', gender: 'neutral' },
  { id: 'fox', emoji: '🦊', name: 'Лисёнок', gender: 'neutral' },
  { id: 'alien', emoji: '👽', name: 'Инопланетянин', gender: 'neutral' },
  { id: 'bear', emoji: '🐻', name: 'Мишка', gender: 'neutral' },
  { id: 'rabbit', emoji: '🐰', name: 'Зайчик', gender: 'neutral' },
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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [showWheelOfFortune, setShowWheelOfFortune] = useState(false);
  const [wheelSpinCount, setWheelSpinCount] = useState(0);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showPinLogin, setShowPinLogin] = useState(false);
  const [storedPhone, setStoredPhone] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent === 'accepted') {
      setShowCookieConsent(false);
    }

    const savedPhone = localStorage.getItem('userPhone');
    const savedPin = localStorage.getItem('userPin');
    if (savedPhone && savedPin) {
      setStoredPhone(savedPhone);
      setShowPinLogin(true);
      setShowAuth(false);
    }
  }, []);

  const handleCookieConsent = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowCookieConsent(false);
  };

  const handleAuth = async () => {
    if (!phone.trim()) {
      toast({ title: 'Ошибка', description: 'Введите номер телефона', variant: 'destructive' });
      return;
    }

    if (!agreedToTerms) {
      toast({ title: 'Требуется согласие', description: 'Примите соглашение о персональных данных', variant: 'destructive' });
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
        const savedPin = localStorage.getItem('userPin');
        const savedPhone = localStorage.getItem('userPhone');
        
        if (!savedPin || savedPhone !== phone) {
          setShowPinSetup(true);
          setShowAuth(false);
        } else {
          setUser(data.user);
          setShowAuth(false);
          loadUserData(data.user.id);
          toast({ title: 'Вход выполнен', description: `Добро пожаловать!` });
        }
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
        setShowLanguageSelect(false);
        setShowPinSetup(true);
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось создать аккаунт', variant: 'destructive' });
    }
  };

  const handlePinSet = async (pin: string) => {
    localStorage.setItem('userPhone', phone);
    localStorage.setItem('userPin', pin);
    
    try {
      const res = await fetch(API_BASE.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, avatar: selectedAvatar, language: selectedLanguage })
      });
      const data = await res.json();
      
      if (data.user) {
        setUser(data.user);
        setShowPinSetup(false);
        setShowAuth(false);
        loadUserData(data.user.id);
        toast({ title: 'Добро пожаловать!', description: 'Аккаунт успешно создан' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось создать аккаунт', variant: 'destructive' });
    }
  };

  const handlePinLogin = async (pin: string) => {
    const savedPin = localStorage.getItem('userPin');
    
    if (pin !== savedPin) {
      toast({ title: 'Ошибка', description: 'Неверный PIN-код', variant: 'destructive' });
      return;
    }
    
    setShowSplash(true);
    setTimeout(() => setShowSplash(false), 3000);

    try {
      const res = await fetch(API_BASE.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: storedPhone })
      });
      const data = await res.json();
      
      if (data.user) {
        setUser(data.user);
        setShowPinLogin(false);
        loadUserData(data.user.id);
        toast({ title: 'Вход выполнен', description: 'Добро пожаловать обратно!' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось войти', variant: 'destructive' });
    }
  };

  const handleChangePhone = () => {
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userPin');
    setShowPinLogin(false);
    setShowAuth(true);
    setStoredPhone('');
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
      
      const spinCount = parseInt(localStorage.getItem(`wheel_spin_count_${userId}`) || '0');
      setWheelSpinCount(spinCount);
    } catch (error) {
      console.error('Failed to load user data', error);
    }
  };

  const handleCategoryClick = (category: typeof CATEGORIES[0]) => {
    setSelectedCategory(category);
    setShowCustomAmount(true);
  };

  const handleCustomPurchase = () => {
    if (!selectedCategory) return;
    
    const amount = parseFloat(customAmount);
    const minPrice = selectedCategory.minPrice;
    const maxPrice = selectedCategory.maxPrice;
    
    if (isNaN(amount) || amount < minPrice || amount > maxPrice) {
      toast({ 
        title: 'Ошибка', 
        description: `Введите сумму от ${minPrice} до ${maxPrice} ₽`, 
        variant: 'destructive' 
      });
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
        
        const audio = new Audio('https://cdn.poehali.dev/intertnal/sounds/applause.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});
        
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

  const handleWithdrawClick = () => {
    setShowWheelOfFortune(true);
  };

  const handleWheelSpin = (prize: any) => {
    if (!user) return;
    
    const newSpinCount = wheelSpinCount + 1;
    setWheelSpinCount(newSpinCount);
    localStorage.setItem(`wheel_spin_count_${user.id}`, newSpinCount.toString());
    
    const bonusAmount = prize.type === 'fixed' 
      ? prize.value 
      : Math.round(user.balance * prize.value / 100);
    
    const newBalance = user.balance + bonusAmount;
    setUser({ ...user, balance: newBalance });
    
    setTimeout(() => {
      setShowWheelOfFortune(false);
      toast({ 
        title: '🎉 Поздравляем!', 
        description: `Вы выиграли ${bonusAmount}₽! Теперь можете вывести средства.`,
        duration: 5000
      });
    }, 2500);
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

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (showPinLogin) {
    return (
      <PinLogin
        phone={storedPhone}
        onPinSubmit={handlePinLogin}
        onChangePhone={handleChangePhone}
      />
    );
  }

  if (showPinSetup) {
    return (
      <PinSetup
        phone={phone}
        onPinSet={handlePinSet}
      />
    );
  }

  if (showAuth && !showAvatarSelect && !showLanguageSelect) {
    return (
      <AuthScreen
        showAvatarSelect={showAvatarSelect}
        showLanguageSelect={showLanguageSelect}
        phone={phone}
        setPhone={setPhone}
        selectedAvatar={selectedAvatar}
        setSelectedAvatar={setSelectedAvatar}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        agreedToTerms={agreedToTerms}
        setAgreedToTerms={setAgreedToTerms}
        onAuth={handleAuth}
        onAvatarSelect={handleAvatarSelect}
        onLanguageSelect={handleLanguageSelect}
      />
    );
  }

  if (showAvatarSelect) {
    return (
      <AuthScreen
        showAvatarSelect={showAvatarSelect}
        showLanguageSelect={showLanguageSelect}
        phone={phone}
        setPhone={setPhone}
        selectedAvatar={selectedAvatar}
        setSelectedAvatar={setSelectedAvatar}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        agreedToTerms={agreedToTerms}
        setAgreedToTerms={setAgreedToTerms}
        onAuth={handleAuth}
        onAvatarSelect={handleAvatarSelect}
        onLanguageSelect={handleLanguageSelect}
      />
    );
  }

  if (showLanguageSelect) {
    return (
      <AuthScreen
        showAvatarSelect={showAvatarSelect}
        showLanguageSelect={showLanguageSelect}
        phone={phone}
        setPhone={setPhone}
        selectedAvatar={selectedAvatar}
        setSelectedAvatar={setSelectedAvatar}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        agreedToTerms={agreedToTerms}
        setAgreedToTerms={setAgreedToTerms}
        onAuth={handleAuth}
        onAvatarSelect={handleAvatarSelect}
        onLanguageSelect={handleLanguageSelect}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      <div className="container mx-auto p-4 pb-32">
        <InstallButton />
        <MotivationSection />
        
        <MainDashboard
          user={user}
          getAvatarEmoji={getAvatarEmoji}
          daysUntilUnlock={daysUntilUnlock}
          withdrawalWindowDaysLeft={withdrawalWindowDaysLeft}
          isWithdrawalAvailable={isWithdrawalAvailable}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onWithdrawClick={handleWithdrawClick}
        />

        <TabContent
          activeTab={activeTab}
          purchases={purchases}
          cards={cards}
          onCategoryClick={handleCategoryClick}
          onAddCardClick={() => setShowAddCard(true)}
        />
        
        {user && <SupportChat userId={user.id} />}
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

      <AppDialogs
        showAddCard={showAddCard}
        setShowAddCard={setShowAddCard}
        showCustomAmount={showCustomAmount}
        setShowCustomAmount={setShowCustomAmount}
        selectedCategory={selectedCategory}
        customAmount={customAmount}
        setCustomAmount={setCustomAmount}
        cardNumber={cardNumber}
        setCardNumber={setCardNumber}
        cardHolder={cardHolder}
        setCardHolder={setCardHolder}
        onAddCard={handleAddCard}
        onCustomPurchase={handleCustomPurchase}
        showCookieConsent={showCookieConsent}
        onCookieConsent={handleCookieConsent}
      />

      <WheelOfFortune
        open={showWheelOfFortune}
        onClose={() => setShowWheelOfFortune(false)}
        onSpin={handleWheelSpin}
        userBalance={user?.balance || 0}
        userId={user?.id.toString() || '0'}
        spinCount={wheelSpinCount}
      />
    </div>
  );
};

export default Index;