import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

interface AppDialogsProps {
  showAddCard: boolean;
  setShowAddCard: (show: boolean) => void;
  showCustomAmount: boolean;
  setShowCustomAmount: (show: boolean) => void;
  selectedCategory: typeof CATEGORIES[0] | null;
  customAmount: string;
  setCustomAmount: (amount: string) => void;
  cardNumber: string;
  setCardNumber: (number: string) => void;
  cardHolder: string;
  setCardHolder: (holder: string) => void;
  onAddCard: () => void;
  onCustomPurchase: () => void;
  showCookieConsent: boolean;
  onCookieConsent: () => void;
}

export default function AppDialogs({
  showAddCard,
  setShowAddCard,
  showCustomAmount,
  setShowCustomAmount,
  selectedCategory,
  customAmount,
  setCustomAmount,
  cardNumber,
  setCardNumber,
  cardHolder,
  setCardHolder,
  onAddCard,
  onCustomPurchase,
  showCookieConsent,
  onCookieConsent,
}: AppDialogsProps) {
  return (
    <>
      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent className="card-3d max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center"><span style={{ textShadow: 'none', filter: 'none' }}>💳</span> Добавить карту</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="relative">
              <div className="w-full h-48 rounded-2xl shadow-2xl p-6 flex flex-col justify-between text-white" 
                   style={{
                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                     transform: 'perspective(1000px) rotateY(-5deg)',
                   }}>
                <div className="flex justify-between items-start">
                  <div className="text-2xl font-bold" style={{ textShadow: 'none', filter: 'none' }}>💳</div>
                  <div className="text-xs opacity-75">Копи Просто</div>
                </div>
                
                <div>
                  <div className="text-xl tracking-wider font-mono mb-2">
                    {cardNumber ? `•••• •••• •••• ${cardNumber}` : '•••• •••• •••• ••••'}
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="text-xs opacity-75">VALID</div>
                  <div className="text-xs opacity-75">MM/YY</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Последние 4 цифры карты</label>
                <Input 
                  placeholder="1234"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  className="h-14 text-center text-2xl tracking-widest font-mono soft-shadow"
                  type="tel"
                />
              </div>
            </div>
            
            <Button 
              onClick={onAddCard} 
              className="w-full h-14 button-3d text-lg"
              disabled={cardNumber.length !== 4}
            >
              Добавить карту
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              <span style={{ textShadow: 'none', filter: 'none' }}>🔒</span> Мы храним только последние 4 цифры для идентификации карты
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCustomAmount} onOpenChange={setShowCustomAmount}>
        <DialogContent className="card-3d" style={{ minHeight: 'auto', height: 'auto' }}>
          <DialogHeader>
            <DialogTitle>
              <span style={{ textShadow: 'none', filter: 'none' }}>{selectedCategory?.emoji}</span> {selectedCategory?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              Введите сумму от {selectedCategory?.minPrice} до {selectedCategory?.maxPrice} ₽
            </div>
            <Input 
              type="number"
              placeholder="Сумма покупки"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="h-14 text-lg text-center soft-shadow"
              inputMode="numeric"
            />
            <Button onClick={onCustomPurchase} className="w-full h-12 button-3d">
              Купить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {showCookieConsent && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <div className="bg-card border rounded-lg p-4 shadow-lg card-3d max-w-md mx-auto">
            <p className="text-sm mb-3">
              Мы используем cookies для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с использованием cookies.
            </p>
            <Button onClick={onCookieConsent} className="w-full button-3d">
              Принять
            </Button>
          </div>
        </div>
      )}
    </>
  );
}