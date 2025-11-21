const CACHE_NAME = 'kopi-prosto-v2';
const STATIC_CACHE = 'kopi-prosto-static-v2';
const DYNAMIC_CACHE = 'kopi-prosto-dynamic-v2';

// Критичные ресурсы для офлайн работы
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.poehali.dev/projects/d169fa6d-9f43-4d19-81ea-a0b486accf9a/files/41903661-daaf-4dcf-8f94-3765d131e23b.jpg'
];

// Установка service worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch((error) => {
          console.error('[SW] Failed to cache assets:', error);
          // Продолжаем даже если кеширование не удалось
          return Promise.resolve();
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Активация и очистка старых кешей
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Стратегия кеширования
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Статика - Cache First
  if (STATIC_ASSETS.includes(request.url) || request.url.includes('.jpg') || request.url.includes('.png')) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((fetchResponse) => {
          return caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      }).catch(() => {
        // Офлайн фолбек для изображений
        return new Response('Offline', { status: 503 });
      })
    );
    return;
  }

  // API запросы - Network First с кешем
  if (url.hostname.includes('functions.yandexcloud.net')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Кешируем только GET запросы
          if (request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Если сеть недоступна, пробуем взять из кеша
          return caches.match(request).then((response) => {
            return response || new Response(JSON.stringify({ error: 'Офлайн режим' }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // Остальные запросы - Network First
  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request).then((response) => {
          return response || caches.match('/index.html');
        });
      })
  );
});