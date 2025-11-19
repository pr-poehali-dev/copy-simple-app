import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      const hasDeclined = localStorage.getItem('pwa-install-declined');
      if (!hasDeclined) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDecline = () => {
    localStorage.setItem('pwa-install-declined', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 soft-shadow animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💰</span>
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">Установить приложение?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Добавьте "Копи Просто" на главный экран для быстрого доступа
            </p>
            
            <div className="flex gap-2">
              <Button onClick={handleInstall} className="flex-1 button-3d">
                <Icon name="Download" className="mr-2" size={18} />
                Установить
              </Button>
              <Button onClick={handleDecline} variant="outline" className="flex-1">
                Позже
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
