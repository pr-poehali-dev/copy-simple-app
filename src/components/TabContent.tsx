import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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

interface TabContentProps {
  activeTab: string;
  purchases: Purchase[];
  cards: CardData[];
  onCategoryClick: (category: typeof CATEGORIES[0]) => void;
  onAddCardClick: () => void;
}

export default function TabContent({
  activeTab,
  purchases,
  cards,
  onCategoryClick,
  onAddCardClick,
}: TabContentProps) {
  if (activeTab === 'shop') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <Card
              className="p-6 cursor-pointer card-3d text-center hover:scale-105 transition-transform"
              onClick={() => onCategoryClick(category)}
              style={{
                transform: 'perspective(1000px) rotateX(2deg)',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="text-5xl mb-3" style={{ textShadow: 'none', filter: 'none' }}>
                {category.emoji}
              </div>
              <p className="font-bold mb-1">{category.name}</p>
              <p className="text-xs text-muted-foreground">
                {category.minPrice}-{category.maxPrice} ₽
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  if (activeTab === 'history') {
    return (
      <div className="space-y-3">
        {purchases.map((purchase) => (
          <Card key={purchase.id} className="p-4 card-3d slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl" style={{ textShadow: 'none', filter: 'none' }}>{purchase.emoji}</div>
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
    );
  }

  if (activeTab === 'cards') {
    return (
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
          onClick={onAddCardClick}
          className="w-full h-12 button-3d"
        >
          <Icon name="Plus" className="mr-2" />
          Добавить карту
        </Button>

        <div className="mt-8 text-center text-xs text-muted-foreground space-y-3 mb-4">
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/install" className="hover:text-primary underline font-medium">
              📲 Инструкция по установке
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-primary underline">
              Политика конфиденциальности
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-primary underline">
              Пользовательское соглашение
            </Link>
          </div>
          <p>© 2024 Копи Просто. Все права защищены.</p>
        </div>
      </div>
    );
  }

  return null;
}