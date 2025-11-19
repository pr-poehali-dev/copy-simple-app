import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
            {tab === 'shop' && '🛍️ Покупки'}
            {tab === 'history' && '📜 История'}
            {tab === 'cards' && '💳 Карты'}
          </Button>
        ))}
      </div>
    </>
  );
}