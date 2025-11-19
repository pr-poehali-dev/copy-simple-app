import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import confetti from 'canvas-confetti';

interface Prize {
  id: string;
  label: string;
  value: number;
  type: 'fixed' | 'percent';
  color: string;
  probability: number;
}

const PRIZES: Prize[] = [
  { id: '1', label: '+200₽', value: 200, type: 'fixed', color: '#FF6B6B', probability: 0.25 },
  { id: '2', label: '+3%', value: 3, type: 'percent', color: '#4ECDC4', probability: 0.20 },
  { id: '3', label: '+500₽', value: 500, type: 'fixed', color: '#FFE66D', probability: 0.20 },
  { id: '4', label: '+5%', value: 5, type: 'percent', color: '#95E1D3', probability: 0.15 },
  { id: '5', label: '+1000₽', value: 1000, type: 'fixed', color: '#A8E6CF', probability: 0.10 },
  { id: '6', label: '+10%', value: 10, type: 'percent', color: '#FFDAC1', probability: 0.05 },
  { id: '7', label: '+5000₽', value: 5000, type: 'fixed', color: '#FF8B94', probability: 0.05 },
];

interface WheelOfFortuneProps {
  open: boolean;
  onClose: () => void;
  onSpin: (prize: Prize) => void;
  userBalance: number;
  userId: string;
  spinCount: number;
}

const WheelOfFortune = ({ open, onClose, onSpin, userBalance, userId, spinCount }: WheelOfFortuneProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [showResult, setShowResult] = useState(false);

  const selectPrize = (): Prize => {
    if (spinCount === 0) {
      return PRIZES.find(p => p.value === 1000 && p.type === 'fixed')!;
    }

    const userNumber = parseInt(userId.replace(/\D/g, '')) || 0;
    const isThousandthUser = userNumber > 0 && userNumber % 1000 === 0;
    
    if (spinCount === 1 && isThousandthUser) {
      return PRIZES.find(p => p.value === 10 && p.type === 'percent')!;
    }

    if (spinCount === 3) {
      return PRIZES.find(p => p.value === 5 && p.type === 'percent')!;
    }

    const random = Math.random();
    let cumulativeProbability = 0;
    
    const adjustedPrizes = PRIZES.map(prize => {
      if (prize.value === 5000) {
        return { ...prize, probability: prize.probability * 0.3 };
      }
      return prize;
    });
    
    const totalProb = adjustedPrizes.reduce((sum, p) => sum + p.probability, 0);
    
    for (const prize of adjustedPrizes) {
      cumulativeProbability += prize.probability / totalProb;
      if (random <= cumulativeProbability) {
        return prize;
      }
    }
    
    return PRIZES[0];
  };

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowResult(false);
    
    const prize = selectPrize();
    setSelectedPrize(prize);
    
    const prizeIndex = PRIZES.findIndex(p => p.id === prize.id);
    const segmentAngle = 360 / PRIZES.length;
    const targetAngle = 360 - (prizeIndex * segmentAngle + segmentAngle / 2);
    const spinRotations = 5;
    const finalRotation = rotation + (spinRotations * 360) + targetAngle;
    
    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setShowResult(true);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => {
        onSpin(prize);
      }, 2000);
    }, 4000);
  };

  const segmentAngle = 360 / PRIZES.length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-50 to-pink-50 border-none">
        <div className="flex flex-col items-center gap-6 py-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Колесо Фортуны
            </h2>
            <p className="text-sm text-gray-600">
              {spinCount === 0 ? 'Первое вращение — гарантированный приз!' : 'Испытайте свою удачу!'}
            </p>
          </div>

          <div className="relative w-80 h-80">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-500 drop-shadow-lg" />
            </div>

            <div 
              className="w-full h-full rounded-full relative overflow-hidden shadow-2xl border-8 border-white"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              }}
            >
              {PRIZES.map((prize, index) => {
                const startAngle = index * segmentAngle;
                const endAngle = (index + 1) * segmentAngle;
                
                return (
                  <div
                    key={prize.id}
                    className="absolute w-full h-full flex items-center justify-center"
                    style={{
                      transform: `rotate(${startAngle}deg)`,
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((segmentAngle * Math.PI) / 180)}% ${50 - 50 * Math.cos((segmentAngle * Math.PI) / 180)}%)`,
                      transformOrigin: 'center',
                    }}
                  >
                    <div
                      className="w-full h-full flex items-start justify-center pt-8"
                      style={{ 
                        backgroundColor: prize.color,
                        transform: `rotate(${segmentAngle / 2}deg)`,
                      }}
                    >
                      <span className="text-white font-bold text-lg drop-shadow-md">
                        {prize.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-xl border-4 border-yellow-400 flex items-center justify-center z-20">
              <Icon name="Sparkles" className="text-yellow-500" size={32} />
            </div>
          </div>

          {!showResult ? (
            <Button
              onClick={handleSpin}
              disabled={isSpinning}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-6 text-lg"
            >
              {isSpinning ? (
                <>
                  <Icon name="Loader2" className="animate-spin mr-2" />
                  Крутим...
                </>
              ) : (
                <>
                  <Icon name="Play" className="mr-2" />
                  Крутить колесо
                </>
              )}
            </Button>
          ) : selectedPrize ? (
            <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
              <div className="text-3xl">🎉</div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-purple-600">
                  Поздравляем!
                </h3>
                <p className="text-lg font-semibold">
                  Вы выиграли:{' '}
                  <span className="text-pink-600">
                    {selectedPrize.type === 'fixed' 
                      ? `${selectedPrize.value}₽` 
                      : `+${selectedPrize.value}% (${Math.round(userBalance * selectedPrize.value / 100)}₽)`
                    }
                  </span>
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WheelOfFortune;
