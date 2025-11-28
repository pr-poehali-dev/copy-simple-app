import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { motion } from 'framer-motion';

interface PinSetupProps {
  phone: string;
  onPinSet: (pin: string) => void;
}

export default function PinSetup({ phone, onPinSet }: PinSetupProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (pin.length !== 4) {
      setError('PIN должен содержать 4 цифры');
      return;
    }
    if (pin !== confirmPin) {
      setError('PIN-коды не совпадают');
      return;
    }
    onPinSet(pin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 max-w-md w-full card-3d">
          <div className="text-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-6xl mb-4"
              style={{ textShadow: 'none', filter: 'none' }}
            >
              🔐
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Создайте PIN-код</h2>
            <p className="text-sm text-muted-foreground">
              Для безопасного входа в приложение
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Введите 4-значный PIN
              </label>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setPin(value);
                  setError('');
                }}
                className="text-center text-2xl tracking-widest"
                placeholder="••••"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Подтвердите PIN
              </label>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setConfirmPin(value);
                  setError('');
                }}
                className="text-center text-2xl tracking-widest"
                placeholder="••••"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Icon name="AlertCircle" className="h-4 w-4" />
                  {error}
                </p>
              </motion.div>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full button-3d"
              size="lg"
              disabled={pin.length !== 4 || confirmPin.length !== 4}
            >
              <Icon name="Check" className="mr-2 h-5 w-5" />
              Создать PIN-код
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Телефон: <span className="font-semibold">{phone}</span>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}