import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { motion } from 'framer-motion';

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

interface MainDashboardProps {
  user: User | null;
  getAvatarEmoji: (avatarId: string) => string;
  daysUntilUnlock: number;
  withdrawalWindowDaysLeft: number;
  isWithdrawalAvailable: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onWithdrawClick: () => void;
}

export default function MainDashboard({
  user,
  getAvatarEmoji,
  daysUntilUnlock,
  withdrawalWindowDaysLeft,
  isWithdrawalAvailable,
  activeTab,
  setActiveTab,
  onWithdrawClick,
}: MainDashboardProps) {
  return (
    <>
      <Card className="mb-6 p-6 card-3d">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              className="text-6xl"
              style={{ textShadow: 'none', filter: 'none' }}
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              {getAvatarEmoji(user?.avatar || 'boy_blonde')}
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-3d flex items-center gap-2">
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Icon name="PiggyBank" className="h-6 w-6 text-primary" />
                </motion.span>
                {user?.balance.toFixed(0)} ₽
              </h2>
              <p className="text-sm text-muted-foreground font-semibold">Вы уже накопили</p>
            </div>
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
              <Button 
                onClick={onWithdrawClick}
                className="bg-white text-primary hover:bg-gray-100 button-3d"
              >
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
            <span style={{ textShadow: 'none', filter: 'none' }}>
              {tab === 'shop' && '🛍️'}
              {tab === 'history' && '📜'}
              {tab === 'cards' && '💳'}
            </span>
            {tab === 'shop' && ' Покупки'}
            {tab === 'history' && ' История'}
            {tab === 'cards' && ' Карты'}
          </Button>
        ))}
      </div>
    </>
  );
}