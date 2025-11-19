import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AVATARS = [
  { id: 'boy_blonde', emoji: '🧍‍♂️', name: 'Блондин', gender: 'male' },
  { id: 'boy_brunette', emoji: '🕴️', name: 'Брюнет', gender: 'male' },
  { id: 'boy_ginger', emoji: '🧑‍🦰', name: 'Рыжий', gender: 'male' },
  { id: 'boy_dark', emoji: '🧑🏽', name: 'Темноволосый', gender: 'male' },
  { id: 'girl_blonde', emoji: '🧍‍♀️', name: 'Блондинка', gender: 'female' },
  { id: 'girl_brunette', emoji: '💃', name: 'Брюнетка', gender: 'female' },
  { id: 'girl_ginger', emoji: '🧑‍🦰', name: 'Рыжая', gender: 'female' },
  { id: 'girl_dark', emoji: '🧑🏽‍🦱', name: 'Темноволосая', gender: 'female' },
  { id: 'cat', emoji: '🐱', name: 'Котик', gender: 'neutral' },
  { id: 'tiger', emoji: '🐯', name: 'Тигрёнок', gender: 'neutral' },
  { id: 'panda', emoji: '🐼', name: 'Панда', gender: 'neutral' },
  { id: 'koala', emoji: '🐨', name: 'Коала', gender: 'neutral' },
  { id: 'fox', emoji: '🦊', name: 'Лисёнок', gender: 'neutral' },
  { id: 'alien', emoji: '👽', name: 'Инопланетянин', gender: 'neutral' },
  { id: 'bear', emoji: '🐻', name: 'Мишка', gender: 'neutral' },
  { id: 'rabbit', emoji: '🐰', name: 'Зайчик', gender: 'neutral' },
];

const LANGUAGES = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'hy', name: 'Հայերեն', flag: '🇦🇲' },
  { code: 'uz', name: 'Oʻzbekcha', flag: '🇺🇿' },
  { code: 'ky', name: 'Кыргызча', flag: '🇰🇬' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
];

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

interface AuthScreenProps {
  showAvatarSelect: boolean;
  showLanguageSelect: boolean;
  phone: string;
  setPhone: (phone: string) => void;
  selectedAvatar: string;
  setSelectedAvatar: (avatar: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  agreedToTerms: boolean;
  setAgreedToTerms: (agreed: boolean) => void;
  onAuth: () => void;
  onAvatarSelect: () => void;
  onLanguageSelect: () => void;
}

export default function AuthScreen({
  showAvatarSelect,
  showLanguageSelect,
  phone,
  setPhone,
  selectedAvatar,
  setSelectedAvatar,
  selectedLanguage,
  setSelectedLanguage,
  agreedToTerms,
  setAgreedToTerms,
  onAuth,
  onAvatarSelect,
  onLanguageSelect,
}: AuthScreenProps) {
  if (showAvatarSelect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl p-8 card-3d slide-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-3d">Выберите аватар</h2>
            <p className="text-muted-foreground">Он будет жить в вашей комнате</p>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-8">
            {AVATARS.map((avatar) => (
              <Card
                key={avatar.id}
                className={`p-4 cursor-pointer card-3d transition-all duration-300 ${
                  selectedAvatar === avatar.id ? 'ring-4 ring-primary glow-blue scale-105' : ''
                }`}
                onClick={() => setSelectedAvatar(avatar.id)}
              >
                <div className="text-center">
                  <div className="text-5xl mb-2">{avatar.emoji}</div>
                  <p className="text-xs font-medium">{avatar.name}</p>
                </div>
              </Card>
            ))}
          </div>

          <Button 
            onClick={onAvatarSelect}
            className="w-full h-12 text-lg button-3d"
          >
            Продолжить
          </Button>
        </Card>
      </div>
    );
  }

  if (showLanguageSelect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl p-8 card-3d slide-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-3d">Выберите язык</h2>
            <p className="text-muted-foreground">Choose your language</p>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-8 max-h-96 overflow-y-auto">
            {LANGUAGES.map((lang) => (
              <Card
                key={lang.code}
                className={`p-4 cursor-pointer card-3d transition-all duration-300 ${
                  selectedLanguage === lang.code ? 'ring-4 ring-primary glow-blue scale-105' : ''
                }`}
                onClick={() => setSelectedLanguage(lang.code)}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{lang.flag}</div>
                  <p className="text-xs font-medium">{lang.name}</p>
                </div>
              </Card>
            ))}
          </div>

          <Button 
            onClick={onLanguageSelect}
            className="w-full h-12 text-lg button-3d"
          >
            Начать
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 card-3d bounce-in">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 text-3d bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{fontFamily: 'Georgia, serif'}}>
            Kopi
          </h1>
          <p className="text-muted-foreground">Покупай виртуально, копи реально!</p>
        </div>
        
        <div className="space-y-4">
          <Input 
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-14 text-lg soft-shadow"
          />
          
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
              Я соглашаюсь с{' '}
              <Link to="/privacy" className="text-primary underline">политикой конфиденциальности</Link>
              {' '}и{' '}
              <Link to="/terms" className="text-primary underline">пользовательским соглашением</Link>
            </label>
          </div>

          <Button 
            onClick={onAuth}
            className="w-full h-14 text-lg button-3d"
            disabled={!agreedToTerms}
          >
            Войти
          </Button>
          
          <div className="text-center text-xs text-muted-foreground mt-4">
            © 2024 Копи Просто. Все права защищены.
          </div>
        </div>
      </Card>
    </div>
  );
}