import * as React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Оптимизация загрузки
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Предварительная загрузка критичных ресурсов
    const preloadResources = () => {
      const links = [
        { rel: 'preconnect', href: 'https://functions.yandexcloud.net' },
        { rel: 'preconnect', href: 'https://cdn.poehali.dev' },
        { rel: 'dns-prefetch', href: 'https://mc.yandex.ru' }
      ];
      
      links.forEach(({ rel, href }) => {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        document.head.appendChild(link);
      });
    };
    
    preloadResources();
  });
}

createRoot(document.getElementById("root")!).render(<App />);