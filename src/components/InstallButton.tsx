import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (!isStandalone) {
      setTimeout(() => {
        if (!isInstallable) {
          setIsInstallable(true);
        }
      }, 2000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
      }
    } else {
      setShowManualInstructions(true);
    }
  };

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (isStandalone || !isInstallable) return null;

  return (
    <div className="mb-6">
      <Button 
        onClick={handleInstall}
        className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white button-3d glow-purple shadow-2xl"
        size="lg"
      >
        <Icon name="Smartphone" className="mr-2 h-5 w-5" />
        📲 Скачать приложение на телефон
      </Button>
      <p className="text-xs text-center text-muted-foreground mt-2">
        Установите приложение для быстрого доступа
      </p>
      
      {showManualInstructions && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md text-sm">
          <p className="font-bold mb-2">📱 Как установить приложение:</p>
          <div className="space-y-2 text-xs">
            <p><b>Chrome (Android):</b> Меню (⋮) → "Установить приложение"</p>
            <p><b>Safari (iPhone):</b> Поделиться → "На экран Домой"</p>
          </div>
          <button 
            onClick={() => setShowManualInstructions(false)}
            className="mt-3 text-xs text-blue-600 underline"
          >
            Закрыть
          </button>
        </div>
      )}
    </div>
  );
}