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
              className="h-12 soft-shadow"
            />
            <Input 
              placeholder="Имя держателя карты"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="h-12 soft-shadow"
            />
            <Button onClick={onAddCard} className="w-full h-12 button-3d">
              Добавить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCustomAmount} onOpenChange={setShowCustomAmount}>
        <DialogContent className="card-3d">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory?.emoji} {selectedCategory?.name}
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
