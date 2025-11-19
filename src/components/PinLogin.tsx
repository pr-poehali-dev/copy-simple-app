import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { motion } from 'framer-motion';

interface PinLoginProps {
  phone: string;
  onPinSubmit: (pin: string) => void;
  onChangePhone: () => void;
}

export default function PinLogin({ phone, onPinSubmit, onChangePhone }: PinLoginProps) {
  const [pin, setPin] = useState('');

  const handleSubmit = () => {
    if (pin.length === 4) {
      onPinSubmit(pin);
    }
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
            >
              🔓
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Введите PIN-код</h2>
            <p className="text-sm text-muted-foreground">
              Телефон: <span className="font-semibold">{phone}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setPin(value);
                  if (value.length === 4) {
                    setTimeout(() => onPinSubmit(value), 100);
                  }
                }}
                className="text-center text-2xl tracking-widest"
                placeholder="••••"
                autoFocus
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full button-3d"
              size="lg"
              disabled={pin.length !== 4}
            >
              <Icon name="LogIn" className="mr-2 h-5 w-5" />
              Войти
            </Button>

            <Button
              onClick={onChangePhone}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <Icon name="Phone" className="mr-2 h-4 w-4" />
              Сменить номер телефона
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
