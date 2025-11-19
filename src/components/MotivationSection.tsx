import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { motion } from 'framer-motion';

export default function MotivationSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-6"
    >
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-800 card-3d">
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="text-5xl"
          >
            ☕
          </motion.div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-3 text-gradient">
              Как накопить на мечту? Просто!
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Icon name="Coffee" className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                <p><span className="font-semibold text-foreground">Покупайте виртуальный кофе</span> каждый день — вместо реального кофе за 200₽, "купите" его у нас!</p>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="PiggyBank" className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                <p><span className="font-semibold text-foreground">Получайте 10% кэшбэк</span> — деньги накапливаются на вашем счёте автоматически</p>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Rocket" className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                <p><span className="font-semibold text-foreground">Копите 6 месяцев</span> — выберите свою сумму и категорию, совершайте покупки регулярно</p>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Gift" className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                <p><span className="font-semibold text-foreground">Выведите накопления</span> — через 6 месяцев откроется окно вывода на 3 дня!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-white/60 dark:bg-black/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="AlertCircle" className="h-5 w-5 text-orange-500" />
            <h4 className="font-bold text-orange-700 dark:text-orange-400">Важные правила:</h4>
          </div>
          <ul className="text-sm space-y-1 text-muted-foreground ml-7">
            <li>• Деньги можно вывести только <span className="font-semibold text-foreground">через 6 месяцев</span> после первой покупки</li>
            <li>• Окно вывода открывается на <span className="font-semibold text-foreground">3 дня</span> — не упустите момент!</li>
            <li>• Совершайте покупки <span className="font-semibold text-foreground">каждый день</span> для максимального эффекта</li>
            <li>• Вы сами указываете сумму в каждой категории — будьте реалистичны</li>
          </ul>
        </div>
      </Card>
    </motion.div>
  );
}
