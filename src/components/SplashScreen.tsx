import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center animate-bounce-slow">
        <img
          src="https://cdn.poehali.dev/projects/d169fa6d-9f43-4d19-81ea-a0b486accf9a/files/41903661-daaf-4dcf-8f94-3765d131e23b.jpg"
          alt="Kopi"
          className="w-32 h-32 mx-auto mb-6 rounded-3xl shadow-2xl animate-pulse"
        />
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{fontFamily: 'Georgia, serif'}}>
          Kopi
        </h1>
        <p className="text-gray-600 mt-2 text-sm">Загрузка...</p>
      </div>
    </div>
  );
}
